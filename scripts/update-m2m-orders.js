const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PAKISTANI_NAMES = [
  'Ahmed Khan', 'Bilal Ahmed', 'Fatima Ali', 'Zainab Bibi', 'Muhammad Usman',
  'Hamza Malik', 'Ayesha Khan', 'Omar Farooq', 'Sana Mir', 'Ali Raza',
  'H Hassan', 'Sadia Malik', 'Usman Tariq', 'Hira Mani', 'Fahad Mustafa',
  'Mahira Khan', 'Atif Aslam', 'Sajal Aly', 'Bilal Abbas', 'Yumna Zaidi',
  'Ahsan Khan', 'Kubra Khan', 'Feroze Khan', 'Iqra Aziz', 'Yasir Hussain',
  'Minal Khan', 'Aiman Khan', 'Sarah Khan', 'Falak Shabir', 'Ayeza Khan',
  'Danish Taimoor', 'Maya Ali', 'Sheheryar Munawar', 'Syra Yousuf', 'Shahroz Sabzwari',
  'Sadaf Kanwal', 'Urwa Hocane', 'Farhan Saeed', 'Mawra Hocane', 'Ameer Gilani',
  'Kinza Hashmi', 'Saboor Aly', 'Ali Ansari', 'Ramsha Khan', 'Wahaj Ali'
];

const PHONE_PREFIXES = ['92300', '92301', '92302', '92321', '92322', '92333', '92334', '92345', '92313'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePakistaniPhone() {
  const prefix = getRandomElement(PHONE_PREFIXES);
  const suffix = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  return `${prefix}${suffix}`;
}

async function main() {
  const email = 'm2m@gmail.com';
  console.log(`Updating orders for ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      menuItems: true, // Get the new menu
      orders: true     // Get existing orders
    }
  });

  if (!user) {
    console.error('User not found!');
    process.exit(1);
  }

  if (user.menuItems.length === 0) {
    console.error('No menu items found. Please seed menu first.');
    process.exit(1);
  }

  for (const order of user.orders) {
    // 1. Update Customer & Phone
    const newName = getRandomElement(PAKISTANI_NAMES);
    const newPhone = generatePakistaniPhone();

    // 2. Select New Items (1 to 4 items)
    const numItems = Math.floor(Math.random() * 4) + 1;
    const selectedItems = [];
    let newTotal = 0;

    for (let i = 0; i < numItems; i++) {
      const item = getRandomElement(user.menuItems);
      // Avoid duplicate items for simplicity in string list, or allow quantity logic
      // For this simple schema (Json items), we usually store strings "Item A, Item B" or objects
      // Let's store objects to be consistent with our recent "fix" updates if possible, 
      // BUT the Seed Data used strings mostly. The app handles both.
      // Let's use objects { name: '..', price: .., quantity: 1 } to be robust.

      selectedItems.push({
        name: item.name,
        price: parseFloat(item.price), // Handle Decimal
        quantity: 1
      });
      newTotal += parseFloat(item.price);
    }

    // 3. Update Order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        customer: newName,
        phone: newPhone,
        items: selectedItems, // Prisma handles JSON serialization
        total: newTotal
      }
    });

    // console.log(`Updated Order #${order.id}: ${newName} - ${newTotal}`);
  }

  console.log(`Successfully updated ${user.orders.length} orders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
