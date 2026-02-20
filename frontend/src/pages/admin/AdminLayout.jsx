import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiLogOut, FiSearch, FiUser, FiHome, FiBookOpen, FiImage, FiSliders } from 'react-icons/fi';

const Title = () => {
  const { pathname } = useLocation();
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith('/admin/products')) return 'Products';
  if (pathname.startsWith('/admin/orders')) return 'Orders';
  if (pathname.startsWith('/admin/addresses')) return 'Addresses';
  if (pathname.startsWith('/admin/policies')) return 'Policies';
  if (pathname.startsWith('/admin/logo')) return 'Logo Settings';
  if (pathname.startsWith('/admin/hero-slider')) return 'Hero Slider';
  return 'Admin';
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_is_admin');
    } catch {}
    navigate('/signin', { replace: true });
  };

  const navItem = (to, label, Icon) => (
    <NavLink
      to={to}
      end={to === '/admin'}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        'flex items-center gap-3 px-4 py-2 rounded-md transition-colors ' +
        (isActive
          ? 'bg-white/15 text-white'
          : 'text-blue-100 hover:bg-white/10 hover:text-white')
      }
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </NavLink>
  );

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-gradient-to-b from-blue-900 to-blue-700 text-white p-4 space-y-2 shadow-xl">
          <div className="text-lg font-semibold px-2 py-3">Admin</div>
          {navItem('/admin', 'Dashboard', FiGrid)}
          {navItem('/admin/products', 'Products', FiBox)}
          {navItem('/admin/orders', 'Orders', FiShoppingBag)}
          {navItem('/admin/addresses', 'Addresses', FiHome)}
          {navItem('/admin/policies', 'Policies', FiBookOpen)}
          {navItem('/admin/logo', 'Logo Settings', FiImage)}
          {navItem('/admin/hero-slider', 'Hero Slider', FiSliders)}
          <button
            onClick={logout}
            className="mt-auto flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-white/10 hover:text-white"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </aside>

        {open && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-64 flex flex-col bg-gradient-to-b from-blue-900 to-blue-700 text-white p-4 space-y-2 shadow-xl">
              <div className="text-lg font-semibold px-2 py-3">Admin</div>
              {navItem('/admin', 'Dashboard', FiGrid)}
              {navItem('/admin/products', 'Products', FiBox)}
              {navItem('/admin/orders', 'Orders', FiShoppingBag)}
              {navItem('/admin/addresses', 'Addresses', FiHome)}
              {navItem('/admin/policies', 'Policies', FiBookOpen)}
              {navItem('/admin/logo', 'Logo Settings', FiImage)}
              {navItem('/admin/hero-slider', 'Hero Slider', FiSliders)}
              <button
                onClick={logout}
                className="mt-auto flex items-center gap-3 px-4 py-2 rounded-md text-blue-100 hover:bg-white/10 hover:text-white"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 md:ml-64 h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b px-4 sm:px-6 py-3 flex items-center gap-3">
            <button className="md:hidden p-2 rounded bg-gray-100 text-gray-700" onClick={() => setOpen(true)}>
              <span className="sr-only">Menu</span>
              <div className="w-5 h-0.5 bg-gray-700 mb-1" />
              <div className="w-4 h-0.5 bg-gray-700 mb-1" />
              <div className="w-3 h-0.5 bg-gray-700" />
            </button>
            <h1 className="text-lg font-semibold mr-auto">{<Title />}</h1>
            <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-2">
              <FiSearch className="text-gray-500" />
              <input className="bg-transparent px-2 py-1 outline-none text-sm" placeholder="Search..." />
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              <FiUser />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
