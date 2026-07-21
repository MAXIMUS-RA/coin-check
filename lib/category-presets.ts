/**
 * Common category suggestions offered when creating a category.
 * Split by transaction type — income and expense categories differ.
 * Each preset carries a default emoji, which pre-fills the icon field.
 */

export type CategoryPreset = { name: string; icon: string };

export const EXPENSE_PRESETS: CategoryPreset[] = [
   { name: "Groceries", icon: "🛒" },
   { name: "Rent", icon: "🏠" },
   { name: "Utilities", icon: "💡" },
   { name: "Transport", icon: "🚌" },
   { name: "Fuel", icon: "⛽" },
   { name: "Dining Out", icon: "🍽️" },
   { name: "Health", icon: "💊" },
   { name: "Education", icon: "📚" },
   { name: "Clothing", icon: "👕" },
   { name: "Entertainment", icon: "🎬" },
   { name: "Subscriptions", icon: "📺" },
   { name: "Internet & Mobile", icon: "📱" },
   { name: "Sports", icon: "🏋️" },
   { name: "Travel", icon: "✈️" },
   { name: "Gifts", icon: "🎁" },
   { name: "Pets", icon: "🐾" },
];

export const INCOME_PRESETS: CategoryPreset[] = [
   { name: "Salary", icon: "💼" },
   { name: "Freelance", icon: "💻" },
   { name: "Bonus", icon: "🎉" },
   { name: "Investments", icon: "📈" },
   { name: "Rental Income", icon: "🏘️" },
   { name: "Savings Interest", icon: "🏦" },
   { name: "Refund", icon: "↩️" },
   { name: "Gift Received", icon: "🎁" },
];

/** Sentinel value for the "write my own name" option in the preset dropdown. */
export const CUSTOM_CATEGORY = "__custom__";

export function presetsForType(type: string): CategoryPreset[] {
   return type === "INCOME" ? INCOME_PRESETS : EXPENSE_PRESETS;
}
