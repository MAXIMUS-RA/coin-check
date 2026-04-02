import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6">
      {children}
    </div>
  );
}
