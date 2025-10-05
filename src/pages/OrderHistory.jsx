import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { formatPrice, formatDate, getOrderStatusText, getOrderStatusColor } from '../utils/helpers';

const OrderHistory = () => {
  const { user } = useAuth();
  const { getCustomerOrders } = useOrders();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">กรุณาเข้าสู่ระบบ</h2>
          <p className="mt-2 text-gray-600">เพื่อดูรายการสั่งซื้อของคุณ</p>
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

  const orders = getCustomerOrders(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">รายการสั่งซื้อของฉัน</h1>
        <p className="mt-2 text-gray-600">ติดตามสถานะคำสั่งซื้อของคุณ</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">ยังไม่มีรายการสั่งซื้อ</h3>
          <p className="mt-1 text-sm text-gray-500">
            เริ่มเลือกซื้อสินค้าที่คุณชื่นชอบ
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
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* หัวเรื่องคำสั่งซื้อ */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      คำสั่งซื้อ #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      สั่งซื้อเมื่อ {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getOrderStatusColor(order.status)
                    }`}>
                      {getOrderStatusText(order.status)}
                    </span>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="px-6 py-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">รายการสินค้า</h4>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ข้อมูลการจัดส่ง */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">ข้อมูลการจัดส่ง</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                      <p>{order.shippingInfo.phone}</p>
                      <p>{order.shippingInfo.address}</p>
                      <p>{order.shippingInfo.city} {order.shippingInfo.postalCode}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">วิธีการชำระเงิน</h4>
                    <div className="text-sm text-gray-600">
                      <p>
                        {order.paymentMethod === 'bank_transfer' && 'โอนเงินผ่านธนาคาร'}
                        {order.paymentMethod === 'promptpay' && 'PromptPay'}
                        {order.paymentMethod === 'cash_on_delivery' && 'เก็บเงินปลายทาง'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {order.shippingInfo.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">หมายเหตุ</h4>
                    <p className="text-sm text-gray-600">{order.shippingInfo.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;