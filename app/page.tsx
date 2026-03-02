import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            CoinCheck
          </span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <span className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
          Your personal finance companion
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white max-w-2xl leading-tight">
          Take control of your <span className="text-green-500">finances</span>
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
          Track transactions, manage budgets, and visualize your spending habits
          — all in one place.
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

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 pb-24 max-w-5xl mx-auto w-full">
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
            <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">
              {feature.title}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      <footer className="text-center py-6 text-sm text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
        © {new Date().getFullYear()} CoinCheck. Built with Next.js & Tailwind
        CSS.
      </footer>
    </div>
  );
}
