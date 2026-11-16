export function formatPrice(amount: number, currency: "EUR" | "USD" | "GBP" | "NGN" = "EUR") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol", // "₦45,000,000" rather than "NGN 45,000,000"
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(sqm: number) {
  return `${sqm.toLocaleString("en-GB")} m²`;
}

export function formatCoords(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns}  ${Math.abs(lng).toFixed(2)}° ${ew}`;
}

export function pageNumber(n: number, of: number) {
  return `p. ${String(n).padStart(2, "0")} / ${String(of).padStart(2, "0")}`;
}

export function romanNumeral(n: number) {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
}

// Short price for tight spaces like map pins: 24,500,000 EUR -> "€24.5M".
// Done by hand on purpose: Intl's "compact" notation differs between Node
// and browsers ("M" vs "m"), which breaks React hydration.
export function formatPriceShort(amount: number, currency: "EUR" | "USD" | "GBP" | "NGN" = "EUR") {
  const symbol = formatPrice(0, currency).replace(/[\d.,\s]/g, ""); // "€", "US$", "₦"
  const units: [number, string][] = [[1e9, "B"], [1e6, "M"], [1e3, "K"]];
  for (const [size, suffix] of units) {
    if (Math.abs(amount) >= size) {
      const n = Math.round((amount / size) * 10) / 10; // one decimal
      return `${symbol}${n}${suffix}`;
    }
  }
  return `${symbol}${Math.round(amount)}`;
}
