import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const AdminAddresses = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.listAddresses();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load addresses');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white border rounded-xl shadow-sm ring-1 ring-rose-50">
        <div className="px-4 py-3 border-b font-semibold">User Addresses</div>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
          <>
            <div className="sm:hidden divide-y">
              {rows.map(a => (
                <div key={a._id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{a.userId?.name || a.fullName}</div>
                    <div className="text-xs text-gray-500">{a.addressType}</div>
                  </div>
                  <div className="text-xs text-gray-500">{a.userId?.email || ''}</div>
                  <div className="text-sm text-gray-700 mt-1">{a.mobileNumber || a.alternatePhone || ''}</div>
                  <div className="text-sm text-gray-700 mt-1">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</div>
                  <div className="text-xs text-gray-500">{a.city}, {a.state} - {a.pincode}</div>
                  <div className="text-xs text-gray-500 mt-1">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-sm">
              <thead className="bg-rose-50/60 text-rose-700">
                <tr className="text-left border-b border-rose-100">
                  <th className="p-2">User</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">City/State</th>
                  <th className="p-2">Pincode</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(a => (
                  <tr key={a._id} className="border-b hover:bg-rose-50/40">
                    <td className="p-2">
                      <div className="font-medium">{a.userId?.name || a.fullName}</div>
                      <div className="text-gray-500">{a.userId?.email || ''}</div>
                    </td>
                    <td className="p-2">{a.mobileNumber || a.alternatePhone || ''}</td>
                    <td className="p-2">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</td>
                    <td className="p-2">{a.city}, {a.state}</td>
                    <td className="p-2">{a.pincode}</td>
                    <td className="p-2">{a.addressType}</td>
                    <td className="p-2">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAddresses;
