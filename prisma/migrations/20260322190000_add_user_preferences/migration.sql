-- Add personal profile and dashboard preference fields
ALTER TABLE "User"
ADD COLUMN "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN "dashboardPeriod" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN "themePreference" TEXT NOT NULL DEFAULT 'dark',
ADD COLUMN "hiddenWidgets" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
