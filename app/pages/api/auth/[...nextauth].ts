//@ts-nocheck
import { db } from "@/db";
import { users } from "@/db/schema";

import { and, eq } from "drizzle-orm";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            // you can query the database here to get more user information such as name,etc...
            const existingUser = await db.query.users.findFirst({
              where: and(
                eq(users.chainId, siwe?.chainId),
                eq(users.address, siwe.address)
              ),
            });
            if (existingUser) {
              return {
                id: existingUser.address,
                chainId: existingUser.chainId,
                avatarUrl: existingUser?.avatarUrl,
                userId: existingUser.id,
                fullName: existingUser?.fullName,
                role: existingUser?.role,
              };
            }
            return {
              id: siwe.address,
              chainId: siwe.chainId,
              fullName: "",
              userId: null,
              role: "user",
              avatarUrl: "https://avatar.iran.liara.run/public",
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        // console.log(
        //   { user, account, profile, email, credentials },
        //   "from signin"
        // );
        // check if the user already exists, if not create it
        if (user) {
          const existingUser = await db.query.users.findFirst({
            where: and(
              eq(users.chainId, user?.chainId),
              eq(users.address, user?.id)
            ),
          });
          if (!existingUser) {
            await db.insert(users).values({
              address: user?.id,
              chainId: user?.chainId,
            });
          }
          return true;
        }
        return true;
      },
      async session({ session, token }: { session: any; token: any }) {
        // console.log({ token, session }, "from session");

        session.address = token.sub;
        session.chainId = token?.chainId;
        session.user.address = token.sub;
        session.user.id = token?.userId;
        session.user.fullName = token?.fullName;
        session.user.role = token?.role || "user";
        session.user.avatarUrl = token?.avatarUrl;
        // console.log({ session, token }, "after update");

        return session;
      },
      async jwt({ user, token }) {
        token.chainId = user?.chainId;
        token.userId = user?.userId;
        token.avatarUrl = user?.avatarUrl;
        token.fullName = user?.fullName;
        token.role = user?.role;
        // console.log({ user, token }, "from jwt");
        return token;
      },
    },
  });
}
