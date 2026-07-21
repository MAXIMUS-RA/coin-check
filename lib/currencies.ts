/**
 * Currencies commonly used in Ukraine — the national currency first,
 * then the main reserve/savings currencies, then neighbouring and
 * frequently-encountered European ones.
 *
 * Codes are ISO 4217 (always 3 letters), which matches the `length(3)`
 * rule in FinancialAccountSchema / UserProfileSchema.
 */
export const CURRENCIES = [
   { code: "UAH", label: "Ukrainian hryvnia", symbol: "₴" },
   { code: "USD", label: "US dollar", symbol: "$" },
   { code: "EUR", label: "Euro", symbol: "€" },
   { code: "PLN", label: "Polish złoty", symbol: "zł" },
   { code: "GBP", label: "Pound sterling", symbol: "£" },
   { code: "CHF", label: "Swiss franc", symbol: "CHF" },
   { code: "CZK", label: "Czech koruna", symbol: "Kč" },
   { code: "HUF", label: "Hungarian forint", symbol: "Ft" },
   { code: "RON", label: "Romanian leu", symbol: "lei" },
   { code: "MDL", label: "Moldovan leu", symbol: "L" },
   { code: "TRY", label: "Turkish lira", symbol: "₺" },
   { code: "CAD", label: "Canadian dollar", symbol: "C$" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const DEFAULT_CURRENCY: CurrencyCode = "UAH";

/** Formats a currency for display in a dropdown, e.g. "UAH — Ukrainian hryvnia (₴)". */
export function currencyOptionLabel(currency: (typeof CURRENCIES)[number]) {
   return `${currency.code} — ${currency.label} (${currency.symbol})`;
}
