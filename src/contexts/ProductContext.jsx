import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// ข้อมูลสินค้าตัวอย่าง
const initialProducts = [
  {
    id: '1',
    name: 'เสื้อยืดวิทยาลัยพาณิชย์',
    description: 'เสื้อยืดคุณภาพดี ใส่สบาย วัสดุผ้าคอตตอน 100%',
    price: 350,
    image: 'https://via.placeholder.com/300x300?text=T-Shirt',
    category: 'เสื้อผ้า',
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'กระเป๋าสะพายโลโก้วิทยาลัย',
    description: 'กระเป๋าสะพายข้างสีดำ มีโลโก้วิทยาลัย ใส่ของได้เยอะ',
    price: 450,
    image: 'https://via.placeholder.com/300x300?text=Bag',
    category: 'กระเป๋า',
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'แก้วน้ำวิทยาลัย',
    description: 'แก้วน้ำสแตนเลส รักษาอุณหภูมิได้ดี มีโลโก้วิทยาลัย',
    price: 250,
    image: 'https://via.placeholder.com/300x300?text=Tumbler',
    category: 'ของใช้',
    stock: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'หมวกแก๊ปวิทยาลัย',
    description: 'หมวกแก๊ปสีน้ำเงิน ปักโลโก้วิทยาลัย ปรับขนาดได้',
    price: 200,
    image: 'https://via.placeholder.com/300x300?text=Cap',
    category: 'เสื้อผ้า',
    stock: 40,
    createdAt: new Date().toISOString()
  }
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // โหลดข้อมูลสินค้าจาก localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // ถ้าไม่มีข้อมูล ให้ใช้ข้อมูลตัวอย่าง
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
    setLoading(false);
  }, []);

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    return { success: true, message: 'เพิ่มสินค้าสำเร็จ' };
  };

  const updateProduct = (productData) => {
    const updatedProducts = products.map(product =>
      product.id === productData.id 
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    );

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    return { success: true, message: 'อัปเดตสินค้าสำเร็จ' };
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    return { success: true, message: 'ลบสินค้าสำเร็จ' };
  };

  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const searchProducts = (query) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const updateStock = (id, quantity) => {
    const updatedProducts = products.map(product =>
      product.id === id 
        ? { ...product, stock: Math.max(0, product.stock - quantity) }
        : product
    );

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    searchProducts,
    updateStock
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};