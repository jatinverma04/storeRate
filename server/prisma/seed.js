import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@storerate.com";
const ADMIN_PASSWORD = "Admin@12345";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "StoreRate System Administrator",
      email: ADMIN_EMAIL,
      password: passwordHash,
      address: "Platform HQ, Default Address",
      role: Role.ADMIN,
    },
  });

  console.log("Seed complete. Admin login:");
  console.log(`  email: ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
