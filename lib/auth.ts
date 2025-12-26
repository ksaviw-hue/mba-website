import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// List of Discord user IDs that have admin access
const ADMIN_DISCORD_IDS = (process.env.ADMIN_DISCORD_IDS || "").split(",").filter(Boolean);

// Debug: Log environment variables (remove this after debugging)
console.log("Discord Client ID:", process.env.DISCORD_CLIENT_ID);
console.log("Admin IDs:", ADMIN_DISCORD_IDS);

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow sign in if the user's Discord ID is in the admin list
      if (account?.provider === "discord") {
        const discordId = account.providerAccountId;
        return ADMIN_DISCORD_IDS.includes(discordId);
      }
      return false;
    },
    async session({ session, token }) {
      // Add Discord ID to session
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.discordId) {
        session.user.discordId = token.discordId as string;
      }
      return session;
    },
    async jwt({ token, account }) {
      // Store Discord ID in token
      if (account?.provider === "discord") {
        token.discordId = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: '/admin', // Redirect to admin page for sign in
    error: '/admin',   // Redirect to admin page on error
  },
};

// Helper function to check if a Discord ID has admin access
export function isAdminDiscordId(discordId: string): boolean {
  return ADMIN_DISCORD_IDS.includes(discordId);
}
