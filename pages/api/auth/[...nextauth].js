import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { compareHashedPassword } from "../../../lib/auth";

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60,
    updateAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const prismaClient = new PrismaClient();

        const user = await prismaClient.user.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          throw new Error("Email not Found.");
        }

        if (user) {
          if (user.status === 0) {
            throw new Error(
              "Your Account is Under Review Please Try Again After Some Time."
            );
          }
        }

        const isValid = await compareHashedPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid Password!");
        }
        prismaClient.$disconnect();
        if (user) {
          delete user.password;

          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send below to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      user && (token.user = user);

      return Promise.resolve(token); // ...here
    },
    session: async (session, user, sessionToken) => {
      //  "session" is current session object
      //  below we set "user" param of "session" to value received from "jwt" callback
      session.user = user.user;
      return Promise.resolve(session);
    },
  },
});
