import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';

const EditProduct = () => {
  const { user, isAdmin } = useAuth();
  const { products, updateProduct } = useProducts();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ค้นหาสินค้าที่จะแก้ไข
  useEffect(() => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        image: product.image
      });
    }
  }, [id, products]);

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

  const currentProduct = products.find(p => p.id === id);
  if (!currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">ไม่พบสินค้า</h2>
          <p className="mt-2 text-gray-600">ไม่พบสินค้าที่ต้องการแก้ไข</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ลบ error เมื่อผู้ใช้เริ่มพิมพ์
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณาใส่ชื่อสินค้า';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'กรุณาใส่คำอธิบายสินค้า';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'กรุณาใส่ราคาที่ถูกต้อง';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'กรุณาใส่จำนวนสต็อกที่ถูกต้อง';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'กรุณาใส่ URL รูปภาพ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedProduct = {
        id: id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        stock: parseInt(formData.stock),
        image: formData.image.trim()
      };

      const result = updateProduct(updatedProduct);
      
      if (result.success) {
        alert('แก้ไขสินค้าสำเร็จ!');
        navigate('/admin/products');
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการแก้ไขสินค้า');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขสินค้า');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['เสื้อผ้า', 'อุปกรณ์สำนักงาน', 'ของใช้ทั่วไป', 'อุปกรณ์เทคโนโลยี'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไปหน้าจัดการสินค้า
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">แก้ไขสินค้า</h1>
        <p className="mt-2 text-gray-600">แก้ไขข้อมูลสินค้า: {currentProduct.name}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ชื่อสินค้า */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              ชื่อสินค้า <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="ใส่ชื่อสินค้า"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* คำอธิบายสินค้า */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              คำอธิบายสินค้า <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="ใส่คำอธิบายสินค้า"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* ราคาและหมวดหมู่ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                ราคา (บาท) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                หมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>

          {/* จำนวนสต็อก */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              จำนวนสต็อก <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>

          {/* URL รูปภาพ */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              URL รูปภาพ <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            
            {/* แสดงตัวอย่างรูปภาพ */}
            {formData.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">ตัวอย่างรูปภาพ:</p>
                <img
                  src={formData.image}
                  alt="ตัวอย่าง"
                  className="h-32 w-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* ปุ่มจัดการ */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;