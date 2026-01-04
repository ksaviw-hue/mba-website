"use client";

import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";

interface EditProfileProps {
  player: any;
  isOwnProfile: boolean;
  onSave: (updates: any) => Promise<void>;
}

export default function EditProfile({ player, isOwnProfile, onSave }: EditProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bio: player.bio || "",
    hometown: player.hometown || "",
    high_school: player.highSchool || "",
    profile_picture: player.profilePicture || "",
  });

  if (!isOwnProfile) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: player.bio || "",
      hometown: player.hometown || "",
      high_school: player.highSchool || "",
      profile_picture: player.profilePicture || "",
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-2 bg-eba-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
        <span>Edit Profile</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save"}</span>
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-eba-blue text-gray-900 dark:text-white"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Hometown
          </label>
          <input
            type="text"
            value={formData.hometown}
            onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-eba-blue text-gray-900 dark:text-white"
            placeholder="Your hometown"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            High School
          </label>
          <input
            type="text"
            value={formData.high_school}
            onChange={(e) => setFormData({ ...formData, high_school: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-eba-blue text-gray-900 dark:text-white"
            placeholder="Your high school"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Profile Picture URL
          </label>
          <input
            type="url"
            value={formData.profile_picture}
            onChange={(e) => setFormData({ ...formData, profile_picture: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-eba-blue text-gray-900 dark:text-white"
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
}
