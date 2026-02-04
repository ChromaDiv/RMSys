const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Target lowercase email as this is likely the original account
  const email = 'm2m@gmail.com';

  console.log(`Finding user with email: ${email}...`);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User with email ${email} not found!`);
    // If not found, try the other one just in case
    process.exit(1);
  }

  console.log(`Found user: ${user.name} (ID: ${user.id})`);

  const statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  const menuItems = [
    { name: 'Cafe Latte', price: 4.50 },
    { name: 'Cappuccino', price: 4.00 },
    { name: 'Espresso', price: 3.00 },
    { name: 'Mocha', price: 5.00 },
    { name: 'Croissant', price: 3.50 },
    { name: 'Bagel', price: 2.50 },
    { name: 'Sandwich', price: 7.50 },
    { name: 'Salad', price: 8.00 },
  ];

  const orders = [];
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  console.log('Generating 300 orders...');

  for (let i = 0; i < 300; i++) {
    // Random date between 6 months ago and now
    const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
    const createdAt = new Date(randomTime);

    // Random items
    const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items
    const selectedItems = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const item = menuItems[Math.floor(Math.random() * menuItems.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      selectedItems.push({ ...item, quantity: qty });
      total += item.price * qty;
    }

    // Random status
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    orders.push({
      userId: user.id,
      customer: `Customer ${Math.floor(Math.random() * 1000)}`,
      phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
      items: selectedItems, // JSON
      total: total,         // Decimal
      status: status,
      createdAt: createdAt,
      updatedAt: createdAt // Set updated same as created for simplicity
    });
  }

  console.log('Inserting orders into database...');

  // Using createMany for better performance
  await prisma.order.createMany({
    data: orders,
  });

  console.log('Successfully added 300 orders!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
