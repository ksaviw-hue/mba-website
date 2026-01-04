"use client";

import { useState } from "react";
import { CheckCircle2, Edit2 } from "lucide-react";

interface DiscordLinkButtonProps {
  player: any;
  isOwnProfile: boolean;
  onUpdate: (discordUsername: string) => void;
}

export default function DiscordLinkButton({ player, isOwnProfile, onUpdate }: DiscordLinkButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [discordUsername, setDiscordUsername] = useState(player.discordUsername || "");
  const [saving, setSaving] = useState(false);

  if (!isOwnProfile) return null;

  const handleSave = async () => {
    if (!discordUsername.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/players/${player.id}/discord`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordUsername: discordUsername.trim() }),
      });

      if (res.ok) {
        onUpdate(discordUsername.trim());
        setIsEditing(false);
      } else {
        alert("Failed to update Discord username");
      }
    } catch (error) {
      console.error("Error updating Discord:", error);
      alert("Failed to update Discord username");
    } finally {
      setSaving(false);
    }
  };

  const hasDiscord = !!player.discordUsername;

  if (hasDiscord && !isEditing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex-1">
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
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (isEditing || !hasDiscord) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Discord Username
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.target.value)}
            placeholder="username#1234 or @username"
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#5865F2] text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSave}
            disabled={saving || !discordUsername.trim()}
            className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setDiscordUsername(player.discordUsername || "");
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter your Discord username (e.g., username#1234 or @username)
        </p>
      </div>
    );
  }

  return null;
}
