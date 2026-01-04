"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { MessageSquarePlus, CheckCircle2 } from "lucide-react";

interface DiscordLinkButtonProps {
  player: any;
  isOwnProfile: boolean;
}

export default function DiscordLinkButton({ player, isOwnProfile }: DiscordLinkButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (!isOwnProfile) return null;

  const hasDiscord = !!player.discordUsername;

  const handleLinkDiscord = () => {
    setLoading(true);
    // Trigger Discord OAuth
    // After linking, the discord username will be saved to the player profile
    signIn("discord", { 
      callbackUrl: `/players/${player.id}?discordLinked=true` 
    });
  };

  if (hasDiscord) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
        <div>
          <p className="text-sm font-medium text-green-900 dark:text-green-200">
            Discord Connected
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            {player.discordUsername}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleLinkDiscord}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors disabled:opacity-50"
    >
      <MessageSquarePlus className="w-5 h-5" />
      <span>{loading ? "Connecting..." : "Connect Discord"}</span>
    </button>
  );
}
