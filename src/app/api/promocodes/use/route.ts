import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Промокод не указан" },
        { status: 400 }
      );
    }

    // Находим промокод
    const promoCode = await prisma.promoCode.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: "Промокод не найден" },
        { status: 404 }
      );
    }

    // Проверяем активность
    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: "Промокод неактивен" },
        { status: 400 }
      );
    }

    // Проверяем срок действия
    const now = new Date();
    if (now > promoCode.expiresAt) {
      return NextResponse.json({ error: "Промокод истек" }, { status: 400 });
    }

    // Проверяем лимит использований
    if (promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { error: "Лимит использований промокода исчерпан" },
        { status: 400 }
      );
    }

    // Увеличиваем счетчик использований
    const updatedPromoCode = await prisma.promoCode.update({
      where: {
        id: promoCode.id,
      },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Промокод успешно использован",
      remainingUses: updatedPromoCode.maxUses - updatedPromoCode.usedCount,
    });
  } catch (error) {
    console.error("Ошибка при использовании промокода:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
