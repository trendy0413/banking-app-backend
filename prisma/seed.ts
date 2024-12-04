import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  // Create initial users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        bankNumber: "DE89370400440532013000",
        balance: 1000,
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        bankNumber: "GB29NWBK60161331926819",
        balance: 0,
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        bankNumber: "FR1420041010050500013M02606",
        balance: 0,
      },
      {
        name: "David Wilson",
        email: "david@example.com",
        bankNumber: "IT60X0542811101000000123456",
        balance: 0,
      },
    ],
  });

  // Create initial transactions for first user
  const firstUser = await prisma.user.findFirst();
  if (firstUser) {
    await prisma.transaction.create({
      data: {
        title: "Initial Deposit",
        type: "deposit",
        amount: 1000,
        userId: firstUser.id,
        status: "success",
      },
    });
  }

  console.log("Seed data added successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
