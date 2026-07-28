const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatUsdPrice = (price: string | number): string => {
  const rawPrice = String(price).trim();
  const numericPrice = rawPrice.replace(/[^0-9.-]/g, "");
  const amount = Number(numericPrice);

  if (numericPrice && Number.isFinite(amount)) {
    return usdFormatter.format(amount);
  }

  const label = rawPrice.replace(/^\$+\s*/, "");
  return label ? `$${label}` : "Contact for pricing";
};
