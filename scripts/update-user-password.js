const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updatePassword() {
  const email = "sohaib@chromadiv.com";
  const newPassword = "Welcome124@#";

  console.log(`Updating password for ${email}...`);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });
    console.log(`✅ Password updated successfully for user ID: ${user.id}`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`❌ User with email ${email} not found.`);
      // Try to create the user if not found? No, better to just error out as migration should have run.
      console.log("Creating user instead...");
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Sohaib Latif",
          createdAt: new Date(),
        }
      });
      console.log(`✅ User created with correct password. ID: ${user.id}`);
    } else {
      console.error("❌ Error updating password:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
