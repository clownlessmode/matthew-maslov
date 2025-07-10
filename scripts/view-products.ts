import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("=== ТОВАРЫ И ИХ ОСТАТКИ ===\n");

  const products = await prisma.product.findMany({
    include: {
      sizes: {
        orderBy: { size: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });

  for (const product of products) {
    console.log(`📦 ${product.title}`);
    console.log(`   Цена: ${product.price} ₽`);
    console.log(
      `   Статус: ${product.isActive ? "✅ Активен" : "❌ Неактивен"}`
    );

    if (product.sizes.length > 0) {
      console.log("   Размеры и остатки:");
      for (const size of product.sizes) {
        const status =
          size.quantity > 0 ? `✅ ${size.quantity} шт.` : "❌ Нет в наличии";
        console.log(`     ${size.size}: ${status}`);
      }
    } else {
      console.log("   ❌ Нет размеров");
    }

    console.log(""); // пустая строка для разделения
  }

  console.log(`Всего товаров: ${products.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
