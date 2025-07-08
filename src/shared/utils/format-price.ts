export function formatPrice(price: number): string {
  // Форматируем цену консистентно для сервера и клиента
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
