import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // console.log("auth.ts:", credentials);
        try {
          const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL; // Define in .env file
          const response = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data?.message || "Invalid credentials.");
          }

          // Ensure API returns user data
          if (!data || !data.user) {
            throw new Error("Invalid response from server.");
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            token: data.token, // Store token for future API calls
          };
        } catch (error) {
          throw new Error(error.message || "Authentication failed.");
        }
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.name = user.name;
  //       token.email = user.email;
  //       token.accessToken = user.token; // Store token
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token) {
  //       session.user.id = token.id;
  //       session.user.name = token.name;
  //       session.user.email = token.email;
  //       session.user.token = token.accessToken;
  //     }
  //     return session;
  //   },
  // },
  // pages: {
  //   signIn: "/login", // Optional: Custom login page
  // },
  // secret: process.env.NEXTAUTH_SECRET, // Store in .env
});
