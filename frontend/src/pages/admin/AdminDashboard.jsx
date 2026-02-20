import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { FiCreditCard, FiShoppingBag, FiBox, FiBookOpen } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.stats();
        const orders = await api.admin.listOrders();
        if (mounted) {
          setStats(data || { totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
          setRecentOrders(Array.isArray(orders) ? orders.slice(0, 6) : []);
        }
      } catch (e) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    const map = {
      created: 'bg-amber-100 text-amber-700 border border-amber-200',
      confirmed: 'bg-amber-100 text-amber-700 border border-amber-200',
      on_the_way: 'bg-amber-100 text-amber-700 border border-amber-200',
      delivered: 'bg-amber-100 text-amber-700 border border-amber-200',
      failed: 'bg-rose-100 text-rose-700 border border-rose-200',
      paid: 'bg-rose-100 text-rose-700 border border-rose-200',
    };
    const cls = map[s] || 'bg-gray-100 text-gray-700 border border-gray-200';
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
  };

  const StatCard = ({ icon: Icon, label, value, gradient }) => {
    const hideIconOnMobile = label === 'Total Revenue';
    return (
      <div className={`rounded-xl p-4 sm:p-5 shadow-sm border bg-gradient-to-b ${gradient}`}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={`${hideIconOnMobile ? 'hidden sm:flex' : 'flex'} h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-white/70 text-gray-700 items-center justify-center flex-shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-auto flex-1 text-right font-bold text-base sm:text-2xl md:text-3xl leading-tight break-words">{value}</div>
        </div>
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-700 font-medium">{label}</div>
      </div>
    );
  };

  const activity = recentOrders.map(o => ({
    id: o._id,
    text: `${o.user?.name || 'Customer'} placed order #${String(o._id).slice(-6)}`,
    time: new Date(o.createdAt).toLocaleString()
  }));

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold">Welcome, Admin!</h1>
        <div className="hidden sm:flex gap-2">
          <Link to="/admin/products" className="px-3 py-2 bg-rose-600 text-white rounded">Manage Products</Link>
          <Link to="/admin/orders" className="px-3 py-2 bg-amber-500 text-white rounded">View Orders</Link>
        </div>
      </div>
      <div className="sm:hidden grid grid-cols-2 gap-2 mb-4">
        <Link to="/admin/products" className="text-center px-3 py-2 bg-rose-600 text-white rounded">Products</Link>
        <Link to="/admin/orders" className="text-center px-3 py-2 bg-amber-500 text-white rounded">Orders</Link>
      </div>
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <StatCard icon={FiCreditCard} label="Total Revenue" value={formatINR(stats.totalRevenue)} gradient="from-amber-50 to-amber-100" />
            <StatCard icon={FiShoppingBag} label="Total Orders" value={stats.totalOrders} gradient="from-rose-50 to-rose-100" />
            <StatCard icon={FiBox} label="Total Products" value={stats.totalProducts} gradient="from-amber-50 to-amber-100" />
            <StatCard icon={FiBookOpen} label="Active Orders" value={recentOrders.length} gradient="from-rose-50 to-rose-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm">
              <div className="px-4 py-3 border-b font-semibold">Recent Orders</div>
              <div className="sm:hidden divide-y">
                {recentOrders.map(o => (
                  <div key={o._id} className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">#{String(o._id).slice(-6)}</div>
                      <div className="text-sm font-semibold">{formatINR(o.amount)}</div>
                    </div>
                    <div className="text-sm text-gray-700">{o.user?.name || ''}</div>
                    <div className="text-xs text-gray-500">{o.user?.email || ''}</div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-3">Order</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o._id} className="border-b">
                        <td className="p-3">#{String(o._id).slice(-6)}</td>
                        <td className="p-3">{o.user?.name || ''}<div className="text-gray-500">{o.user?.email || ''}</div></td>
                        <td className="p-3">{o.items?.length || 0}</td>
                        <td className="p-3">₹{Number(o.amount || 0).toLocaleString('en-IN')}</td>
                        <td className="p-3"><StatusBadge status={o.status} /></td>
                        <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm">
              <div className="px-4 py-3 border-b font-semibold">Activity Feed</div>
              <div className="p-4 space-y-3">
                {activity.length === 0 ? (
                  <div className="text-sm text-gray-500">No recent activity</div>
                ) : (
                  activity.map(a => (
                    <div key={a.id} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-400" />
                      <div>
                        <div className="text-sm">{a.text}</div>
                        <div className="text-xs text-gray-500">{a.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
