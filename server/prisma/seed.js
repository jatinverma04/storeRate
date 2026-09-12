import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Admin@12345";
const USER_PASSWORD = "User@12345";
const OWNER_PASSWORD = "Owner@12345";

const admins = [
  {
    email: "admin@storerate.com",
    name: "StoreRate Platform Administrator",
    address: "12 Platform Way, Tech Park, Bengaluru 560001",
  },
  {
    email: "priya.admin@storerate.com",
    name: "Priya Sharma Operations Administrator",
    address: "88 Admin Block, Sector 18, Gurugram 122015",
  },
];

const normalUser = {
  email: "rohan.user@example.com",
  name: "Rohan Mehta Community Member User",
  address: "Flat 402, Lakeview Apartments, Pune 411001",
  password: USER_PASSWORD,
};

/** One featured store owner for demos; four more owners for four additional stores. */
const stores = [
  {
    storeName: "Downtown Coffee Collective Cafe",
    storeEmail: "downtown.coffee@storerate.com",
    storeAddress: "45 MG Road, Ground Floor, Bengaluru 560001",
    ownerName: "Anita Desai Coffee Store Owner",
    ownerEmail: "anita.owner@storerate.com",
    ownerAddress: "45 MG Road, Bengaluru 560001",
    featured: true,
  },
  {
    storeName: "GreenLeaf Organic Grocery Market",
    storeEmail: "greenleaf.grocery@storerate.com",
    storeAddress: "210 Park Street, Kolkata 700016",
    ownerName: "Vikram Singh Grocery Store Owner",
    ownerEmail: "vikram.owner@storerate.com",
    ownerAddress: "210 Park Street, Kolkata 700016",
  },
  {
    storeName: "CityFit Premium Fitness Studio Hub",
    storeEmail: "cityfit.studio@storerate.com",
    storeAddress: "9 Fitness Lane, Bandra West, Mumbai 400050",
    ownerName: "Meera Nair Fitness Store Owner",
    ownerEmail: "meera.owner@storerate.com",
    ownerAddress: "9 Fitness Lane, Mumbai 400050",
  },
  {
    storeName: "TechHub Electronics Repair Center",
    storeEmail: "techhub.repair@storerate.com",
    storeAddress: "77 IT Corridor, Hitech City, Hyderabad 500081",
    ownerName: "Arjun Patel Electronics Store Owner",
    ownerEmail: "arjun.owner@storerate.com",
    ownerAddress: "77 IT Corridor, Hyderabad 500081",
  },
  {
    storeName: "Bella Napoli Italian Kitchen Restaurant",
    storeEmail: "bella.napoli@storerate.com",
    storeAddress: "3 Food Court, Connaught Place, Delhi 110001",
    ownerName: "Sofia Rossi Restaurant Store Owner",
    ownerEmail: "sofia.owner@storerate.com",
    ownerAddress: "3 Food Court, Delhi 110001",
  },
];

async function hash(password) {
  return bcrypt.hash(password, 10);
}

async function main() {
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await hash(DEMO_PASSWORD);
  const userPasswordHash = await hash(normalUser.password);
  const ownerPasswordHash = await hash(OWNER_PASSWORD);

  const primaryAdmin = await prisma.user.create({
    data: {
      ...admins[0],
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      ...admins[1],
      password: adminPasswordHash,
      role: Role.ADMIN,
      createdByAdminId: primaryAdmin.id,
    },
  });

  const normal = await prisma.user.create({
    data: {
      name: normalUser.name,
      email: normalUser.email,
      address: normalUser.address,
      password: userPasswordHash,
      role: Role.USER,
      createdByAdminId: primaryAdmin.id,
    },
  });

  const createdStores = [];
  for (const row of stores) {
    const owner = await prisma.user.create({
      data: {
        name: row.ownerName,
        email: row.ownerEmail,
        address: row.ownerAddress,
        password: ownerPasswordHash,
        role: Role.STORE_OWNER,
        createdByAdminId: primaryAdmin.id,
      },
    });
    const store = await prisma.store.create({
      data: {
        name: row.storeName,
        email: row.storeEmail,
        address: row.storeAddress,
        ownerId: owner.id,
      },
    });
    createdStores.push({ store, owner, featured: row.featured });
  }

  const ratings = [
    { storeIndex: 0, score: 5 },
    { storeIndex: 1, score: 4 },
    { storeIndex: 2, score: 3 },
    { storeIndex: 3, score: 5 },
    { storeIndex: 4, score: 4 },
  ];
  for (const { storeIndex, score } of ratings) {
    await prisma.rating.create({
      data: {
        userId: normal.id,
        storeId: createdStores[storeIndex].store.id,
        score,
      },
    });
  }

  const featured = createdStores.find((s) => s.featured);

  console.log("Seed complete — demo data reset.\n");
  console.log("Admins (password for both):", DEMO_PASSWORD);
  for (const a of admins) {
    console.log(`  ${a.email}`);
  }
  console.log("\nNormal user:", normalUser.email, "/", normalUser.password);
  console.log(
    "\nFeatured store owner:",
    featured.owner.email,
    "/",
    OWNER_PASSWORD
  );
  console.log("  Store:", featured.store.name);
  console.log("\nAll store owners use password:", OWNER_PASSWORD);
  for (const { owner, store } of createdStores) {
    console.log(`  ${owner.email} → ${store.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
