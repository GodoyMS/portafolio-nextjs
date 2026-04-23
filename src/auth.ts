import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase().trim();
        const password = parsed.data.password;

        try {
          const { prisma } = await import("@/lib/prisma");
          const dbUser = await prisma.adminUser.findUnique({ where: { email } });
          if (dbUser) {
            const ok = await bcrypt.compare(password, dbUser.passwordHash);
            if (!ok) return null;
            return { id: dbUser.id, email: dbUser.email, name: "Admin" };
          }
        } catch {
          return null;
        }

        /* Legacy: single admin from env (optional fallback if no DB row) */
        const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const envHash = process.env.ADMIN_PASSWORD_HASH;
        if (envEmail && envHash && email === envEmail) {
          const ok = await bcrypt.compare(password, envHash);
          if (!ok) return null;
          return { id: "env-admin", email: process.env.ADMIN_EMAIL!, name: "Admin" };
        }

        return null;
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        if (token.sub) {
          (session.user as { id?: string }).id = token.sub;
        }
      }
      return session;
    },
  },
});
