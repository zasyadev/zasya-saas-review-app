import prisma from "../../../lib/prisma";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { compareHashedPassword } from "../../../lib/auth";

export default NextAuth({
  session: {
    strategy: "jwt",
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Providers.Credentials({
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
    jwt: async (token, user, account, profile, isNewUser) => {
      user && (token.user = user);

      return Promise.resolve(token);
    },
    session: async (session, user, sessionToken) => {
      session.user = user.user;
      session.user.temp = 1;

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

      return Promise.resolve(session);
    },
  },
});
