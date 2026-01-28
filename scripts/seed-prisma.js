const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// --- DATA ---
const menuData = [
  // --- Exciting Deals ---
  { name: 'Offer of the Day (2 in 1 Deal)', price: 1350, category: 'Exciting Deals', description: 'Limited time offer: 2 delicious items for one great price.' },
  { name: 'Economy Deal', price: 1700, category: 'Exciting Deals', description: 'Perfect for sharing: 1 Medium Pizza + 2 Drinks.' },
  { name: 'Deal for 2 (2 Med Pizza + 2 Drinks)', price: 2100, category: 'Exciting Deals', description: 'Double the fun with 2 Medium Pizzas and drinks.' },
  { name: 'Deal for 2 (1 Lrg Pizza + 2 Zingers + 2 Drinks)', price: 2385, category: 'Exciting Deals', description: 'A feast for two: Large Pizza, crispy Zingers, and drinks.' },
  { name: 'Deal for 4 (1 Lrg + 1 Med Pizza + 4 Clubs + 4 Drinks)', price: 4350, category: 'Exciting Deals', description: 'Big appetite? Includes Large & Medium Pizzas plus Club Sandwiches.' },
  { name: 'Deal for 4 (2 Lrg Pizza + 4 Wraps + 4 Drinks)', price: 4660, category: 'Exciting Deals', description: 'Pizza & Wraps party pack for four.' },
  { name: 'Family Deal', price: 3720, category: 'Exciting Deals', description: '1 Lrg & 1 Med Pizza, 1 Zinger, 1 Patty Burger, Lrg Fries, 4 Drinks' },
  { name: 'Friends Deal', price: 4800, category: 'Exciting Deals', description: '2 Lrg Pizza, 2 Zingers, 2 Clubs, 4 Drinks' },

  // --- Pizza, Sandwiches, & More ---
  { name: 'BBQ Chicken Wrap', price: 380, category: 'Pizza, Sandwiches, & More', description: 'Grilled chicken tossed in smoky BBQ sauce, wrapped with fresh veggies.' },
  { name: 'Buffalo Chicken Wrap', price: 380, category: 'Pizza, Sandwiches, & More', description: 'Spicy buffalo chicken breast with cool ranch dressing in a soft tortilla.' },
  { name: 'Crispy Chicken Wrap', price: 380, category: 'Pizza, Sandwiches, & More', description: 'Golden fried chicken strips with lettuce and mayo.' },
  { name: 'Fajita Chicken Sandwich', price: 450, category: 'Pizza, Sandwiches, & More', description: 'Spiced fajita chicken, onions, and peppers in toasted bread.' },
  { name: 'Fries (Regular/Large/Loaded)', price: 175, category: 'Pizza, Sandwiches, & More', description: 'Crispy golden fries. Choose Plain, Masala, or Mayo.' },
  { name: 'Chicken Wings (Buffalo/BBQ)', price: 450, category: 'Pizza, Sandwiches, & More', description: 'Juicy wings coated in your choice of spicy Buffalo or sweet BBQ sauce.' },
  { name: 'Nuggets', price: 390, category: 'Pizza, Sandwiches, & More', description: 'Bite-sized crispy chicken chunks, perfect for snacking.' },
  { name: 'Chicken Tikka Pizza', price: 550, category: 'Pizza, Sandwiches, & More', description: 'Classic desi flavor with spicy tikka chunks and onions.' },
  { name: 'Chicken Fajita Pizza', price: 550, category: 'Pizza, Sandwiches, & More', description: 'Fajita seasoned chicken, capsicum, and onions.' },
  { name: 'Chicken Malai Boti Pizza', price: 550, category: 'Pizza, Sandwiches, & More', description: 'Creamy malai boti chicken bits with a mild, rich flavor.' },
  { name: 'Chicken Supreme Pizza', price: 550, category: 'Pizza, Sandwiches, & More', description: 'Loaded with chicken sausages, fajita, tikka, and veggies.' },
  { name: 'Kabab Crust Pizza', price: 700, category: 'Pizza, Sandwiches, & More', description: 'Stuffed crust with seekh kabab bites for extra meatiness.' },
  { name: 'Chicken Meat Balls Pizza', price: 700, category: 'Pizza, Sandwiches, & More', description: 'Savory meatballs topped with melted mozzarella.' },
  { name: 'Mediterranean Pizza', price: 550, category: 'Pizza, Sandwiches, & More', description: 'Fresh veggies, olives, and feta cheese (Video exclusive).' },
  { name: 'Zinger Burger', price: 430, category: 'Pizza, Sandwiches, & More', description: 'Crunchy fried chicken fillet with fresh lettuce and mayo.' },
  { name: 'Cheesy Zinger Burger', price: 530, category: 'Pizza, Sandwiches, & More', description: 'Our signature Zinger topped with a slice of melted cheddar.' },
  { name: 'Chicken Patty Burger', price: 450, category: 'Pizza, Sandwiches, & More', description: 'Succulent chicken patty grilled to perfection.' },

  // --- Signature Cold Coffee ---
  { name: 'Lotus Frappe', price: 720, category: 'Signature Cold Coffee', description: 'Rich creamy blend with Lotus Biscoff spread and biscuit crumbs.' },
  { name: 'Mocha Frappe', price: 720, category: 'Signature Cold Coffee', description: 'Iced coffee blended with rich chocolate syrup and milk.' },
  { name: 'Oreo Frappe', price: 720, category: 'Signature Cold Coffee', description: 'Cookies and cream delight with a coffee kick.' },
  { name: 'V60 Iced', price: 550, category: 'Signature Cold Coffee', description: 'Pour-over method over ice for a clean, crisp coffee taste.' },
  { name: 'Blue Velvet Frappe', price: 720, category: 'Signature Cold Coffee', description: 'Unique velvet vanilla blend with a stunning blue hue.' },
  { name: 'Caramel Frappe', price: 720, category: 'Signature Cold Coffee', description: 'Sweet caramel blended with espresso and milk, topped with whipped cream.' },

  // --- Signature Hot Coffee ---
  { name: 'Mochaccino', price: 650, category: 'Signature Hot Coffee', description: 'A warm hug of espresso, steamed milk, and chocolate.' },
  { name: 'Caramel Latte', price: 650, category: 'Signature Hot Coffee', description: 'Espresso with steamed milk and sweet caramel syrup.' },
  { name: 'V60', price: 550, category: 'Signature Hot Coffee', description: 'Manual pour-over brewing for a pure, aromatic cup.' },
  { name: 'Coffee Toffee', price: 620, category: 'Signature Hot Coffee', description: 'Rich coffee with distinct toffee nut notes.' },
  { name: 'Spanish Latte', price: 620, category: 'Signature Hot Coffee', description: 'Espresso with textured milk and sweetened condensed milk.' },

  // --- Ice Cream Shakes ---
  { name: 'Chocolate Ice Cream Shake', price: 470, category: 'Ice Cream Shakes & Mojito', description: 'Thick and creamy shake made with premium chocolate ice cream.' },
  { name: 'Oreo Ice Cream Shake', price: 720, category: 'Ice Cream Shakes & Mojito', description: 'Blended with real Oreos for a cookie crunch.' },
  { name: 'Vanilla Ice Cream Shake', price: 470, category: 'Ice Cream Shakes & Mojito', description: 'Classic vanilla bean flavor, smooth and rich.' },
  { name: 'Blue Velvet Ice Cream Shake', price: 720, category: 'Ice Cream Shakes & Mojito', description: 'Creamy blue velvet indulgence.' },
  { name: 'Lotus Ice Cream Shake', price: 720, category: 'Ice Cream Shakes & Mojito', description: 'Lotus Biscoff infused shake for cookie butter lovers.' },
  { name: 'Strawberry Mojito', price: 520, category: 'Ice Cream Shakes & Mojito', description: 'Refreshing sparkling drink with lime, mint, and strawberry.' },

  // --- Hot Coffee ---
  { name: 'Americano', price: 450, category: 'Hot Coffee', description: 'Espresso shots topped with hot water.' },
  { name: 'Cappuccino', price: 520, category: 'Hot Coffee', description: 'Equal parts espresso, steamed milk, and foam.' },
  { name: 'Mocha', price: 620, category: 'Hot Coffee', description: 'Espresso mixed with hot chocolate and steamed milk.' },
  { name: 'Hot Chocolate', price: 620, category: 'Hot Coffee', description: 'Rich cocoa beverage, no coffee included.' },

  // --- Cold Coffee ---
  { name: 'Iced Cappuccino', price: 590, category: 'Cold Coffee', description: 'Chilled cappuccino poured over ice.' },
  { name: 'Iced Americano', price: 450, category: 'Cold Coffee', description: 'Espresso and cold water over ice.' },

  // --- Teas & Desserts ---
  { name: 'Iced Tea Peach', price: 520, category: 'Teas & Desserts', description: 'Chilled tea infused with sweet peach flavor.' },
  { name: 'English Breakfast Tea', price: 270, category: 'Teas & Desserts', description: 'Strong, traditional black tea blend.' },
  { name: 'Green Tea (Moroccan Mint & Lemon)', price: 270, category: 'Teas & Desserts', description: 'Soothing green tea with refreshing mint or zesty lemon.' },
  { name: 'Tea with Milk', price: 350, category: 'Teas & Desserts', description: 'Classic brewed tea served with fresh milk.' },
  { name: 'Cream Puff', price: 75, category: 'Teas & Desserts', description: 'Light pastry shell filled with sweet whipped cream.' },
  { name: 'Pastry (Chocolate/Caramel)', price: 250, category: 'Teas & Desserts', description: 'Soft sponge cake layered with your choice of topping.' },
  { name: 'Chocolate Brownie', price: 250, category: 'Teas & Desserts', description: 'Rich, fudgy chocolate brownie square.' },
  { name: 'Chocolate Croissant', price: 380, category: 'Teas & Desserts', description: 'Buttery flaky croissant filled with chocolate.' },
  { name: 'Croissant', price: 110, category: 'Teas & Desserts', description: 'Plain buttery croissant, freshly baked.' },
  { name: 'Mineral Water Small', price: 70, category: 'Teas & Desserts', description: ' chilled bottle.' },
  { name: 'Soft Drink', price: 70, category: 'Teas & Desserts', description: 'Coke, Sprite, or Fanta.' },

  // --- Raw Beans ---
  { name: 'Raaz Guatemala Beans (250g)', price: 2750, category: 'Raw Coffee (Beans)', description: 'Single origin beans with fruity notes.' },
  { name: 'Raaz Espresso Beans (1kg)', price: 11500, category: 'Raw Coffee (Beans)', description: 'Strong dark roast perfect for espresso shots.' },
  { name: 'Raaz Kenya Rarity (250g)', price: 4500, category: 'Raw Coffee (Beans)', description: 'Exotic beans with bright acidity and berry tones.' },
  { name: 'Raaz Signature Blend (250g)', price: 2500, category: 'Raw Coffee (Beans)', description: 'Our house blend, balanced and smooth.' },
  { name: 'Raaz Colombia Huila (250g)', price: 3750, category: 'Raw Coffee (Beans)', description: 'Medium body with caramel sweetness.' },
  { name: 'Raaz Premium Blend (1kg)', price: 12000, category: 'Raw Coffee (Beans)', description: 'Top-tier selection for the coffee connoisseur.' },
];

