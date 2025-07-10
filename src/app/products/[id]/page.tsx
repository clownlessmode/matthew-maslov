import { getProduct } from "@entities/product";
import ProductPage from "../../../page/product-page/ui/product-page";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProduct(id);

    if (!product.product) {
      return {
        title: "Товар не найден | Matthew Maslow",
        description: "Запрашиваемый товар не найден в нашем магазине.",
      };
    }

    const { title, images } = product.product;
    const imageUrl = images?.[0] || "/seo/opengraph.png";

    return {
      title: `${title}`,
      description: `Купить ${title} в магазине Matthew Maslow. Высокое качество, стильный дизайн.`,
      keywords: [`${title}`, "Matthew Maslow", "одежда", "стиль", "мода"],
      openGraph: {
        title: `${title} | Matthew Maslow`,
        description: `Купить ${title} в магазине Matthew Maslow. Высокое качество, стильный дизайн.`,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        siteName: "Matthew Maslow",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Matthew Maslow`,
        description: `Купить ${title} в магазине Matthew Maslow.`,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://matthew-maslov.com/products/${id}`,
      },
    };
  } catch (error) {
    console.error("Ошибка при генерации метаданных:", error);
    return {
      title: "Ошибка | Matthew Maslow",
      description: "Произошла ошибка при загрузке товара.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductPage product={product.product} />;
}
