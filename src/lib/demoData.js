export const demoData = {
  orders: [
    {
      id: 'ORD-101',
      customer: 'Ahmed Khan',
      status: 'Ready',
      items: ['Spicy Chicken Burger', 'Cheese Fries', 'Cola'],
      total: 1250,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      phone: '923001234567'
    },
    {
      id: 'ORD-102',
      customer: 'Fatima Ali',
      status: 'Preparing',
      items: ['Pizza Fajita (L)', 'Garlic Bread'],
      total: 2100,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      phone: '923339876543'
    },
    {
      id: 'ORD-103',
      customer: 'Sarah Ahmed',
      status: 'Delivered',
      items: ['Zinger Burger', 'Mineral Water'],
      total: 650,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      phone: '923214567890'
    },
    {
      id: 'ORD-104',
      customer: 'Bilal Hyatt',
      status: 'Pending',
      items: ['Club Sandwich', 'Tea'],
      total: 450,
      created_at: new Date().toISOString(), // Just now
      phone: '923456789012'
    },
    {
      id: 'ORD-105',
      customer: 'Usman Tariq',
      status: 'Delivered',
      items: ['Pasta Alfredo'],
      total: 950,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
      phone: '923112233445'
    },
    {
      id: 'ORD-106',
      customer: 'Ahmed Khan',
      status: 'Delivered',
      items: ['Espresso', 'Chocolate Cake'],
      total: 600,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      phone: '923001234567'
    },
    {
      id: 'ORD-107',
      customer: 'Fatima Ali',
      status: 'Delivered',
      items: ['Zinger Burger'],
      total: 650,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      phone: '923339876543'
    },
    {
      id: 'ORD-108',
      customer: 'Fatima Ali',
      status: 'Delivered',
      items: ['Club Sandwich', 'Tea'],
      total: 450,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      phone: '923339876543'
    }
  ],
  inventory: [
    { id: 1, item: 'Burger Buns', quantity: 150, unit: 'pcs', supplier: 'Dawn Bread', status: 'Good', min_threshold: 50 },
    { id: 2, item: 'Chicken Fillet', quantity: 12, unit: 'kg', supplier: 'K&Ns', status: 'Critical', min_threshold: 20 },
    { id: 3, item: 'Mozzarella Cheese', quantity: 18, unit: 'kg', supplier: 'Punjab Dairy', status: 'Low Risk', min_threshold: 20 },
    { id: 4, item: 'Cola Syrups', quantity: 50, unit: 'liters', supplier: 'Sweet Supplies', status: 'Good', min_threshold: 10 },
    { id: 5, item: 'Premium Coffee Beans', quantity: 4, unit: 'kg', supplier: 'Raaz Beans', status: 'Critical', min_threshold: 5 },
  ],
  suppliers: [
    { id: 1, name: 'Raaz Beans', rating: 4.8, category: 'Coffee', active: true },
    { id: 2, name: 'Punjab Dairy', rating: 4.5, category: 'Dairy', active: true },
    { id: 3, name: 'Dawn Bread', rating: 4.9, category: 'Bakery', active: true },
    { id: 4, name: 'K&Ns', rating: 4.7, category: 'Meat', active: true },
  ],
  menu: [
    {
      id: 'cat_coffee',
      name: 'Coffee',
      items: [
        { id: 1, name: 'Espresso', price: 250, description: 'Strong and bold.', available: true },
        { id: 2, name: 'Cappuccino', price: 450, description: 'Creamy and frothy.', available: true },
        { id: 3, name: 'Latte', price: 500, description: 'Smooth milk coffee.', available: true }
      ]
    },
    {
      id: 'cat_burgers',
      name: 'Burgers',
      items: [
        { id: 4, name: 'Zinger Burger', price: 650, description: 'Crispy chicken fillet.', available: true },
        { id: 5, name: 'Beef Burger', price: 800, description: 'Juicy beef patty.', available: true }
      ]
    },
    {
      id: 'cat_desserts',
      name: 'Desserts',
      items: [
        { id: 6, name: 'Chocolate Cake', price: 350, description: 'Rich chocolate slice.', available: true },
        { id: 7, name: 'Cheesecake', price: 450, description: 'Classic NY style.', available: true }
      ]
    }
  ]
};