const mockOrders = [
  { customer: 'Ahmed Khan', phone: '923001234567', items: ['Zinger Burger', 'Fries', 'Soft Drink'], total: 950, status: 'Preparing' },
  { customer: 'Ahmed Khan', phone: '923001234567', items: ['Zinger Burger', 'Soft Drink'], total: 800, status: 'Delivered' },
  // ... (Truncated other orders for brevity, but logic loops same)
  { customer: 'Omar Farooq', phone: '923009876543', items: ['Chicken Tikka Pizza', 'Soft Drink'], total: 620, status: 'Delivered' },
];

const mockInventory = [
  { item: 'Arabica Coffee Beans', quantity: 15, unit: 'kg', supplier: 'Raaz Beans', status: 'Good' },
  { item: 'Fresh Milk', quantity: 45, unit: 'L', supplier: 'Punjab Dairy', status: 'Good' },
  { item: 'Chocolate Syrup', quantity: 8, unit: 'L', supplier: 'Sweet Supplies', status: 'Low Risk' },
  { item: 'Burger Buns', quantity: 24, unit: 'pcs', supplier: 'Dawn Bread', status: 'Critical' },
  { item: 'Chicken Fillets', quantity: 12, unit: 'kg', supplier: 'K&Ns', status: 'Good' },
  { item: 'Sugar', quantity: 50, unit: 'kg', supplier: 'Local Mart', status: 'Good' },
  { item: 'Oreo Biscuits', quantity: 100, unit: 'pcs', supplier: 'Dawn Distribution', status: 'Good' },
  { item: 'Lotus Biscoff', quantity: 12, unit: 'jars', supplier: 'Imported Goods', status: 'Low Risk' }
];

