const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'm2m@gmail.com';
  // "M2mpapascoffee" hash (using a simple hash for demo or real bcrypt if package avail, assuming bcryptjs is installed as per usual nextjs apps)
  // Check packages first, but standard for this app seems to be bcryptjs
  const password = 'M2mpapascoffee'; // in a real app we hash this. I will hash it.

  console.log(`seeding M2M menu for ${email}...`);

  // 1. Find or Create User
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "M2M's Papa Coffee",
        subscription: 'Pro' // Give them pro for the extensive menu
      }
    });
    console.log('Created new user:', user.email);
  } else {
    // Update password just in case
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log('Updated user password');
  }

  // 2. Clear existing menu/categories for this user
  await prisma.menu.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  console.log('Cleared existing menu');

  // 3. Define the Menu Data
  const categories = [
    {
      name: 'Hot Coffee',
      items: [
        { name: 'Americano', price: 450, description: 'Rich, full-bodied espresso with hot water.', available: true },
        { name: 'Cappuccino', price: 550, description: 'Espresso with steamed milk and foam.', available: true },
        { name: 'Mocha', price: 650, description: 'Espresso with chocolate and steamed milk.', available: true },
        { name: 'Hot Chocolate', price: 600, description: 'Rich chocolate drink.', available: true },
        { name: 'Mochaccino', price: 650, description: 'A chocolatey cappuccino delight.', available: true },
        { name: 'Caramel Latte', price: 650, description: 'Espresso with milk and caramel syrup.', available: true },
        { name: 'V60 Pour Over', price: 750, description: 'Single origin manual brew.', available: true },
        { name: 'Coffee Toffee', price: 600, description: 'Sweet toffee infused coffee.', available: true },
        { name: 'Spanish Latte', price: 700, description: 'Sweet, creamy latte with condensed milk.', available: true },
      ]
    },
    {
      name: 'Cold Coffee',
      items: [
        { name: 'Iced Cappuccino', price: 600, description: 'Chilled espresso with cold milk foam.', available: true },
        { name: 'Iced Americano', price: 500, description: 'Chilled espresso over ice.', available: true },
        { name: 'Lotus Frappe', price: 750, description: 'Blended ice coffee with Lotus Biscoff.', available: true },
        { name: 'Mocha Frappe', price: 700, description: 'Chocolate coffee frappe.', available: true },
        { name: 'Oreo Frappe', price: 700, description: 'Cookies and cream coffee blend.', available: true },
        { name: 'V60 Iced', price: 800, description: 'Cold brewed single origin coffee.', available: true },
        { name: 'Blue Velvet Frappe', price: 750, description: 'Signature velvety frappe.', available: true },
        { name: 'Caramel Frappe', price: 700, description: 'Sweet caramel blended coffee.', available: true },
      ]
    },
    {
      name: 'Pizzas',
      items: [
        { name: 'Chicken Malai Boti Pizza', price: 1200, description: 'Creamy chicken topping.', available: true },
        { name: 'Chicken Supreme Pizza', price: 1300, description: 'Loaded with chicken and veggies.', available: true },
        { name: 'Chicken Tikka Pizza', price: 1200, description: 'Spicy traditional tikka flavor.', available: true },
        { name: 'Chicken Fajita Pizza', price: 1200, description: 'Mexican style spiced chicken.', available: true },
        { name: 'Chicken Meatballs Pizza', price: 1350, description: 'Juicy meatballs on pizza.', available: true },
        { name: 'Chicken Kebab Crust Pizza', price: 1500, description: 'Stuffed crust with kebabs.', available: true },
        { name: 'Mediterranean Pizza', price: 1400, description: 'Olives, feta, and light herbs.', available: true },
      ]
    },
    {
      name: 'Burgers & Sandwiches',
      items: [
        { name: 'Zinger Burger', price: 650, description: 'Crispy fried chicken fillet.', available: true },
        { name: 'Cheesey Zinger Burger', price: 750, description: 'Zinger loaded with cheese.', available: true },
        { name: 'Chicken Patty Burger', price: 500, description: 'Classic chicken patty.', available: true },
        { name: 'Fajita Chicken Sandwich', price: 700, description: 'Spicy chicken in fresh bread.', available: true },
        { name: 'Club Sandwich', price: 850, description: 'Triple decker classic.', available: true },
      ]
    },
    {
      name: 'Wraps & Sides',
      items: [
        { name: 'Crispy Chicken Wrap', price: 650, description: 'Fried chicken in tortilla.', available: true },
        { name: 'BBQ Chicken Wrap', price: 650, description: 'Smoky BBQ chicken wrap.', available: true },
        { name: 'Buffalo Chicken Wrap', price: 650, description: 'Spicy buffalo sauce chicken.', available: true },
        { name: 'Chicken Wings (6 pcs)', price: 550, description: 'Crispy fried wings.', available: true },
        { name: 'Chicken Nuggets (6 pcs)', price: 450, description: 'Golden breaded nuggets.', available: true },
        { name: 'French Fries', price: 350, description: 'Crispy potato fries.', available: true },
      ]
    },
    {
      name: 'Drinks & Desserts',
      items: [
        { name: 'Tiramisu', price: 650, description: 'Classic Italian coffee dessert.', available: true },
        { name: 'Iced Tea Peach', price: 400, description: 'Refreshing peach tea.', available: true },
        { name: 'Strawberry Mojito', price: 450, description: 'Fizzy strawberry mocktail.', available: true },
        { name: 'Green Tea', price: 150, description: 'Hot herbal tea.', available: true },
      ]
    }
  ];

  // 4. Insert Data
  for (const cat of categories) {
    // Create Category in DB? 
    // The schema has a Category model. Let's populate it.
    // Note: The app's `Menu` model usually duplicates category string, but `Category` model exists for structure. 
    // I will populate both if logical, or just Menu items if that's what the app primarily uses.
    // Looking at schema: User -> Menu[] (category is a string field). User -> Category[].

    // Create the category entry
    const categoryRecord = await prisma.category.create({
      data: {
        name: cat.name,
        userId: user.id
      }
    });

    // Create menu items
    for (const item of cat.items) {
      await prisma.menu.create({
        data: {
          name: item.name,
          price: item.price,
          category: cat.name, // String field as per schema
          description: item.description,
          available: item.available,
          userId: user.id
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
