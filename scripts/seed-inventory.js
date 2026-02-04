const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'm2m@gmail.com';
  console.log(`Checking for user: ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User ${email} not found! Please create the user first.`);
    process.exit(1);
  }

  console.log(`Found user: ${user.name} (ID: ${user.id})`);

  // --- 1. Seed Suppliers (8 Active Partners) ---
  console.log('Seeding 8 Suppliers...');
  const suppliers = [
    { name: 'Fresh Dairy Co.', type: 'Dairy', status: 'Active', rating: 4.8 },
    { name: 'Bean Masters', type: 'Coffee Beans', status: 'Active', rating: 4.9 },
    { name: 'Global Foods', type: 'Frozen Goods', status: 'Active', rating: 4.5 },
    { name: 'Organic Farms', type: 'Vegetables', status: 'Active', rating: 4.7 },
    { name: 'Premium Meats', type: 'Meat', status: 'Active', rating: 4.6 },
    { name: 'Bakery Supplies Ltd', type: 'Baking', status: 'Active', rating: 4.4 },
    { name: 'Beverage World', type: 'Drinks', status: 'Active', rating: 4.3 },
    { name: 'Packaging Pros', type: 'Packaging', status: 'Active', rating: 4.8 },
  ];

  for (const s of suppliers) {
    await prisma.supplier.create({
      data: {
        userId: user.id,
        name: s.name,
        type: s.type,
        status: s.status,
        rating: s.rating,
      },
    });
  }
  console.log('Suppliers seeded!');

  // --- 2. Seed Inventory (20 Items) ---
  console.log('Seeding 20 Inventory Items...');
  const inventoryItems = [
    { item: 'Coffee Beans (Arabica)', quantity: 15, unit: 'kg', supplier: 'Bean Masters', status: 'Good' },
    { item: 'Whole Milk', quantity: 50, unit: 'liters', supplier: 'Fresh Dairy Co.', status: 'Good' },
    { item: 'Mozzarella Cheese', quantity: 12, unit: 'kg', supplier: 'Fresh Dairy Co.', status: 'Good' },
    { item: 'Chicken Breast', quantity: 20, unit: 'kg', supplier: 'Premium Meats', status: 'Good' },
    { item: 'Burger Buns', quantity: 100, unit: 'pcs', supplier: 'Bakery Supplies Ltd', status: 'Good' },
    { item: 'Tomato Sauce', quantity: 10, unit: 'kg', supplier: 'Global Foods', status: 'Good' },
    { item: 'Pepperoni', quantity: 5, unit: 'kg', supplier: 'Premium Meats', status: 'Good' },
    { item: 'French Fries (Frozen)', quantity: 30, unit: 'kg', supplier: 'Global Foods', status: 'Good' },
    { item: 'Sugar', quantity: 25, unit: 'kg', supplier: 'Global Foods', status: 'Good' },
    { item: 'Whipped Cream', quantity: 20, unit: 'cans', supplier: 'Fresh Dairy Co.', status: 'Good' },
    { item: 'Chocolate Syrup', quantity: 8, unit: 'bottles', supplier: 'Beverage World', status: 'Good' },
    { item: 'Ice Cream (Vanilla)', quantity: 10, unit: 'tubs', supplier: 'Fresh Dairy Co.', status: 'Good' },
    { item: 'Ice Cream (Chocolate)', quantity: 8, unit: 'tubs', supplier: 'Fresh Dairy Co.', status: 'Good' },
    { item: 'Tomatoes', quantity: 15, unit: 'kg', supplier: 'Organic Farms', status: 'Good' },
    { item: 'Onions', quantity: 12, unit: 'kg', supplier: 'Organic Farms', status: 'Good' },
    { item: 'Lettuce', quantity: 10, unit: 'kg', supplier: 'Organic Farms', status: 'Good' },
    { item: 'Paper Cups (12oz)', quantity: 500, unit: 'pcs', supplier: 'Packaging Pros', status: 'Good' },
    { item: 'Straws', quantity: 1000, unit: 'pcs', supplier: 'Packaging Pros', status: 'Good' },
    { item: 'Pizza Boxes (12")', quantity: 200, unit: 'pcs', supplier: 'Packaging Pros', status: 'Good' },
    { item: 'Napkins', quantity: 2000, unit: 'pcs', supplier: 'Packaging Pros', status: 'Good' },
  ];

  for (const i of inventoryItems) {
    await prisma.inventory.create({
      data: {
        userId: user.id,
        item: i.item,
        quantity: i.quantity,
        unit: i.unit,
        supplier: i.supplier,
        status: i.status,
      },
    });
  }
  console.log('Inventory items seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
