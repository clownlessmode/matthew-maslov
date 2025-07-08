import { NextResponse } from "next/server";
import { IProduct } from "@entities/product";

// Мокированные данные продуктов
const mockProducts: IProduct[] = [
  {
    id: "1",
    images: [
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
    ],
    price: 10700,
    title: "BAGGY-JORTS \n«OIL TRANSFORMER»",
    shortTitle: "BAGGY-JORTS",
    sizes: ["S", "M", "L", "XL"],
    features: [
      "Шорты трансформируются в брюки",
      "8 разъемных молний YKK",
      "Кнопки для регулирования ширины снизу",
      "Скрытый логотип спереди — вышивка MATTHEW MASLOV при трансформировании в брюки",
      "Шеврон «BUTTER» на кармане сзади изделия",
      "Свободный крой, подходит под демисезон, унисекс",
    ],
    composition: ["100% хлопок, 360 гр."],
  },
  {
    id: "2",
    images: [
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
    ],
    price: 8900,
    title: "OVERSIZED HOODIE \n«METAMORPHOSIS»",
    shortTitle: "OVERSIZED HOODIE",
    sizes: ["M", "L", "XL", "XXL"],
    features: [
      "Объемный силуэт, оверсайз крой",
      "Капюшон с регулируемыми стяжками",
      "Карман-кенгуру с потайными отделениями",
      "Рукава с манжетами на резинке",
      "Вышивка MATTHEW MASLOV на груди",
      "Принт «METAMORPHOSIS» на спине",
      "Унисекс модель",
    ],
    composition: ["80% хлопок, 20% полиэстер, 420 гр."],
  },
  {
    id: "3",
    images: [
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
    ],
    price: 12500,
    title: "CARGO PANTS \n«URBAN ARCHITECT»",
    shortTitle: "CARGO PANTS",
    sizes: ["S", "M", "L", "XL"],
    features: [
      "Множественные карманы с клапанами",
      "Регулируемые стяжки на штанинах",
      "Усиленные швы и фурнитура",
      "Съемные элементы декора",
      "Скрытые молнии на коленях",
      "Светоотражающие элементы",
      "Тактический стиль, urban функциональность",
    ],
    composition: ["65% хлопок, 35% нейлон рипстоп, 340 гр."],
  },
  {
    id: "4",
    images: [
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
    ],
    price: 15700,
    title: "TECH VEST \n«CYBER GUARDIAN»",
    shortTitle: "TECH VEST",
    sizes: ["M", "L", "XL"],
    features: [
      "Модульная система крепления аксессуаров",
      "Водоотталкивающее покрытие",
      "Скрытые карманы для гаджетов",
      "Регулируемые боковые стяжки",
      "Светоотражающие логотипы",
      "Съемный капюшон",
      "Футуристический дизайн",
    ],
    composition: ["Нейлон таслан, мембрана, неопрен"],
  },
  {
    id: "5",
    images: [
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
      "/assets/products/jacket/1.webp",
    ],
    price: 18900,
    title: "MULTI-JACKET \n«SYSTEM OVERRIDE»",
    shortTitle: "MULTI-JACKET",
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [
      "Трансформируемый дизайн 3-в-1",
      "Съемная подкладка и рукава",
      "Система вентиляции с молниями",
      "Водонепроницаемая мембрана 10000мм",
      "Проклеенные швы",
      "Множественные карманы с влагозащитой",
      "Регулируемый капюшон со стяжками",
      "Светоотражающие вставки",
    ],
    composition: ["Нейлон рипстоп, мембрана Gore-Tex, утеплитель Thinsulate"],
  },
];

export async function GET(request: Request) {
  try {
    // Имитируем задержку API
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Получаем URL и query параметры
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const product = mockProducts.find((p) => p.id === id);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found", success: false },
          { status: 404 }
        );
      }

      return NextResponse.json({
        product,
        success: true,
      });
    }

    // Если ID не передан, возвращаем все товары
    return NextResponse.json({
      products: mockProducts,
      total: mockProducts.length,
      success: true,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return NextResponse.json(
      { error: "Failed to fetch products", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Базовая валидация
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: "Title and price are required", success: false },
        { status: 400 }
      );
    }

    const newProduct: IProduct = {
      id: (mockProducts.length + 1).toString(),
      images: body.images || [],
      price: body.price,
      title: body.title,
      shortTitle: body.shortTitle || body.title,
      sizes: body.sizes || ["M", "L", "XL"],
      features: body.features || [],
      composition: body.composition || [],
    };

    mockProducts.push(newProduct);

    return NextResponse.json(
      {
        product: newProduct,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product", success: false },
      { status: 500 }
    );
  }
}
