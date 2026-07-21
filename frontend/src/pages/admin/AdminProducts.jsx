import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../utils/api';
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const hiddenAdminCategories = new Set(['watch', 'watches', 'perfume', 'perfumes']);

const isVisibleAdminProduct = (product) =>
  !hiddenAdminCategories.has((product.category || '').trim().toLowerCase());

const AdminProducts = () => {
  const [form, setForm] = useState({
    title: '',
    mrp: '',
    discountPercent: 0,
    description: '',
    category: '',
    images: { image1: '' },
    product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    _id: '',
    mrp: '',
    discountPercent: 0,
    price: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.admin.listProducts();
      setList((Array.isArray(data) ? data : []).filter(isVisibleAdminProduct));
    } catch (e) {
      setError(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeNested = (section, key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: value } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        mrp: Number(form.mrp),
        discountPercent: Number(form.discountPercent) || 0,
        description: form.description,
        category: form.category,
        images: form.images,
        product_info: form.product_info,
      };
      await api.admin.createProduct(payload);
      setToast({ show: true, text: 'Product created', type: 'success' });
      setForm({ title: '', mrp: '', discountPercent: 0, description: '', category: '', images: { image1: '' }, product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' } });
      await load();
    } catch (e2) {
      setError(e2.message || 'Failed to create product');
      setToast({ show: true, text: e2.message || 'Failed to create product', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.admin.deleteProduct(id);
      setToast({ show: true, text: 'Product deleted', type: 'success' });
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete product');
      setToast({ show: true, text: e.message || 'Failed to delete product', type: 'error' });
    }
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    // Ensure _id is a string (MongoDB ObjectIds need to be converted)
    const productId = product._id?.toString ? product._id.toString() : String(product._id || '');
    const mrp = Number(product.mrp) || 0;
    const discountPercent = Number(product.discountPercent) || 0;
    setEditForm({
      _id: productId,
      mrp: mrp,
      discountPercent: discountPercent,
      price: Math.round(mrp - (mrp * discountPercent) / 100)
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditForm({ _id: '', mrp: '', discountPercent: 0, price: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate price if MRP or discount changes
      if ((name === 'mrp' || name === 'discountPercent') && updated.mrp) {
        const mrp = name === 'mrp' ? parseFloat(value) || 0 : parseFloat(prev.mrp) || 0;
        const discount = name === 'discountPercent' ? parseFloat(value) || 0 : parseFloat(prev.discountPercent) || 0;
        updated.price = Math.round(mrp - (mrp * discount) / 100);
      }
      return updated;
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (!editForm._id) {
        throw new Error('Product ID is missing');
      }
      await api.admin.updateProduct(editForm._id, {
        mrp: Number(editForm.mrp),
        discountPercent: Number(editForm.discountPercent) || 0
      });
      setToast({ show: true, text: 'Product updated', type: 'success' });
      await load();
      closeEditModal();
    } catch (e) {
      const errorMessage = e.message || 'Failed to update product';
      setError(errorMessage);
      setToast({ show: true, text: errorMessage, type: 'error' });
      console.error('Error updating product:', e);
    } finally {
      setSaving(false);
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
    }
  };

  const priceFor = (p) => {
    if (p.price !== undefined) return p.price;
    return Math.round((p.mrp || 0) - (p.mrp || 0) * ((p.discountPercent || 0) / 100));
  };

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useMemo(() => {
    const unique = [...new Set(list.map((p) => (p.category || '').trim()).filter(Boolean))];
    return unique.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .filter((p) => {
        const categoryOk =
          categoryFilter === 'all' ||
          (p.category || '').toLowerCase() === categoryFilter.toLowerCase();
        const titleOk = !q || (p.title || '').toLowerCase().includes(q);
        return categoryOk && titleOk;
      })
      .sort((a, b) => {
        const catCmp = (a.category || '').localeCompare(b.category || '', undefined, { sensitivity: 'base' });
        if (catCmp !== 0) return catCmp;
        return (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' });
      });
  }, [list, categoryFilter, query]);

  const totalPages = Math.max(1, Math.ceil((filtered.length || 0) / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [categoryFilter, query, pageSize]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {toast.show && (
        <div className={`${toast.type==='error' ? 'bg-rose-600' : 'bg-amber-600'} fixed bottom-4 right-4 z-50 text-white px-4 py-2 rounded shadow-lg`}>{toast.text}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        <div className="bg-white border rounded-xl shadow-sm ring-1 ring-rose-50 md:sticky md:top-24 md:self-start md:col-span-3">
          <div className="px-4 py-3 border-b font-semibold">Create Product</div>
          <form onSubmit={submit} className="p-4 space-y-3">
            {error && <div className="text-red-600">{error}</div>}
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
            <input name="mrp" type="number" value={form.mrp} onChange={onChange} placeholder="MRP" className="w-full border rounded px-3 py-2" required />
            <input name="discountPercent" type="number" value={form.discountPercent} onChange={onChange} placeholder="Discount %" className="w-full border rounded px-3 py-2" />
            <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="w-full border rounded px-3 py-2" required />
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border rounded px-3 py-2" rows="3" />
            <div className="grid grid-cols-1 gap-2">
              <input value={form.images.image1} onChange={onChangeNested('images','image1')} placeholder="Image URL" className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input value={form.product_info.brand} onChange={onChangeNested('product_info','brand')} placeholder="Brand" className="w-full border rounded px-3 py-2" />
              <input value={form.product_info.manufacturer} onChange={onChangeNested('product_info','manufacturer')} placeholder="Manufacturer" className="w-full border rounded px-3 py-2" />
              <input value={form.product_info.SareeMaterial} onChange={onChangeNested('product_info','SareeMaterial')} placeholder="Material" className="w-full border rounded px-3 py-2" />
              <input value={form.product_info.SareeColor} onChange={onChangeNested('product_info','SareeColor')} placeholder="Color" className="w-full border rounded px-3 py-2" />
              <input value={form.product_info.SareeLength} onChange={onChangeNested('product_info','SareeLength')} placeholder="Length" className="w-full border rounded px-3 py-2" />
              <input value={form.product_info.IncludedComponents} onChange={onChangeNested('product_info','IncludedComponents')} placeholder="Included" className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded">{saving ? 'Saving...' : 'Create Product'}</button>
          </form>
        </div>

        <div className="bg-white border rounded-xl shadow-sm ring-1 ring-rose-50 md:h-[calc(100vh-8rem)] md:flex md:flex-col md:overflow-y-auto md:col-span-7">
          <div className="px-4 py-3 border-b font-semibold">Products</div>
          <div className="p-4 md:flex md:flex-col md:h-full">
            <div className="md:sticky md:top-0 md:z-10 md:bg-white pb-3 pt-1 flex flex-col gap-3 md:border-b">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:max-w-[200px] border rounded px-3 py-2"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={categoryFilter === 'all' ? 'Search by product name' : `Search in ${categoryFilter}`}
                  className="w-full sm:flex-1 border rounded px-3 py-2"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600">
                  {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                  {categoryFilter !== 'all' ? ` in ${categoryFilter}` : ''}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows</span>
                  <select className="border rounded px-2 py-1" value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
            {loading ? (
              <div className="p-4">Loading...</div>
            ) : (
              <>
                <div className="sm:hidden divide-y">
                  {pageItems.map((p) => (
                    <div key={p._id} className="p-3 flex gap-3">
                      <img src={p?.images?.image1} alt="" className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">{p.category || 'Uncategorized'}</div>
                        <div className="font-medium line-clamp-2">{p.title}</div>
                        <div className="mt-1 text-sm text-gray-700 flex items-center gap-2 flex-wrap">
                          <span>₹{priceFor(p).toLocaleString('en-IN')}</span>
                          <span className="text-gray-400 line-through">₹{(p.mrp || 0).toLocaleString('en-IN')}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">{p.discountPercent || 0}% off</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => openEditModal(p)} className="px-2 py-1 text-rose-700 border border-rose-200 rounded">Edit</button>
                          <button onClick={() => remove(p._id)} className="px-2 py-1 text-white bg-rose-600 rounded">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                  <thead className="bg-rose-50/60 text-rose-700">
                    <tr className="text-left border-b border-rose-100">
                      <th className="p-2">Image</th>
                      <th className="p-2 hidden lg:table-cell">Category</th>
                      <th className="p-2">Title</th>
                      <th className="p-2 whitespace-nowrap">Price</th>
                      <th className="p-2 hidden md:table-cell whitespace-nowrap">MRP</th>
                      <th className="p-2 hidden md:table-cell">Discount</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((p) => (
                      <tr key={p._id} className="border-b hover:bg-rose-50/40">
                        <td className="p-2"><img src={p?.images?.image1} alt="" className="w-12 h-12 object-cover rounded" /></td>
                        <td className="p-2 hidden lg:table-cell text-gray-600 whitespace-nowrap">{p.category || '—'}</td>
                        <td className="p-2 max-w-[320px]"><div className="truncate">{p.title}</div></td>
                        <td className="p-2 whitespace-nowrap">₹{priceFor(p).toLocaleString('en-IN')}</td>
                        <td className="p-2 hidden md:table-cell whitespace-nowrap">₹{(p.mrp || 0).toLocaleString('en-IN')}</td>
                        <td className="p-2 hidden md:table-cell">{p.discountPercent || 0}%</td>
                        <td className="p-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => remove(p._id)}
                              className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-full"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between mt-3 md:sticky md:bottom-0 md:bg-white md:-mx-4 md:px-4 md:py-2 md:border-t">
                  <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
                  <div className="flex gap-2">
                    <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className={`px-3 py-1 rounded border ${page<=1? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Prev</button>
                    <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className={`px-3 py-1 rounded border ${page>=totalPages? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Next</button>
                  </div>
                </div>
                </div>
                <div className="sm:hidden flex items-center justify-between mt-3">
                  <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
                  <div className="flex gap-2">
                    <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className={`px-3 py-1 rounded border ${page<=1? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Prev</button>
                    <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className={`px-3 py-1 rounded border ${page>=totalPages? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Next</button>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Edit Product</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="p-4 space-y-4">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                <input
                  type="number"
                  name="mrp"
                  value={editForm.mrp}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="1"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%):</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={editForm.discountPercent}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Selling Price:</div>
                <div className="text-lg font-semibold">
                  ₹{(editForm.price || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (MRP - {editForm.discountPercent || 0}%)
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={saving}
                >
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

export default AdminProducts;
