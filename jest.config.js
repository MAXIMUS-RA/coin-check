const nextJest = require("next/jest");

const createJestConfig = nextJest({
   dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
   testEnvironment: "jsdom",
   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
   moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1",
   },
   collectCoverageFrom: [
      "lib/utils.ts",
      "lib/zod-schemas.ts",
      "lib/actions/transaction-actions.ts",
      "components/ui/dashboard/FinancialAccountRow.tsx",
      "types/dashboard/**/*.ts",
      "!**/*.d.ts",
   ],
   coverageThreshold: {
      global: {
         branches: 40,
         functions: 40,
         lines: 40,
         statements: 40,
      },
   },
};

module.exports = createJestConfig(customJestConfig);
