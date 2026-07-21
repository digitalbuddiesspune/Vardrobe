import { useEffect, useMemo, useState } from 'react';
import { FiEdit, FiFolder, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { api } from '../../utils/api';

const categoryKey = (value) => (value || 'Uncategorized').trim().toLowerCase();
const hiddenAdminCategories = new Set(['watch', 'watches', 'perfume', 'perfumes']);

const isVisibleAdminProduct = (product) =>
  !hiddenAdminCategories.has(categoryKey(product.category));

const priceFor = (product) => {
  if (product.price !== undefined) return product.price;
  return Math.round((product.mrp || 0) * (1 - (product.discountPercent || 0) / 100));
};

const AdminCategories = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.admin.listProducts();
      setProducts((Array.isArray(data) ? data : []).filter(isVisibleAdminProduct));
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const grouped = new Map();
    products.forEach((product) => {
      const key = categoryKey(product.category);
      const current = grouped.get(key);
      if (current) {
        current.count += 1;
      } else {
        grouped.set(key, {
          key,
          name: (product.category || 'Uncategorized').trim(),
          count: 1,
        });
      }
    });
    return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || categoryKey(product.category) === selectedCategory;
      const matchesQuery =
        !normalizedQuery ||
        (product.title || '').toLowerCase().includes(normalizedQuery) ||
        (product.category || '').toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleProducts.slice(start, start + pageSize);
  }, [page, pageSize, visibleProducts]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedCategory, pageSize]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    window.setTimeout(() => setToast(null), 2200);
  };

  const openEdit = (product) => {
    setEditing({
      _id: product._id,
      title: product.title || '',
      category: product.category || '',
      mrp: product.mrp ?? '',
      discountPercent: product.discountPercent ?? 0,
      description: product.description || '',
      image1: product.images?.image1 || '',
    });
    setError('');
  };

  const updateProduct = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      await api.admin.updateProduct(editing._id, {
        title: editing.title.trim(),
        category: editing.category.trim(),
        mrp: Number(editing.mrp),
        discountPercent: Number(editing.discountPercent) || 0,
        description: editing.description,
        images: { image1: editing.image1.trim() },
      });
      setEditing(null);
      await loadProducts();
      showToast('Product updated');
    } catch (err) {
      setError(err.message || 'Failed to update product');
      showToast(err.message || 'Failed to update product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    try {
      setError('');
      await api.admin.deleteProduct(product._id);
      setProducts((current) => current.filter((item) => item._id !== product._id));
      showToast('Product deleted');
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[60] rounded-lg px-4 py-2 text-white shadow-lg ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.text}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Category-wise Products</h2>
        <p className="mt-1 text-sm text-gray-500">Select a category to update or delete its products.</p>
      </div>

      {error && !editing && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-xl border p-4 text-left transition ${selectedCategory === 'all' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'bg-white hover:border-blue-300'}`}
        >
          <FiFolder className="mb-3 h-5 w-5 text-blue-700" />
          <div className="font-medium">All Categories</div>
          <div className="text-sm text-gray-500">{products.length} products</div>
        </button>
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`rounded-xl border p-4 text-left transition ${selectedCategory === category.key ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'bg-white hover:border-blue-300'}`}
          >
            <FiFolder className="mb-3 h-5 w-5 text-blue-700" />
            <div className="truncate font-medium" title={category.name}>{category.name}</div>
            <div className="text-sm text-gray-500">{category.count} products</div>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedCategory === 'all'
                ? 'All Products'
                : categories.find((category) => category.key === selectedCategory)?.name || 'Products'}
            </h3>
            <p className="text-sm text-gray-500">{visibleProducts.length} products found</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2">
              <FiSearch className="text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search products"
              />
            </label>
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="rounded-lg border px-3 py-2 text-sm"
              aria-label="Products per page"
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading products...</div>
        ) : visibleProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found.</div>
        ) : (
          <>
            <div className="divide-y sm:hidden">
              {paginatedProducts.map((product) => (
                <div key={product._id} className="flex gap-3 p-4">
                  <img src={product.images?.image1} alt="" className="h-16 w-16 rounded-lg bg-gray-100 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                    <p className="line-clamp-2 font-medium">{product.title}</p>
                    <p className="mt-1 text-sm">₹{priceFor(product).toLocaleString('en-IN')}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => openEdit(product)} className="rounded border border-blue-200 px-2 py-1 text-sm text-blue-700">Edit</button>
                      <button onClick={() => deleteProduct(product)} className="rounded bg-red-600 px-2 py-1 text-sm text-white">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">MRP</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex min-w-[240px] items-center gap-3">
                          <img src={product.images?.image1} alt="" className="h-12 w-12 rounded-lg bg-gray-100 object-cover" />
                          <span className="max-w-xs truncate font-medium">{product.title}</span>
                        </div>
                      </td>
                      <td className="p-3">{product.category || 'Uncategorized'}</td>
                      <td className="p-3 whitespace-nowrap">₹{priceFor(product).toLocaleString('en-IN')}</td>
                      <td className="p-3 whitespace-nowrap">₹{Number(product.mrp || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3">{product.discountPercent || 0}%</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(product)} className="rounded-full p-2 text-blue-700 hover:bg-blue-50" title="Edit product">
                            <FiEdit />
                          </button>
                          <button onClick={() => deleteProduct(product)} className="rounded-full p-2 text-red-600 hover:bg-red-50" title="Delete product">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t p-4">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Update Product</h3>
              <button onClick={() => setEditing(null)} className="rounded p-1 text-gray-500 hover:bg-gray-100"><FiX /></button>
            </div>
            <form onSubmit={updateProduct} className="space-y-4 p-4">
              {error && <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>}
              <label className="block text-sm font-medium">Title
                <input value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} className="mt-1 w-full rounded border px-3 py-2" required />
              </label>
              <label className="block text-sm font-medium">Category
                <input value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} className="mt-1 w-full rounded border px-3 py-2" required />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium">MRP (₹)
                  <input type="number" min="1" step="0.01" value={editing.mrp} onChange={(event) => setEditing({ ...editing, mrp: event.target.value })} className="mt-1 w-full rounded border px-3 py-2" required />
                </label>
                <label className="block text-sm font-medium">Discount (%)
                  <input type="number" min="0" max="100" value={editing.discountPercent} onChange={(event) => setEditing({ ...editing, discountPercent: event.target.value })} className="mt-1 w-full rounded border px-3 py-2" />
                </label>
              </div>
              <label className="block text-sm font-medium">Image URL
                <input type="url" value={editing.image1} onChange={(event) => setEditing({ ...editing, image1: event.target.value })} className="mt-1 w-full rounded border px-3 py-2" required />
              </label>
              <label className="block text-sm font-medium">Description
                <textarea rows="3" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} className="mt-1 w-full rounded border px-3 py-2" />
              </label>
              <div className="flex justify-end gap-3 border-t pt-4">
                <button type="button" onClick={() => setEditing(null)} className="rounded border px-4 py-2" disabled={saving}>Cancel</button>
                <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
