'use client';

import React, { useEffect, useState } from 'react';
import { Users, Shield, Video, Palette, Briefcase } from 'lucide-react';

interface StaffMember {
  id: string;
  player_id: string;
  role: string;
  created_at: string;
}

interface Player {
  id: string;
  name: string;
  robloxId: number;
}

const ROLE_CATEGORIES = {
  'Commissioners & Executives': [
    'Commissioner',
    'Executive',
    'Director',
    'Chief Operating Officer'
  ],
  'Game Hosts & Streamers': [
    'Game Host',
    'Streamer',
    'Game Official'
  ],
  'GFX Designers & Asset Designers': [
    'Asset Designer',
    'GFX Designer'
  ],
  'League Staff': [
    'League Staff',
    'League Op. Coordinator',
    'Analytics Dept. Lead'
  ]
};

const CATEGORY_ICONS: { [key: string]: any } = {
  'Commissioners & Executives': Shield,
  'Game Hosts & Streamers': Video,
  'GFX Designers & Asset Designers': Palette,
  'League Staff': Briefcase
};

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffRes, playersRes] = await Promise.all([
        fetch('/api/staff'),
        fetch('/api/players')
      ]);

      const staffData = await staffRes.json();
      const playersData = await playersRes.json();

      setStaff(staffData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerById = (playerId: string) => {
    return players.find(p => p.id === playerId);
  };

  const getStaffByRole = (role: string) => {
    return staff.filter(s => s.role === role);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading staff...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">League Staff</h1>
          </div>
          <p className="text-xl text-gray-300">Meet the team behind the Elite Basketball Association</p>
        </div>

        {/* Staff Categories */}
        <div className="space-y-8">
          {Object.entries(ROLE_CATEGORIES).map(([category, roles]) => {
            const Icon = CATEGORY_ICONS[category];
            const categoryStaff = roles.flatMap(role => getStaffByRole(role));
            
            if (categoryStaff.length === 0) return null;

            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                {/* Category Header */}
                <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <Icon className="w-8 h-8 text-blue-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category}</h2>
                </div>

                {/* Roles in Category */}
                {roles.map(role => {
                  const roleStaff = getStaffByRole(role);
                  if (roleStaff.length === 0) return null;

                  return (
                    <div key={role} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        {role}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {roleStaff.map(member => {
                          const player = getPlayerById(member.player_id);
                          if (!player) return null;

                          return (
                            <div
                              key={member.id}
                              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              <img
                                src={`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${player.robloxId}&size=60x60&format=Png&isCircular=true`}
                                alt={player.name}
                                className="w-12 h-12 rounded-full border-2 border-blue-500"
                                onError={(e) => {
                                  e.currentTarget.src = '/default-avatar.png';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {player.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {staff.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No staff members added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
