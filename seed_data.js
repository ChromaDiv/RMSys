const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define category sequence to match "how it was"
const categoryOrderMap = {
  'Exciting Deals': 1,
  'Pizza, Sandwiches, & More': 2,
  'Signature Cold Coffee': 3,
  'Signature Hot Coffee': 4,
  'Ice Cream Shakes & Mojito': 5,
  'Hot Coffee': 6,
  'Cold Coffee': 7,
  'Teas & Desserts': 8,
  'Raw Coffee (Beans)': 9
};

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

// Enrich menu items with order sequence logic
const enrichedMenuData = menuData.map(item => ({
  ...item,
  // We will use a virtual category_order in the API rather than adding a column for now
  // unless the user prefers it. For now, matching "as it was" is easier via API map.
}));

const mockOrders = [
  // Ahmed Khan (Frequent Flyer, High Roller)
  { customer: 'Ahmed Khan', phone: '923001234567', items: ['Zinger Burger', 'Fries', 'Soft Drink'], total: 950, status: 'Preparing' },
  { customer: 'Ahmed Khan', phone: '923001234567', items: ['Zinger Burger', 'Soft Drink'], total: 800, status: 'Delivered' },
  { customer: 'Ahmed Khan', phone: '923001234567', items: ['Zinger Burger', 'Loaded Fries'], total: 1150, status: 'Delivered' },
  { customer: 'Ahmed Khan', phone: '923001234567', items: ['Cheesy Zinger Burger'], total: 530, status: 'Delivered' },
  { customer: 'Ahmed Khan', phone: '923001234567', items: ['Cappuccino'], total: 520, status: 'Delivered' },

  // Fatima Ali (Frequent Flyer)
  { customer: 'Fatima Ali', phone: '923119876543', items: ['Hazelnut Iced Latte', 'Lotus Ice Cream Shake'], total: 1170, status: 'Ready' },
  { customer: 'Fatima Ali', phone: '923119876543', items: ['Hazelnut Iced Latte'], total: 650, status: 'Delivered' },
  { customer: 'Fatima Ali', phone: '923119876543', items: ['Lotus Frappe'], total: 720, status: 'Delivered' },
  { customer: 'Fatima Ali', phone: '923119876543', items: ['Mocha Frappe'], total: 720, status: 'Delivered' },

  // Bilal Hyatt
  { customer: 'Bilal Hyatt', phone: '923215554433', items: ['Club Sandwich', 'Mint Margarita'], total: 1100, status: 'Delivered' },
  { customer: 'Bilal Hyatt', phone: '923215554433', items: ['BBQ Chicken Wrap'], total: 380, status: 'Delivered' },

  // Sara Ahmed
  { customer: 'Sara Ahmed', phone: '923334445556', items: ['Offer of the Day (2 in 1 Deal)'], total: 1350, status: 'Delivered' },
  { customer: 'Sara Ahmed', phone: '923334445556', items: ['Economy Deal'], total: 1700, status: 'Delivered' },

  // Usman Zafar
  { customer: 'Usman Zafar', phone: '923456789012', items: ['Cappuccino', 'Croissant'], total: 630, status: 'Delivered' },
  { customer: 'Usman Zafar', phone: '923456789012', items: ['Cappuccino'], total: 520, status: 'Delivered' },

  // Hina Riaz
  { customer: 'Hina Riaz', phone: '923551122334', items: ['Family Deal'], total: 3720, status: 'Delivered' },
  { customer: 'Hina Riaz', phone: '923551122334', items: ['Friends Deal'], total: 4800, status: 'Delivered' },

  // Ali Raza
  { customer: 'Ali Raza', phone: '923667788990', items: ['V60 Iced', 'Cream Puff'], total: 625, status: 'Cancelled' },
  { customer: 'Ali Raza', phone: '923667788990', items: ['V60 Iced'], total: 550, status: 'Delivered' },

  // New Customers to increase data volume
  { customer: 'Omar Farooq', phone: '923009876543', items: ['Chicken Tikka Pizza', 'Soft Drink'], total: 620, status: 'Delivered' },
  { customer: 'Omar Farooq', phone: '923009876543', items: ['Chicken Fajita Pizza'], total: 550, status: 'Delivered' },

  { customer: 'Zaynab Malik', phone: '923112233445', items: ['Blue Velvet Frappe', 'Chocolate Brownie'], total: 970, status: 'Delivered' },
  { customer: 'Zaynab Malik', phone: '923112233445', items: ['Blue Velvet Ice Cream Shake'], total: 720, status: 'Delivered' },

  { customer: 'Hamza Siddiqui', phone: '923219988776', items: ['Mediterranean Pizza', 'Iced Tea Peach'], total: 1070, status: 'Delivered' },
  { customer: 'Maryam Jameel', phone: '923331122334', items: ['Chicken Patty Burger', 'Mineral Water Small'], total: 520, status: 'Delivered' },
  { customer: 'Mustafa Qureshi', phone: '923451122334', items: ['Spanish Latte', 'Chocolate Croissant'], total: 1000, status: 'Delivered' },
  { customer: 'Amna Sheikh', phone: '923552233445', items: ['Hot Chocolate', 'Pastry (Chocolate/Caramel)'], total: 870, status: 'Delivered' },

  { customer: 'Kashif Mehmood', phone: '923661234567', items: ['Buffalo Chicken Wrap', 'Mochaccino'], total: 1030, status: 'Preparing' },
  { customer: 'Sana Khan', phone: '923001112223', items: ['V60', 'Chocolate Brownie'], total: 800, status: 'Delivered' },
  { customer: 'Rohail Ahmed', phone: '923214445556', items: ['Chicken Supreme Pizza', 'Oreo Frappe'], total: 1270, status: 'Delivered' },
  { customer: 'Eshal Fatima', phone: '923336667778', items: ['Iced Cappuccino', 'Croissant'], total: 700, status: 'Delivered' },
  { customer: 'Zainab Bibi', phone: '923458889990', items: ['Deal for 2 (2 Med Pizza + 2 Drinks)'], total: 2100, status: 'Delivered' },

  { customer: 'Arsalan Shah', phone: '923550001112', items: ['Chicken Malai Boti Pizza', 'Mint Margarita'], total: 1070, status: 'Delivered' },
  { customer: 'Nimra Yusuf', phone: '923004443332', items: ['Caramel Frappe', 'Nuggets'], total: 1110, status: 'Delivered' },
  { customer: 'Tariq Aziz', phone: '923115556667', items: ['Americano', 'Pastry (Chocolate/Caramel)'], total: 700, status: 'Delivered' },
  { customer: 'Sobia Malik', phone: '923218887776', items: ['Kabab Crust Pizza', 'Soft Drink'], total: 770, status: 'Delivered' },
  { customer: 'Farhan Saeed', phone: '923332221110', items: ['Deal for 4 (1 Lrg + 1 Med Pizza + 4 Clubs + 4 Drinks)'], total: 4350, status: 'Delivered' },

  { customer: 'Ayesha Gul', phone: '923457776665', items: ['Chicken Wings (Buffalo/BBQ)', 'Strawberry Mojito'], total: 970, status: 'Delivered' },
  { customer: 'Jibran Nasir', phone: '923553332221', items: ['Mocha', 'Chocolate Croissant'], total: 1000, status: 'Delivered' },
  { customer: 'Hassan Raza', phone: '923006665554', items: ['Deal for 2 (1 Lrg Pizza + 2 Zingers + 2 Drinks)'], total: 2385, status: 'Delivered' },
  { customer: 'Kiran Shahzadi', phone: '923119998887', items: ['Lotus Ice Cream Shake', 'Cream Puff'], total: 795, status: 'Delivered' },
  { customer: 'Adnan Sami', phone: '923212223334', items: ['Tea with Milk', 'Mineral Water Small'], total: 420, status: 'Delivered' },

  { customer: 'Rabia Basri', phone: '923339990001', items: ['English Breakfast Tea', 'Green Tea (Moroccan Mint & Lemon)'], total: 540, status: 'Delivered' },
  { customer: 'Saifullah Khan', phone: '923451110002', items: ['Raaz Guatemala Beans (250g)'], total: 2750, status: 'Delivered' },
  { customer: 'Mehak Ali', phone: '923554440003', items: ['Raaz Espresso Beans (1kg)'], total: 11500, status: 'Delivered' },
  { customer: 'Waqas Ahmed', phone: '923001119998', items: ['Raaz Kenya Rarity (250g)'], total: 4500, status: 'Delivered' },
  { customer: 'Fiza Batool', phone: '923112228887', items: ['Raaz Signature Blend (250g)'], total: 2500, status: 'Delivered' },
  { customer: 'Zeeshan Haider', phone: '923213337776', items: ['Raaz Colombia Huila (250g)'], total: 3750, status: 'Delivered' }
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
  console.log("Cleaning old data...");
  await supabase.from('menu').delete().neq('id', 0);
  await supabase.from('orders').delete().neq('id', 0);
  await supabase.from('inventory').delete().neq('id', 0);
  await supabase.from('suppliers').delete().neq('id', 0);

  console.log("Seeding Menu...");
  const { error: menuError } = await supabase.from('menu').insert(menuData);
  if (menuError) console.error("Menu Seed Error:", menuError);

  console.log("Seeding Orders...");
  // Spread orders over past 3 days to make analytics look good
  const ordersWithDates = mockOrders.map((order, index) => {
    const date = new Date();
    date.setHours(date.getHours() - (index * 2)); // Spread out by 2 hours each
    return {
      ...order,
      created_at: date.toISOString()
    };
  });

  const { error: orderError } = await supabase.from('orders').insert(ordersWithDates);
  if (orderError) console.error("Order Seed Error:", orderError);

  console.log("Seeding Inventory...");
  const { error: invError } = await supabase.from('inventory').insert(mockInventory);
  if (invError) console.error("Inventory Seed Error:", invError);

  console.log("Seeding Suppliers...");
  const { error: supError } = await supabase.from('suppliers').insert(mockSuppliers);
  if (supError) console.error("Suppliers Seed Error:", supError);

  console.log("Migration Complete! 🚀 Expanded dataset with " + mockOrders.length + " orders.");
}

seed();
