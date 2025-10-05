import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-mju-blue to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-mju-blue font-bold text-sm">CS</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">ร้านค้าของที่ระลึก</div>
                  <div className="text-blue-100 text-xs -mt-1">สาขาวิทยาการคอมพิวเตอร์</div>
                </div>
              </Link>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-blue-100 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
              >
                หน้าแรก
              </Link>
              <Link
                to="/products"
                className="text-blue-100 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
              >
                สินค้า
              </Link>
              {user && (
                <Link
                  to="/orders"
                  className="text-blue-100 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
                >
                  คำสั่งซื้อ
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-blue-100 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
                >
                  จัดการ
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <Link
                to="/cart"
                className="relative inline-flex items-center p-2 text-blue-100 hover:text-white transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                </svg>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-blue-100">
                  สวัสดี, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-white text-sm leading-4 font-medium rounded-lg text-white hover:bg-white hover:text-mju-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm leading-4 font-medium rounded-lg text-mju-blue bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;