const mockSuppliers = [
  { name: 'Raaz Beans', rating: 4.9, type: 'Coffee', status: 'Active' },
  { name: 'Punjab Dairy', rating: 4.7, type: 'Dairy', status: 'Active' },
  { name: 'Dawn Bread', rating: 4.5, type: 'Bakery', status: 'Delayed' },
  { name: 'K&Ns', rating: 4.8, type: 'Meat', status: 'Active' },
  { name: 'Sweet Supplies', rating: 4.2, type: 'Syrups', status: 'Active' }
];

async function seed() {
  console.log("Starting seeding process...");

  // 1. Create or Find User
  const email = 'sohaib@chromadiv.com';
  const hashedPassword = await bcrypt.hash('Welcome124@#', 10);

  console.log(`Ensuring user ${email} exists...`);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Sohaib Latif',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  const userId = user.id;
  console.log(`User ID: ${userId}`);

  // 2. Clear existing entries for this user if needed (Optional, to avoid dups if run twice)
  // For safety, let's just create if not exists or skip. 
  // Actually, deleteMany is safer to ensure clean state for this user.
  console.log('Cleaning old data for this user...');
  await prisma.menu.deleteMany({ where: { userId } });
  await prisma.order.deleteMany({ where: { userId } });
  await prisma.inventory.deleteMany({ where: { userId } });
  await prisma.supplier.deleteMany({ where: { userId } });

  // 3. Seed Menu
  console.log(`Seeding ${menuData.length} menu items...`);
  await prisma.menu.createMany({
    data: menuData.map(item => ({ ...item, userId }))
  });

  // 4. Seed Orders
  console.log(`Seeding mock orders...`);
  await prisma.order.createMany({
    data: mockOrders.map(order => ({ ...order, userId }))
  });

  // 5. Seed Inventory
  console.log(`Seeding inventory...`);
  await prisma.inventory.createMany({
    data: mockInventory.map(item => ({ ...item, userId }))
  });

  // 6. Seed Suppliers
  console.log(`Seeding suppliers...`);
  await prisma.supplier.createMany({
    data: mockSuppliers.map(item => ({ ...item, userId }))
  });

  console.log("Seeding complete! 🚀");
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
