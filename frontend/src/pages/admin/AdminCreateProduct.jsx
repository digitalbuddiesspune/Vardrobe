import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { api } from '../../utils/api';

const initialForm = {
  title: '',
  mrp: '',
  discountPercent: 0,
  description: '',
  category: '',
  images: { image1: '' },
  product_info: {
    brand: '',
    manufacturer: '',
    SareeLength: '',
    SareeMaterial: '',
    SareeColor: '',
    IncludedComponents: '',
  },
};

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      navigate('/admin/products');
    } catch (e2) {
      setError(e2.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="bg-white border rounded-xl shadow-sm ring-1 ring-rose-50">
        <div className="px-4 py-3 border-b font-semibold">Create Product</div>
        <form onSubmit={submit} className="p-4 space-y-3">
          {error && <div className="text-red-600">{error}</div>}
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
          <input name="mrp" type="number" value={form.mrp} onChange={onChange} placeholder="MRP" className="w-full border rounded px-3 py-2" required />
          <input name="discountPercent" type="number" value={form.discountPercent} onChange={onChange} placeholder="Discount %" className="w-full border rounded px-3 py-2" />
          <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="w-full border rounded px-3 py-2" required />
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border rounded px-3 py-2" rows="3" />
          <div className="grid grid-cols-1 gap-2">
            <input value={form.images.image1} onChange={onChangeNested('images', 'image1')} placeholder="Image URL" className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={form.product_info.brand} onChange={onChangeNested('product_info', 'brand')} placeholder="Brand" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.manufacturer} onChange={onChangeNested('product_info', 'manufacturer')} placeholder="Manufacturer" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeMaterial} onChange={onChangeNested('product_info', 'SareeMaterial')} placeholder="Material" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeColor} onChange={onChangeNested('product_info', 'SareeColor')} placeholder="Color" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeLength} onChange={onChangeNested('product_info', 'SareeLength')} placeholder="Length" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.IncludedComponents} onChange={onChangeNested('product_info', 'IncludedComponents')} placeholder="Included" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded disabled:opacity-60">
              {saving ? 'Saving...' : 'Create Product'}
            </button>
            <Link to="/admin/products" className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProduct;
