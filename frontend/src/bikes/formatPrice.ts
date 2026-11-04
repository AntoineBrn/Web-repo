export const formatPrice = (priceCents: number) =>
  (priceCents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });