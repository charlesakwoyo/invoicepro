import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mock user - in a real app, you would check against a database
        const mockUser = {
          id: "1",
          name: "Charles Akwoyo",
          email: "charles@gmail.com",
          password: "password123" // In a real app, never store passwords in plain text
        };

        if (credentials?.email === mockUser.email && credentials?.password === mockUser.password) {
          return { id: mockUser.id, name: mockUser.name, email: mockUser.email };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
