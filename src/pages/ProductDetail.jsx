import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart, isInCart, getCartItem } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">ไม่พบสินค้า</h2>
          <p className="mt-2 text-gray-600">สินค้าที่คุณค้นหาไม่มีอยู่ในระบบ</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            กลับไปหน้าสินค้า
          </button>
        </div>
      </div>
    );
  }

  const cartItem = getCartItem(product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const maxQuantity = product.stock - currentQuantityInCart;

  const handleAddToCart = async () => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
      return;
    }

    setAdding(true);
    addToCart(product, quantity);
    setAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* รูปภาพสินค้า */}
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* รายละเอียดสินค้า */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-lg text-gray-600">{product.category}</p>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </div>

          <div className="prose prose-sm text-gray-700">
            <p>{product.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                สินค้าคงเหลือ:
              </span>
              <span className={`text-sm font-medium ${
                product.stock > 10 ? 'text-green-600' : 
                product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {product.stock} ชิ้น
              </span>
            </div>
            
            {currentQuantityInCart > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  ในตะกร้าแล้ว:
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {currentQuantityInCart} ชิ้น
                </span>
              </div>
            )}
          </div>

          {user && maxQuantity > 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  จำนวน
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(Math.min(maxQuantity, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || maxQuantity === 0}
                className={`w-full flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  maxQuantity === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {adding ? 'กำลังเพิ่ม...' : 
                 maxQuantity === 0 ? 'สินค้าหมดแล้ว' :
                 'เพิ่มลงตะกร้า'}
              </button>
            </div>
          )}

          {!user && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้า
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              กลับไปหน้าสินค้า
            </button>
            {user && (
              <button
                onClick={() => navigate('/cart')}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                ดูตะกร้าสินค้า
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;