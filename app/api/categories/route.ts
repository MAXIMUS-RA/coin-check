// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
   const session = await auth();
   if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   try {
      const categories = await prisma.category.findMany({
         where: { userId: session.user.id },
         include: {
            _count: {
               select: { transactions: true },
            },
         },
      });
      return NextResponse.json(categories, { status: 200 });
   } catch (error) {
      return NextResponse.json({ error: "Failed to fetch categories " + error }, { status: 500 });
   }
}
