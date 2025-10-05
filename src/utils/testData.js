// ฟังก์ชันสำหรับสร้างข้อมูลทดสอบ
export const initializeTestData = () => {
  // ข้อมูลผู้ใช้ทดสอบ
  const testUsers = [
    {
      id: 'admin1',
      name: 'ผู้ดูแลระบบ',
      email: 'admin@merch.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'customer1',
      name: 'นายทดสอบ ระบบ',
      email: 'customer@merch.com',
      password: 'customer123',
      role: 'customer',
      createdAt: new Date().toISOString()
    }
  ];

  // ตรวจสอบว่ามีข้อมูลผู้ใช้อยู่แล้วหรือไม่
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify(testUsers));
    console.log('เพิ่มข้อมูลผู้ใช้ทดสอบแล้ว');
  }

  // ข้อมูลสินค้าทดสอบ (ถ้ายังไม่มี)
  const existingProducts = localStorage.getItem('products');
  if (!existingProducts) {
    const testProducts = [
      {
        id: '1',
        name: 'เสื้อยืดสาขาวิทยาการคอมพิวเตอร์',
        description: 'เสื้อยืดคุณภาพดี ใส่สบาย วัสดุผ้าคอตตอน 100% มีโลโก้วิทยาการคอมพิวเตอร์ที่อกซ้าย สีสันสดใส',
        price: 350,
        image: '/images/tshirt.png',
        category: 'เสื้อผ้า',
        stock: 50,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'กระเป๋าสะพายโลโก้วิทยาการคอมพิวเตอร์',
        description: 'กระเป๋าสะพายข้างสีขาว มีโลโก้วิทยาการคอมพิวเตอร์ ใส่ของได้เยอะ วัสดุทนทาน เหมาะสำหรับนักศึกษา',
        price: 450,
        image: '/images/shoulder_bag.png',
        category: 'กระเป๋า',
        stock: 30,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'แก้วน้ำวิทยาการคอมพิวเตอร์',
        description: 'แก้วน้ำ รักษาอุณหภูมิได้ดี มีโลโก้วิทยาการคอมพิวเตอร์ ความจุ 500ml เหมาะสำหรับพกพา',
        price: 250,
        image: '/images/mug.png',
        category: 'ของใช้',
        stock: 25,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'หมวกแก๊ปวิทยาการคอมพิวเตอร์',
        description: 'หมวกแก๊ปสีน้ำเงิน ปักโลโก้วิทยาการคอมพิวเตอร์ ปรับขนาดได้ วัสดุคุณภาพ ใส่สบาย',
        price: 200,
        image: '/images/hat.png',
        category: 'เสื้อผ้า',
        stock: 2,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'สมุดโน้ต',
        description: 'สมุดโน้ตปกแข็ง มีโลโก้วิทยาการคอมพิวเตอร์ กระดาษคุณภาพดี เหมาะสำหรับจดบันทึก',
        price: 150,
        image: '/images/notebook.png',
        category: 'เครื่องเขียน',
        stock: 60,
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'ปากกาโลโก้วิทยาลัย',
        description: 'ปากกาลูกลื่นสีน้ำเงิน มีโลโก้วิทยาลัย เขียนลื่น หมึกคุณภาพดี',
        price: 50,
        image: '/images/pen.png',
        category: 'เครื่องเขียน',
        stock: 100,
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('products', JSON.stringify(testProducts));
    console.log('เพิ่มข้อมูลสินค้าทดสอบแล้ว');
  }
};

// ฟังก์ชันล้างข้อมูลทั้งหมด (สำหรับการทดสอบ)
export const clearAllData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('products');
  localStorage.removeItem('orders');
  localStorage.removeItem('currentUser');
  // ล้าง cart ทั้งหมด
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('cart_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('ล้างข้อมูลทั้งหมดแล้ว');
};