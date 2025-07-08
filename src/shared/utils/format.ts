/**
 * Форматирует цену в рублях с пробелами между разрядами
 * Работает одинаково на сервере и клиенте
 */
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Форматирует число с пробелами между разрядами
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
