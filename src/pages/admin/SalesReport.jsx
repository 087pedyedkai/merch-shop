import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';
import { formatPrice } from '../../utils/helpers';

const SalesReport = () => {
  const { user, isAdmin } = useAuth();
  const { orders } = useOrders();
  const { products } = useProducts();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');

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

  // กรองคำสั่งซื้อตามช่วงเวลา
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      switch (selectedPeriod) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return orderDate >= yearAgo;
        default:
          return true;
      }
    });
  }, [orders, selectedPeriod]);

  // คำนวณสถิติยอดขาย
  const salesStats = useMemo(() => {
    const completedOrders = filteredOrders.filter(order => order.status === 'completed');
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = completedOrders.length;
    const totalItems = completedOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      totalItems,
      averageOrderValue
    };
  }, [filteredOrders]);

  // สินค้าที่ขายดีที่สุด
  const topProducts = useMemo(() => {
    const productSales = {};
    
    filteredOrders
      .filter(order => order.status === 'completed')
      .forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = {
              id: item.id,
              name: item.name,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.id].quantity += item.quantity;
          productSales[item.id].revenue += item.price * item.quantity;
        });
      });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [filteredOrders]);

  // สถิติตามหมวดหมู่
  const categoryStats = useMemo(() => {
    const categoryData = {};
    
    filteredOrders
      .filter(order => order.status === 'completed')
      .forEach(order => {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.id);
          const category = product ? product.category : 'ไม่ระบุ';
          
          if (!categoryData[category]) {
            categoryData[category] = {
              category,
              quantity: 0,
              revenue: 0
            };
          }
          categoryData[category].quantity += item.quantity;
          categoryData[category].revenue += item.price * item.quantity;
        });
      });

    return Object.values(categoryData)
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  // ยอดขายรายวัน (7 วันล่าสุด)
  const dailySales = useMemo(() => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString() && order.status === 'completed';
      });
      
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      days.push({
        date: date.toLocaleDateString('th-TH', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue,
        orders: dayOrders.length
      });
    }
    
    return days;
  }, [orders]);

  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">รายงานการขาย</h1>
            <p className="mt-2 text-gray-600">สถิติและการวิเคราะห์ยอดขาย</p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับแดชบอร์ด
          </Link>
        </div>

        {/* ตัวกรองข้อมูล */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">ช่วงเวลา</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              <option value="today">วันนี้</option>
              <option value="week">7 วันล่าสุด</option>
              <option value="month">30 วันล่าสุด</option>
              <option value="year">ปีนี้</option>
            </select>
          </div>
        </div>
      </div>

      {/* สถิติรวม */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">ยอดขายรวม</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatPrice(salesStats.totalRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">จำนวนคำสั่งซื้อ</dt>
                  <dd className="text-lg font-medium text-gray-900">{salesStats.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">จำนวนสินค้าที่ขาย</dt>
                  <dd className="text-lg font-medium text-gray-900">{salesStats.totalItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">ยอดขายเฉลี่ย/คำสั่งซื้อ</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatPrice(salesStats.averageOrderValue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* ยอดขายรายวัน */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">ยอดขาย 7 วันล่าสุด</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dailySales.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatPrice(day.revenue)}</div>
                    <div className="text-xs text-gray-500">{day.orders} คำสั่งซื้อ</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* สถิติตามหมวดหมู่ */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">ยอดขายตามหมวดหมู่</h3>
          </div>
          <div className="p-6">
            {categoryStats.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(category.revenue)}</div>
                      <div className="text-xs text-gray-500">{category.quantity} ชิ้น</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">ไม่มีข้อมูลการขาย</p>
            )}
          </div>
        </div>
      </div>

      {/* สินค้าขายดี */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">สินค้าขายดี Top 10</h3>
        </div>
        <div className="overflow-x-auto">
          {topProducts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อันดับ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อสินค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวนที่ขาย
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ยอดขาย
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        index < 3 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.quantity} ชิ้น
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              ไม่มีข้อมูลการขาย
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;