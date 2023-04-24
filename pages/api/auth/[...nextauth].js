import prisma from "../../../lib/prisma";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareHashedPassword } from "../../../lib/auth";

export const authOptions = {
  session: {
    strategy: "jwt",
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Email not Found.");
        }

        if (user.status === 0) {
          throw new Error(
            "You need to reset your password. Link has been sent to your mail."
          );
        }

        const isValid = await compareHashedPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid Password!");
        }

        delete user.password;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          include: {
            UserOraganizationGroups: {
              include: {
                organization: true,
              },
            },
            organization: true,
            role: true,
            UserDetails: true,
          },
        });
        if (session.user) delete session.user.password;
      }

      return Promise.resolve(session);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
