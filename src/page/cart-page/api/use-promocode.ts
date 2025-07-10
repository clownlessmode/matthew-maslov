import { useState, useEffect } from "react";

interface PromoCode {
  code: string;
  discount: number;
  maxUses: number;
  usedCount: number;
  remainingUses: number;
  expiresAt: string;
}

interface UsePromoCodeReturn {
  promoCode: PromoCode | null;
  loading: boolean;
  error: string | null;
  checkPromoCode: (code: string) => void;
  clearPromoCode: () => void;
  usePromoCode: (code: string) => Promise<boolean>;
}

export const usePromoCode = (): UsePromoCodeReturn => {
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const checkPromoCode = async (code: string) => {
    if (!code.trim()) {
      setPromoCode(null);
      setError(null);
      return;
    }

    // Очищаем предыдущий таймер
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Устанавливаем новый таймер с дебаунсом 500ms
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/promocodes?code=${encodeURIComponent(code)}`
        );

        if (response.ok) {
          const data = await response.json();
          setPromoCode(data);
          setError(null);
        } else {
          const errorData = await response.json();
          setPromoCode(null);
          setError(errorData.error || "Ошибка проверки промокода");
        }
      } catch {
        setPromoCode(null);
        setError("Ошибка сети");
      } finally {
        setLoading(false);
      }
    }, 500);

    setDebounceTimer(timer);
  };

  const clearPromoCode = () => {
    setPromoCode(null);
    setError(null);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  // Очищаем таймер при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const usePromoCode = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/promocodes/use", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        console.error("Ошибка использования промокода:", errorData.error);
        return false;
      }
    } catch (err) {
      console.error("Ошибка сети при использовании промокода:", err);
      return false;
    }
  };

  return {
    promoCode,
    loading,
    error,
    checkPromoCode,
    clearPromoCode,
    usePromoCode,
  };
};
