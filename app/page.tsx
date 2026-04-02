import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
   const session = await auth();
   console.log(session);

   const userImage = session?.user?.id
      ? await prisma.user.findUnique({
           where: { id: session.user.id },
           select: { image: true },
        })
      : null;
   return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
         <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8 sm:py-5">
            <div className="flex items-center gap-2">
               <span className="text-2xl">💰</span>
               <span className="text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">CoinCheck</span>
            </div>
            {!session?.user ? (
               <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:gap-3">
                  <Link
                     href="/login"
                     className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                     Sign In
                  </Link>
                  <Link
                     href="/register"
                     className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
                  >
                     Get Started
                  </Link>
               </div>
            ) : (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Avatar className="cursor-pointer">
                        <AvatarImage src={userImage?.image || ""} alt="@shadcn" className="grayscale" />
                        <AvatarFallback>Acc</AvatarFallback>
                     </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuGroup>
                        <Link href={"/dashboard"}>
                           <DropdownMenuItem>Dashboard</DropdownMenuItem>
                        </Link>
                     </DropdownMenuGroup>
                     <DropdownMenuSeparator />
                     <form action={logoutUser}>
                        <Button
                           type="submit"
                           variant="outline"
                           className="w-full border-input bg-background text-foreground hover:bg-accent"
                        >
                           {" "}
                           <DropdownMenuItem>Logout</DropdownMenuItem>
                        </Button>
                     </form>
                  </DropdownMenuContent>
               </DropdownMenu>
            )}
         </header>

         <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-14 text-center sm:gap-8 sm:px-6 sm:py-24">
            <span className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
               Your personal finance companion
            </span>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
               Take control of your <span className="text-green-500">finances</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
               Track transactions, manage budgets, and visualize your spending habits — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
               <Link
                  href="/register"
                  className="px-8 py-3 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity text-base"
               >
                  Start for free →
               </Link>
               <Link
                  href="/login"
                  className="px-8 py-3 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-base"
               >
                  Sign In
               </Link>
            </div>
         </main>

         <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 pb-16 sm:grid-cols-3 sm:px-8 sm:pb-24">
            {[
               {
                  icon: "📊",
                  title: "Analytics",
                  desc: "Visualize your income and expenses with clear charts.",
               },
               {
                  icon: "💳",
                  title: "Transactions",
                  desc: "Log and categorize every transaction effortlessly.",
               },
               {
                  icon: "🎯",
                  title: "Budgets",
                  desc: "Set monthly budgets and track your progress in real time.",
               },
            ].map((feature) => (
               <div
                  key={feature.title}
                  className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
               >
                  <span className="text-3xl">{feature.icon}</span>
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">{feature.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
               </div>
            ))}
         </section>

         <footer className="text-center py-6 text-sm text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
            © {new Date().getFullYear()} CoinCheck. Built with Next.js & Tailwind CSS.
         </footer>
      </div>
   );
}
