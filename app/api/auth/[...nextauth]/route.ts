import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface CustomUser extends DefaultUser {
  accessToken: string;
  refreshToken: string;
}

interface CustomSession extends DefaultSession {
  user: CustomUser;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const { access_token, refresh_token } = response.data;

          const userResponse = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          const user = userResponse.data;

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.avatar,
            accessToken: access_token,
            refreshToken: refresh_token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as CustomUser).accessToken;
        token.refreshToken = (user as CustomUser).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as CustomUser).accessToken = token.accessToken as string;
        (session.user as CustomUser).refreshToken =
          token.refreshToken as string;
      }
      return session as CustomSession;
    },
  },
});

export { handler as GET, handler as POST };
