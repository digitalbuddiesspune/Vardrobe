import fs from 'fs';
import mongoose from 'mongoose';
import { Product } from '../models/product.js';

function getMongoUri() {
  const envPath = new URL('../.env', import.meta.url);
  const envRaw = fs.readFileSync(envPath, 'utf8');
  const line = envRaw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('MONGODB_URI=') || l.startsWith('MONGO_URI='));

  if (!line) throw new Error('MONGODB_URI or MONGO_URI not found in backend/.env');
  return line.split('=').slice(1).join('=').trim();
}

function normalizeText(value) {
  return (value || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    mode: 'report',
    category: null,
    keep: 'oldest',
    yes: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--report') opts.mode = 'report';
    if (a === '--list') opts.mode = 'list';
    if (a === '--delete') opts.mode = 'delete';
    if (a === '--category') opts.category = args[i + 1] || null;
    if (a === '--keep') opts.keep = args[i + 1] || 'oldest';
    if (a === '--yes') opts.yes = true;
  }

  return opts;
}

async function loadDuplicateGroups() {
  const docs = await Product.find({})
    .select('_id title category createdAt')
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  const groups = new Map();
  for (const p of docs) {
    const category = (p.category || 'Uncategorized').toString().trim();
    const titleNorm = normalizeText(p.title);
    const key = `${normalizeText(category)}||${titleNorm}`;
    if (!groups.has(key)) {
      groups.set(key, {
        category,
        title: p.title || '',
        titleNorm,
        items: [],
      });
    }
    groups.get(key).items.push(p);
  }

  return [...groups.values()].filter((g) => g.items.length > 1);
}

function buildCategorySummary(dupGroups) {
  const summary = new Map();
  for (const g of dupGroups) {
    if (!summary.has(g.category)) {
      summary.set(g.category, { groups: 0, extra: 0, totalInDuplicateGroups: 0 });
    }
    const s = summary.get(g.category);
    s.groups += 1;
    s.extra += g.items.length - 1;
    s.totalInDuplicateGroups += g.items.length;
  }
  return summary;
}

function printReport(dupGroups) {
  const summary = buildCategorySummary(dupGroups);
  const categories = [...summary.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const totalGroups = dupGroups.length;
  const totalExtra = dupGroups.reduce((n, g) => n + (g.items.length - 1), 0);
  console.log(`Duplicate groups: ${totalGroups}`);
  console.log(`Total duplicate items to remove (extra copies): ${totalExtra}`);
  console.log('---');

  for (const [category, stats] of categories) {
    console.log(
      `${category} | groups: ${stats.groups} | duplicate items: ${stats.extra} | items in duplicate groups: ${stats.totalInDuplicateGroups}`
    );
  }
}

function printCategoryDetails(dupGroups, categoryFilter) {
  const catNorm = normalizeText(categoryFilter);
  const filtered = dupGroups
    .filter((g) => normalizeText(g.category) === catNorm)
    .sort((a, b) => a.titleNorm.localeCompare(b.titleNorm));

  if (!filtered.length) {
    console.log(`No duplicate groups found for category: ${categoryFilter}`);
    return;
  }

  let idx = 1;
  for (const g of filtered) {
    console.log(`\n[${idx}] ${g.title}  (copies: ${g.items.length}, extra: ${g.items.length - 1})`);
    g.items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item._id} | createdAt: ${item.createdAt}`);
    });
    idx += 1;
  }
}

async function deleteCategoryDuplicates(dupGroups, categoryFilter, keep, yesFlag) {
  if (!yesFlag) {
    console.log('Safety check: add --yes to actually delete.');
    return;
  }

  const catNorm = normalizeText(categoryFilter);
  const filtered = dupGroups.filter((g) => normalizeText(g.category) === catNorm);
  if (!filtered.length) {
    console.log(`No duplicate groups found for category: ${categoryFilter}`);
    return;
  }

  const toDelete = [];
  for (const g of filtered) {
    const items = [...g.items].sort((a, b) => {
      if (keep === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    const keepOne = items[0];
    const remove = items.slice(1);
    remove.forEach((r) => toDelete.push(r._id));
    console.log(`Keeping: ${keepOne._id} | ${g.title} | removing: ${remove.length}`);
  }

  if (!toDelete.length) {
    console.log('Nothing to delete.');
    return;
  }

  const result = await Product.deleteMany({ _id: { $in: toDelete } });
  console.log(`Deleted ${result.deletedCount} duplicate products from category "${categoryFilter}".`);
}

async function main() {
  const opts = parseArgs();
  const uri = getMongoUri();
  await mongoose.connect(uri);

  const dupGroups = await loadDuplicateGroups();

  if (opts.mode === 'report') {
    printReport(dupGroups);
  } else if (opts.mode === 'list') {
    if (!opts.category) throw new Error('Please provide --category for --list mode.');
    printCategoryDetails(dupGroups, opts.category);
  } else if (opts.mode === 'delete') {
    if (!opts.category) throw new Error('Please provide --category for --delete mode.');
    await deleteCategoryDuplicates(dupGroups, opts.category, opts.keep, opts.yes);
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
