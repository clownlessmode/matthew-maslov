import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Очищаем существующие промокоды
  await prisma.promoCode.deleteMany();

  // Создаем промокоды
  const promoCodes = [
    {
      code: "WELCOME10",
      discount: 10,
      maxUses: 100,
      usedCount: 45,
      expiresAt: new Date("2025-12-31T23:59:59Z"),
      isActive: true,
    },
    {
      code: "SUMMER20",
      discount: 20,
      maxUses: 50,
      usedCount: 12,
      expiresAt: new Date("2025-08-31T23:59:59Z"),
      isActive: true,
    },
    {
      code: "NEWYEAR25",
      discount: 25,
      maxUses: 200,
      usedCount: 89,
      expiresAt: new Date("2026-01-15T23:59:59Z"),
      isActive: true,
    },
    {
      code: "FLASH30",
      discount: 30,
      maxUses: 30,
      usedCount: 30, // уже использован максимальное количество раз
      expiresAt: new Date("2025-12-25T23:59:59Z"),
      isActive: true,
    },
    {
      code: "EXPIRED15",
      discount: 15,
      maxUses: 100,
      usedCount: 20,
      expiresAt: new Date("2025-01-01T23:59:59Z"), // уже истек
      isActive: true,
    },
  ];

  for (const promoCode of promoCodes) {
    await prisma.promoCode.create({
      data: promoCode,
    });
  }

  console.log("Промокоды успешно созданы!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
