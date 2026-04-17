// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
   // Закоментовано для лабораторної
   // const session = await auth();
   // if (!session?.user?.id) {
   //    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   // }

   try {
      const transactions = await prisma.transaction.findMany({
         orderBy: {
            date: "desc",
         },
         take: 50,
         include: {
            category: {
               select: {
                  name: true,
                  icon: true,
               },
            },
         },
      });

      return NextResponse.json(transactions, { status: 200 });
   } catch (error) {
      return NextResponse.json({ error: "Failed to fetch transactions " + error }, { status: 500 });
   }
}
