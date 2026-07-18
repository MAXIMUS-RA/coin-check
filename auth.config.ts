import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe config shared by middleware and the full auth instance.
// Must NOT import Prisma, bcrypt, or any Node-only module — middleware runs on the Edge runtime.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({
      // Links a Google login to an existing account with the same email
      // (e.g. one created via Credentials). Safe here because Google verifies emails.
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    // Runs in middleware for every matched request. Protects the dashboard.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) return isLoggedIn; // redirect unauthenticated users to signIn page
      return true;
    },
  },
} satisfies NextAuthConfig;
