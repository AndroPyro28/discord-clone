import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProviders from "next-auth/providers/github";
import GoogleProviders from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";
import { compare } from "@/utils/bcrypt";
import type { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GithubProviders({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProviders({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<User> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Credentials");
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid Credentials");
        }

        return user;
      },
    }),
  ],

  // for nestjs
  callbacks: {
    // redirect({baseUrl, url}) {
    //   console.log('redirect', baseUrl, url)
    //   return url
    // },
    async jwt({user, token, account}) {
      // JWT INTERFACE
      // console.log(`🚀 jwt callback 🚀 ${spread}`)
      if(user || token) {
        const spread = {...token, ...user}
        return spread
      }

      return token;

      
    },
  //   // will run every time getServerSession and use session use
    async session({token, session,user }) {
      session.user.accessToken = token.access_token as string;
      session.user.id = token.id as string;
      
      return session;
    },
  },
  
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}