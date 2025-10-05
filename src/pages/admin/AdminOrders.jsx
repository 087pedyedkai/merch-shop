import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { formatPrice, formatDate, getOrderStatusText, getOrderStatusColor } from '../../utils/helpers';

const AdminOrders = () => {
  const { user, isAdmin } = useAuth();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState('');

  // ตรวจสอบสิทธิ์แอดมิน
  if (!user || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="mt-2 text-gray-600">หน้านี้สำหรับแอดมินเท่านั้น</p>
        </div>
      </div>
    );
  }

  const allOrders = getAllOrders();
  
  const filteredOrders = selectedStatus 
    ? allOrders.filter(order => order.status === selectedStatus)
    : allOrders;

  const handleStatusChange = (orderId, newStatus) => {
    const result = updateOrderStatus(orderId, newStatus);
    if (result.success) {
      alert('อัปเดตสถานะสำเร็จ');
    } else {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'รอดำเนินการ' },
    { value: 'processing', label: 'กำลังเตรียมสินค้า' },
    { value: 'shipped', label: 'จัดส่งแล้ว' },
    { value: 'completed', label: 'สำเร็จ' },
    { value: 'cancelled', label: 'ยกเลิก' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">จัดการคำสั่งซื้อ</h1>
            <p className="mt-2 text-gray-600">ดูและจัดการคำสั่งซื้อของลูกค้า</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">สถานะทั้งหมด</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-gray-600">
          พบคำสั่งซื้อ {filteredOrders.length} รายการ
        </div>
      </div>

      {/* สถิติคำสั่งซื้อ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statusOptions.map(status => {
          const count = allOrders.filter(order => order.status === status.value).length;
          return (
            <div key={status.value} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      getOrderStatusColor(status.value).replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')
                    }`}>
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{status.label}</dt>
                      <dd className="text-lg font-medium text-gray-900">{count} รายการ</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบคำสั่งซื้อ</h3>
          <p className="mt-1 text-sm text-gray-500">
            ยังไม่มีคำสั่งซื้อในสถานะที่เลือก
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* หัวเรื่องคำสั่งซื้อ */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      คำสั่งซื้อ #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ลูกค้า: {order.customerName} | สั่งซื้อเมื่อ {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 border border-gray-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          getOrderStatusColor(order.status)
                        }`}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="px-6 py-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">รายการสินค้า</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ข้อมูลการจัดส่ง */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">ข้อมูลการจัดส่ง</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                      <p>📞 {order.shippingInfo.phone}</p>
                      <p>📍 {order.shippingInfo.address}</p>
                      <p>{order.shippingInfo.city} {order.shippingInfo.postalCode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">ข้อมูลลูกค้า</h4>
                    <div className="text-sm text-gray-600">
                      <p>📧 {order.customerEmail}</p>
                      <p>🆔 {order.customerId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">วิธีการชำระเงิน</h4>
                    <div className="text-sm text-gray-600">
                      <p>
                        {order.paymentMethod === 'bank_transfer' && '🏦 โอนเงินผ่านธนาคาร'}
                        {order.paymentMethod === 'promptpay' && '📱 PromptPay'}
                        {order.paymentMethod === 'cash_on_delivery' && '💵 เก็บเงินปลายทาง'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {order.shippingInfo.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">หมายเหตุ</h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                      💬 {order.shippingInfo.notes}
                    </p>
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

export default AdminOrders;