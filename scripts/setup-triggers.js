const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up Supabase Triggers...');

  // 1. Function to handle new user
  // We use "User" table. Note quotes for case sensitivity if needed.
  // Prisma usually creates tables as "User" if model is User.
  try {
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public."User" (email, name, email_verified)
        VALUES (new.email, new.raw_user_meta_data->>'full_name', now())
        ON CONFLICT (email) DO NOTHING;
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('✅ Function handle_new_user created.');

    // 2. Trigger
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);
    console.log('✅ Trigger on_auth_user_created created.');

  } catch (e) {
    console.error('Error setting up triggers:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
