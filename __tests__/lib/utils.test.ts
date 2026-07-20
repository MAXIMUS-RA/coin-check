import { cn } from "@/lib/utils";

describe("cn", () => {
   it("merges class names", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1");
   });

   it("resolves conflicting Tailwind classes", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
   });

   it("handles conditional values", () => {
      const enabled = true;
      expect(cn("base", enabled && "active", !enabled && "hidden")).toBe("base active");
   });
});
