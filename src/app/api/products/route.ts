import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../src/generated/prisma";
import type { ProductSize } from "../../../../src/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Получаем URL и query параметры
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          sizes: {
            where: {
              quantity: { gt: 0 }, // только размеры с остатками
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found", success: false },
          { status: 404 }
        );
      }

      // Преобразуем данные в формат IProduct
      const productData = {
        id: product.id,
        title: product.title,
        shortTitle: product.shortTitle,
        price: product.price,
        images: JSON.parse(product.images),
        features: JSON.parse(product.features),
        composition: JSON.parse(product.composition),
        sizes: product.sizes.map((size: ProductSize) => size.size),
      };

      return NextResponse.json({
        product: productData,
        success: true,
      });
    }

    // Если ID не передан, возвращаем все активные товары
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        sizes: {
          where: {
            quantity: { gt: 0 }, // только размеры с остатками
          },
        },
      },
    });

    // Преобразуем данные в формат IProduct[]
    const productsData = products.map((product) => ({
      id: product.id,
      title: product.title,
      shortTitle: product.shortTitle,
      price: product.price,
      images: JSON.parse(product.images),
      features: JSON.parse(product.features),
      composition: JSON.parse(product.composition),
      sizes: product.sizes.map((size: ProductSize) => size.size),
    }));

    return NextResponse.json({
      products: productsData,
      total: productsData.length,
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

    const product = await prisma.product.create({
      data: {
        title: body.title,
        shortTitle: body.shortTitle || body.title,
        price: body.price,
        images: JSON.stringify(body.images || []),
        features: JSON.stringify(body.features || []),
        composition: JSON.stringify(body.composition || []),
        isActive: true,
      },
      include: {
        sizes: true,
      },
    });

    // Если переданы размеры, создаем их
    if (body.sizes && Array.isArray(body.sizes)) {
      for (const sizeData of body.sizes) {
        await prisma.productSize.create({
          data: {
            productId: product.id,
            size: sizeData.size,
            quantity: sizeData.quantity || 0,
          },
        });
      }
    }

    return NextResponse.json(
      {
        product: {
          id: product.id,
          title: product.title,
          shortTitle: product.shortTitle,
          price: product.price,
          images: JSON.parse(product.images),
          features: JSON.parse(product.features),
          composition: JSON.parse(product.composition),
          sizes: [],
        },
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
