// ฟังก์ชันจัดรูปแบบราคา
export const formatPrice = (price) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(price);
};

// ฟังก์ชันจัดรูปแบบวันที่
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

// ฟังก์ชันสร้าง ID แบบสุ่ม
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// ฟังก์ชันตรวจสอบอีเมล
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ฟังก์ชันตรวจสอบรหัสผ่าน
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// ฟังก์ชันสร้างสถานะคำสั่งซื้อ
export const getOrderStatusText = (status) => {
  const statusMap = {
    pending: 'รอดำเนินการ',
    processing: 'กำลังเตรียมสินค้า',
    shipped: 'จัดส่งแล้ว',
    completed: 'สำเร็จ',
    cancelled: 'ยกเลิก'
  };
  
  return statusMap[status] || status;
};

// ฟังก์ชันสร้างสีสถานะ
export const getOrderStatusColor = (status) => {
  const colorMap = {
    pending: 'text-yellow-600 bg-yellow-100',
    processing: 'text-blue-600 bg-blue-100',
    shipped: 'text-purple-600 bg-purple-100',
    completed: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100'
  };
  
  return colorMap[status] || 'text-gray-600 bg-gray-100';
};

// ฟังก์ชันคำนวณส่วนลด
export const calculateDiscount = (price, discountPercent) => {
  return price * (discountPercent / 100);
};

// ฟังก์ชันตรวจสอบสต็อก
export const isInStock = (product, quantity = 1) => {
  return product.stock >= quantity;
};

// ฟังก์ชันย่อข้อความ
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};