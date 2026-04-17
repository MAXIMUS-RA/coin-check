// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
//    const session = await auth();

//    if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//    }

   const categories = await prisma.category.findMany({
      include: {
         _count: {
            select: { transactions: true },
         },
      },
   });
   return NextResponse.json(categories, { status: 200 });
}