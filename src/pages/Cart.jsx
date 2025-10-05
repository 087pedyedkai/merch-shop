import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      <div className="flex-shrink-0 w-20 h-20">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              <Link to={`/products/${item.id}`} className="hover:text-blue-600">
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
            <p className="mt-1 text-sm font-medium text-blue-600">
              {formatPrice(item.price)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">
              จำนวน
            </label>
            <select
              id={`quantity-${item.id}`}
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {[...Array(Math.min(item.stock, 10))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-800 p-1"
              title="ลบออกจากตะกร้า"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-500">
            รวม: {formatPrice(item.price * item.quantity)}
          </span>
          {item.quantity > item.stock && (
            <span className="text-red-600">
              มีเพียง {item.stock} ชิ้น
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cartItems, getCartTotal, getCartItemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">กรุณาเข้าสู่ระบบ</h2>
          <p className="mt-2 text-gray-600">เพื่อดูตะกร้าสินค้าของคุณ</p>
          <Link
            to="/login"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ตะกร้าสินค้า</h1>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">ตะกร้าสินค้าว่าง</h3>
          <p className="mt-1 text-sm text-gray-500">
            เริ่มเลือกซื้อสินค้าได้เลย
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              เลือกซื้อสินค้า
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleClearCart = () => {
    if (window.confirm('คุณต้องการล้างตะกร้าสินค้าทั้งหมดใช่หรือไม่?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ตะกร้าสินค้า ({getCartItemCount()} รายการ)
        </h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          ล้างตะกร้า
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* รายการสินค้าในตะกร้า */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* สรุปการสั่งซื้อ */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              สรุปการสั่งซื้อ
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">จำนวนรายการ</span>
                <span className="font-medium">{getCartItemCount()} ชิ้น</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ราคาสินค้า</span>
                <span className="font-medium">{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ค่าจัดส่ง</span>
                <span className="font-medium text-green-600">ฟรี</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-medium">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                ดำเนินการชำระเงิน
              </button>
              
              <Link
                to="/products"
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors duration-200 text-center block"
              >
                เลือกซื้อสินค้าเพิ่ม
              </Link>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>✓ การจัดส่งภายในมหาวิทยาลัย</p>
              <p>✓ รับประกันคุณภาพสินค้า</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;