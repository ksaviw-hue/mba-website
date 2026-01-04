import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { supabaseAdmin } from "./supabaseAdmin";

// List of Discord user IDs that have admin access
const ADMIN_DISCORD_IDS = (process.env.ADMIN_DISCORD_IDS || "")
  .split(",")
  .map(id => id.trim())
  .filter(Boolean);

// Debug: Log environment variables (remove this after debugging)
console.log("Discord Client ID:", process.env.DISCORD_CLIENT_ID);
console.log("Admin IDs:", ADMIN_DISCORD_IDS);
console.log("Raw Admin IDs env:", process.env.ADMIN_DISCORD_IDS);

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    {
      id: "roblox",
      name: "Roblox",
      type: "oauth",
      clientId: process.env.ROBLOX_CLIENT_ID || "",
      clientSecret: process.env.ROBLOX_CLIENT_SECRET || "",
      authorization: {
        url: "https://apis.roblox.com/oauth/v1/authorize",
        params: {
          scope: "openid profile",
        },
      },
      token: "https://apis.roblox.com/oauth/v1/token",
      userinfo: "https://apis.roblox.com/oauth/v1/userinfo",
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.preferred_username || profile.name,
          email: null,
          image: profile.picture,
        };
      },
    },
  ],
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Discord admin authentication
      if (account?.provider === "discord") {
        const discordId = account.providerAccountId;
        console.log("Attempting sign in with Discord ID:", discordId);
        console.log("Is admin?", ADMIN_DISCORD_IDS.includes(discordId));
        return ADMIN_DISCORD_IDS.includes(discordId);
      }
      
      // Roblox player authentication
      if (account?.provider === "roblox" && profile) {
        const robloxUsername = (profile as any).preferred_username || (profile as any).name;
        const robloxId = (profile as any).sub;
        const robloxAvatar = (profile as any).picture;

        try {
          // Check if player exists with this Roblox username
          const { data: existingPlayer } = await supabaseAdmin
            .from("players")
            .select("id, user_id")
            .eq("roblox_username", robloxUsername)
            .single();

          if (existingPlayer) {
            // Link user to existing player if not already linked
            if (!existingPlayer.user_id) {
              await supabaseAdmin
                .from("players")
                .update({
                  user_id: user.id,
                  roblox_user_id: robloxId,
                  profile_picture: robloxAvatar,
                })
                .eq("id", existingPlayer.id);
            }
          } else {
            // Create new player as Free Agent
            await supabaseAdmin.from("players").insert({
              name: robloxUsername,
              roblox_username: robloxUsername,
              roblox_user_id: robloxId,
              user_id: user.id,
              team_id: null, // Free Agent - not on a team
              position: "Free Agent",
              jersey_number: null,
              height: "",
              weight: "",
              year: "",
              hometown: "",
              high_school: "",
              bio: "",
              profile_picture: robloxAvatar,
            });
          }
          return true;
        } catch (error) {
          console.error("Error in Roblox signIn callback:", error);
          return false;
        }
      }
      
      return false;
    },
    async session({ session, token }) {
      // Add Discord ID to session for admins
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.discordId) {
        session.user.discordId = token.discordId as string;
        session.user.isAdmin = true;
      }
      
      // Add player data to session for Roblox users
      if (token.playerId) {
        session.user.playerId = token.playerId as string;
        session.user.teamId = token.teamId as string | null;
        session.user.playerName = token.playerName as string;
        session.user.profilePicture = token.profilePicture as string;
      }
      
      return session;
    },
    async jwt({ token, account, user }) {
      // Store Discord ID in token
      if (account?.provider === "discord") {
        token.discordId = account.providerAccountId;
      }
      
      // Store player data in token for Roblox users
      if (account?.provider === "roblox" && user) {
        try {
          const { data: player } = await supabaseAdmin
            .from("players")
            .select("id, name, team_id, profile_picture")
            .eq("user_id", user.id)
            .single();

          if (player) {
            token.playerId = player.id;
            token.teamId = player.team_id;
            token.playerName = player.name;
            token.profilePicture = player.profile_picture;
          }
        } catch (error) {
          console.error("Error fetching player data:", error);
        }
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
