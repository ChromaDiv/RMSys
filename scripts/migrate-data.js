const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Load local env for Supabase keys
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("🚀 Starting Migration with Multi-Tenancy Support...");

  // 1. Migrate User (Manual)
  console.log("👤 Migrating User...");
  const email = "sohaib@chromadiv.com";
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const hashedPassword = await bcrypt.hash("Welcome1234@", 10);
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Sohaib Latif",
        createdAt: new Date(),
      }
    });
    console.log(`✅ User 'sohaib@chromadiv.com' created with ID: ${user.id}`);
  } else {
    console.log(`ℹ️ User already exists with ID: ${user.id}`);
  }

  const userId = user.id;

  // 2. Migrate Menu
  console.log("🍔 Migrating Menu...");
  const { data: menuItems, error: menuError } = await supabase.from('menu').select('*');
  if (menuError) console.error("Error fetching menu:", menuError.message);
  else {
    for (const item of menuItems) {
      await prisma.menu.upsert({
        where: { id: item.id },
        update: {
          userId: userId,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          image_url: item.image_url,
          available: item.available,
        },
        create: {
          id: item.id,
          userId: userId,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          image_url: item.image_url,
          available: item.available,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        }
      });
    }
    console.log(`✅ Migrated ${menuItems.length} menu items.`);
  }

  // 3. Migrate Suppliers
  console.log("🚚 Migrating Suppliers...");
  const { data: suppliers, error: supError } = await supabase.from('suppliers').select('*');
  if (supError) console.error("Error fetching suppliers:", supError.message);
  else {
    for (const item of suppliers) {
      await prisma.supplier.upsert({
        where: { id: item.id },
        update: {
          userId: userId,
          name: item.name,
          type: item.category || "General",
          rating: item.reliability || 5.0,
          status: item.status || "Active",
        },
        create: {
          id: item.id,
          userId: userId,
          name: item.name,
          type: item.category || "General",
          rating: item.reliability || 5.0,
          status: item.status || "Active",
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        }
      });
    }
    console.log(`✅ Migrated ${suppliers.length} suppliers.`);
  }

  // 4. Migrate Inventory
  console.log("📦 Migrating Inventory...");
  const { data: inventory, error: invError } = await supabase.from('inventory').select('*');
  if (invError) console.error("Error fetching inventory:", invError.message);
  else {
    for (const item of inventory) {
      await prisma.inventory.upsert({
        where: { id: parseInt(item.id) },
        update: {
          userId: userId,
          quantity: Number(item.quantity) || 0,
          unit: item.unit || "units",
          item: item.item || item.item_name || item.name || "Unknown Item",
          supplier: item.supplier || (item.supplier_id ? `Supplier ${item.supplier_id}` : "Unknown"),
          status: item.status || "Good"
        },
        create: {
          id: parseInt(item.id),
          userId: userId,
          item: item.item || item.item_name || item.name || "Unknown Item",
          quantity: Number(item.quantity) || 0,
          unit: item.unit || "units",
          supplier: item.supplier || (item.supplier_id ? `Supplier ${item.supplier_id}` : "Unknown"),
          status: item.status || "Good",
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        }
      });
    }
    console.log(`✅ Migrated ${inventory.length} inventory items.`);
  }

  // 5. Migrate Orders
  console.log("🧾 Migrating Orders...");
  const { data: orders, error: ordError } = await supabase.from('orders').select('*');
  if (ordError) console.error("Error fetching orders:", ordError.message);
  else {
    for (const item of orders) {
      await prisma.order.upsert({
        where: { id: parseInt(item.id) },
        update: {
          userId: userId,
          status: item.status || "Preparing",
          customer: item.customer || "Guest",
          phone: item.phone || "",
          items: item.items || [],
          total: Number(item.total || 0)
        },
        create: {
          id: parseInt(item.id),
          userId: userId,
          customer: item.customer || "Guest",
          phone: item.phone || "",
          items: item.items || [],
          total: Number(item.total || 0),
          status: item.status || "Preparing",
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        }
      });
    }
    console.log(`✅ Migrated ${orders.length} orders.`);
  }

  console.log("✨ Migration Complete.");
}

migrate()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
