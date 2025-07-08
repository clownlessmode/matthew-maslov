"use client";
import { CartItem } from "@entities/cart/ui/cart-item";
import { CartSummary } from "@entities/cart/ui/cart-summary";
import { CartAPI, ICart } from "@entities/cart";
import { cn } from "@shared/utils/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузить корзину при монтировании компонента
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await CartAPI.getCart();
      setCart(response.cart);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError("Не удалось загрузить корзину");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (!cart) return;

    try {
      setIsUpdating(true);
      const response = await CartAPI.updateCartItem({
        cartItemId: itemId,
        quantity,
      });
      setCart(response.cart);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Не удалось обновить количество");
      // Перезагрузить корзину в случае ошибки
      await loadCart();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!cart) return;

    try {
      setIsUpdating(true);
      const response = await CartAPI.removeFromCart({ cartItemId: itemId });
      setCart(response.cart);
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Не удалось удалить товар");
      // Перезагрузить корзину в случае ошибки
      await loadCart();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsUpdating(true);
      const response = await CartAPI.clearCart();
      setCart(response.cart);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError("Не удалось очистить корзину");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckout = () => {
    // Здесь будет логика оформления заказа
    alert("Функция оформления заказа будет добавлена позже");
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          "mt-[80px]",
          "p-5 sm:p-10 lg:p-15 xl:p-20 2xl:p-25"
        )}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загружаем корзину...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          "mt-[80px]",
          "p-5 sm:p-10 lg:p-15 xl:p-20 2xl:p-25"
        )}
      >
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadCart}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          "mt-[80px]",
          "p-5 sm:p-10 lg:p-15 xl:p-20 2xl:p-25"
        )}
      >
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold">Корзина пуста</h1>
          <p className="text-muted-foreground text-lg">
            Добавьте товары в корзину, чтобы продолжить покупки
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Вернуться к покупкам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen",
        "mt-[80px]",
        "p-5 sm:p-10 lg:p-15 xl:p-20 2xl:p-25"
      )}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Корзина ({cart.totalItems} товар
          {cart.totalItems === 1 ? "" : cart.totalItems < 5 ? "а" : "ов"})
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 mb-8 lg:mb-0">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                isUpdating={isUpdating}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              cart={cart}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              isUpdating={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
