/**
 * Guard rails for account balances.
 *
 * Negative balances are a legitimate state for most account types
 * (a CREDIT card balance of -500 means you owe 500, and BANK accounts
 * can genuinely be overdrawn), so we do not blanket-block them.
 *
 * CASH is the exception: you cannot spend physical cash you do not have,
 * so a negative projected balance there is always a data-entry error.
 */

export type GuardAccountType = "BANK" | "CREDIT" | "CASH" | "INVESTMENT";

export type BalanceGuardResult =
   | { status: "ok" }
   /** Never allowed — the action must be rejected. */
   | { status: "forbidden"; message: string }
   /** Allowed, but the user should confirm they meant it. */
   | { status: "confirm"; message: string };

function formatAmount(value: number, currency: string) {
   return `${value.toFixed(2)} ${currency}`;
}


export function checkProjectedBalance(
   accountType: GuardAccountType,
   projectedBalance: number,
   accountName: string,
   currency: string,
): BalanceGuardResult {
   if (projectedBalance >= 0) return { status: "ok" };

   if (accountType === "CASH") {
      return {
         status: "forbidden",
         message: `Cash accounts cannot go below zero. "${accountName}" would drop to ${formatAmount(
            projectedBalance,
            currency,
         )}.`,
      };
   }

   return {
      status: "confirm",
      message: `This will overdraw "${accountName}" to ${formatAmount(projectedBalance, currency)}.`,
   };
}
