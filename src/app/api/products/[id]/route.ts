import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../src/generated/prisma";
import type { ProductSize } from "../../../../../src/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Проверяем существование товара
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Обновляем товар
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        shortTitle: body.shortTitle,
        price: body.price,
        features: JSON.stringify(body.features || []),
        composition: JSON.stringify(body.composition || []),
      },
      include: {
        sizes: {
          where: {
            quantity: { gt: 0 },
          },
        },
      },
    });

    // Преобразуем данные в формат IProduct
    const productData = {
      id: updatedProduct.id,
      title: updatedProduct.title,
      shortTitle: updatedProduct.shortTitle,
      price: updatedProduct.price,
      images: JSON.parse(updatedProduct.images),
      features: JSON.parse(updatedProduct.features),
      composition: JSON.parse(updatedProduct.composition),
      sizes: updatedProduct.sizes.map((size: ProductSize) => size.size),
    };

    return NextResponse.json({
      product: productData,
      success: true,
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product", success: false },
      { status: 500 }
    );
  }
}
