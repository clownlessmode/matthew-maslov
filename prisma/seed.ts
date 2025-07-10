import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Очищаем существующие данные
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
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

  // Создаем товары
  const products = [
    {
      title: "BAGGY-JORTS \n«OIL TRANSFORMER»",
      shortTitle: "BAGGY-JORTS",
      price: 10700,
      images: JSON.stringify([
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
      ]),
      features: JSON.stringify([
        "Шорты трансформируются в брюки",
        "8 разъемных молний YKK",
        "Кнопки для регулирования ширины снизу",
        "Скрытый логотип спереди — вышивка MATTHEW MASLOV при трансформировании в брюки",
        "Шеврон «BUTTER» на кармане сзади изделия",
        "Свободный крой, подходит под демисезон, унисекс",
      ]),
      composition: JSON.stringify(["100% хлопок, 360 гр."]),
      sizes: [
        { size: "S", quantity: 5 },
        { size: "M", quantity: 8 },
        { size: "L", quantity: 0 }, // закончился
        { size: "XL", quantity: 3 },
      ],
    },
    {
      title: "OVERSIZED HOODIE \n«METAMORPHOSIS»",
      shortTitle: "OVERSIZED HOODIE",
      price: 8900,
      images: JSON.stringify([
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
      ]),
      features: JSON.stringify([
        "Объемный силуэт, оверсайз крой",
        "Капюшон с регулируемыми стяжками",
        "Карман-кенгуру с потайными отделениями",
        "Рукава с манжетами на резинке",
        "Вышивка MATTHEW MASLOV на груди",
        "Принт «METAMORPHOSIS» на спине",
        "Унисекс модель",
      ]),
      composition: JSON.stringify(["80% хлопок, 20% полиэстер, 420 гр."]),
      sizes: [
        { size: "M", quantity: 2 },
        { size: "L", quantity: 1 },
        { size: "XL", quantity: 0 }, // закончился
        { size: "XXL", quantity: 4 },
      ],
    },
    {
      title: "CARGO PANTS \n«URBAN ARCHITECT»",
      shortTitle: "CARGO PANTS",
      price: 12500,
      images: JSON.stringify([
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
      ]),
      features: JSON.stringify([
        "Множественные карманы с клапанами",
        "Регулируемые стяжки на штанинах",
        "Усиленные швы и фурнитура",
        "Съемные элементы декора",
        "Скрытые молнии на коленях",
        "Светоотражающие элементы",
        "Тактический стиль, urban функциональность",
      ]),
      composition: JSON.stringify(["65% хлопок, 35% нейлон рипстоп, 340 гр."]),
      sizes: [
        { size: "S", quantity: 3 },
        { size: "M", quantity: 6 },
        { size: "L", quantity: 2 },
        { size: "XL", quantity: 1 },
      ],
    },
    {
      title: "TECH VEST \n«CYBER GUARDIAN»",
      shortTitle: "TECH VEST",
      price: 15700,
      images: JSON.stringify([
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
      ]),
      features: JSON.stringify([
        "Модульная система крепления аксессуаров",
        "Водоотталкивающее покрытие",
        "Скрытые карманы для гаджетов",
        "Регулируемые боковые стяжки",
        "Светоотражающие логотипы",
        "Съемный капюшон",
        "Футуристический дизайн",
      ]),
      composition: JSON.stringify(["Нейлон таслан, мембрана, неопрен"]),
      sizes: [
        { size: "M", quantity: 0 }, // закончился
        { size: "L", quantity: 1 },
        { size: "XL", quantity: 2 },
      ],
    },
    {
      title: "MULTI-JACKET \n«SYSTEM OVERRIDE»",
      shortTitle: "MULTI-JACKET",
      price: 18900,
      images: JSON.stringify([
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
        "/assets/products/jacket/1.webp",
      ]),
      features: JSON.stringify([
        "Трансформируемый дизайн 3-в-1",
        "Съемная подкладка и рукава",
        "Система вентиляции с молниями",
        "Водонепроницаемая мембрана 10000мм",
        "Проклеенные швы",
        "Множественные карманы с влагозащитой",
        "Регулируемый капюшон со стяжками",
        "Светоотражающие вставки",
      ]),
      composition: JSON.stringify([
        "Нейлон рипстоп, мембрана Gore-Tex, утеплитель Thinsulate",
      ]),
      sizes: [
        { size: "S", quantity: 1 },
        { size: "M", quantity: 3 },
        { size: "L", quantity: 0 }, // закончился
        { size: "XL", quantity: 2 },
        { size: "XXL", quantity: 1 },
      ],
    },
  ];

  for (const productData of products) {
    const { sizes, ...productInfo } = productData;

    const product = await prisma.product.create({
      data: productInfo,
    });

    // Создаем размеры для товара
    for (const sizeData of sizes) {
      await prisma.productSize.create({
        data: {
          productId: product.id,
          size: sizeData.size,
          quantity: sizeData.quantity,
        },
      });
    }
  }

  console.log("Промокоды и товары успешно созданы!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
