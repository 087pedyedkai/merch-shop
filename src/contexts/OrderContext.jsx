import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // โหลดข้อมูลคำสั่งซื้อจาก localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return { success: true, orderId: newOrder.id, message: 'สั่งซื้อสำเร็จ' };
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    );

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return { success: true, message: 'อัปเดตสถานะคำสั่งซื้อสำเร็จ' };
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getCustomerOrders = (customerId) => {
    return orders
      .filter(order => order.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAllOrders = () => {
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.total, 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue
    };
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getCustomerOrders,
    getAllOrders,
    getOrdersByStatus,
    getOrderStats
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};