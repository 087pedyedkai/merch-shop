import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* ไอคอนสำเร็จ */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            สั่งซื้อสำเร็จ!
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            ขอบคุณสำหรับการสั่งซื้อ เราจะติดต่อกลับไปเร็วๆ นี้
          </p>
          
          {orderId && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm font-medium text-green-800">
                หมายเลขคำสั่งซื้อ: {orderId}
              </p>
              <p className="text-xs text-green-600 mt-1">
                กรุณาเก็บหมายเลขนี้ไว้สำหรับติดตามสถานะ
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ขั้นตอนต่อไป
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">ยืนยันคำสั่งซื้อ</p>
                  <p className="text-xs text-gray-500">เราจะติดต่อเพื่อยืนยันรายละเอียด</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">เตรียมสินค้า</p>
                  <p className="text-xs text-gray-500">ใช้เวลา 1-2 วันทำการ</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">จัดส่งสินค้า</p>
                  <p className="text-xs text-gray-500">จัดส่งภายในมหาวิทยาลัย</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/orders"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ดูรายการสั่งซื้อ
            </Link>
            
            <Link
              to="/products"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              เลือกซื้อสินค้าเพิ่ม
            </Link>
            
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            หากมีคำถามเพิ่มเติม สามารถติดต่อเราได้ที่
          </p>
          <p className="text-xs text-blue-600 font-medium">
            📞 02-XXX-XXXX | 📧 support@merch.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;