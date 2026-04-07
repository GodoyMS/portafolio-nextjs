import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const plain = process.env.ADMIN_SEED_PASSWORD?.trim();

  if (!email || !plain) {
    console.log("Seed skipped: set ADMIN_EMAIL and ADMIN_SEED_PASSWORD to create the first AdminUser row.");
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("AdminUser already exists:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(plain, 12);
  await prisma.adminUser.create({
    data: { email, passwordHash },
  });
  console.log("Created AdminUser:", email);
  console.log("You can remove ADMIN_SEED_PASSWORD from the environment after seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
