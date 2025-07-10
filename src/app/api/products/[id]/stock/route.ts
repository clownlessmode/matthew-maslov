import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../../src/generated/prisma";

const prisma = new PrismaClient();

// Обновление остатков товара
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Валидация
    if (!body.size || typeof body.quantity !== "number") {
      return NextResponse.json(
        { error: "Size and quantity are required", success: false },
        { status: 400 }
      );
    }

    // Проверяем существование товара
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Обновляем или создаем размер
    const productSize = await prisma.productSize.upsert({
      where: {
        productId_size: {
          productId: id,
          size: body.size,
        },
      },
      update: {
        quantity: body.quantity,
      },
      create: {
        productId: id,
        size: body.size,
        quantity: body.quantity,
      },
    });

    return NextResponse.json({
      productSize,
      success: true,
    });
  } catch (error) {
    console.error("Failed to update product stock:", error);
    return NextResponse.json(
      { error: "Failed to update product stock", success: false },
      { status: 500 }
    );
  }
}

// Получение остатков товара
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const productSizes = await prisma.productSize.findMany({
      where: { productId: id },
      orderBy: { size: "asc" },
    });

    return NextResponse.json({
      productSizes,
      success: true,
    });
  } catch (error) {
    console.error("Failed to fetch product stock:", error);
    return NextResponse.json(
      { error: "Failed to fetch product stock", success: false },
      { status: 500 }
    );
  }
}
