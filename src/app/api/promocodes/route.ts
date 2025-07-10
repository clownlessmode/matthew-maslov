import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Промокод не указан" }, { status: 400 });
  }

  try {
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

    // Проверяем активность промокода
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

    return NextResponse.json({
      code: promoCode.code,
      discount: promoCode.discount,
      maxUses: promoCode.maxUses,
      usedCount: promoCode.usedCount,
      remainingUses: promoCode.maxUses - promoCode.usedCount,
      expiresAt: promoCode.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Ошибка при проверке промокода:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
