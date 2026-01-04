import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // Discord admin fields
      discordId?: string;
      isAdmin?: boolean;
      // Roblox player fields
      playerId?: string;
      teamId?: string | null;
      playerName?: string;
      profilePicture?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    discordId?: string;
    playerId?: string;
    teamId?: string | null;
    playerName?: string;
    profilePicture?: string;
  }
}
