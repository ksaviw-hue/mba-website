'use client';

import { Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, gamesRes, teamsRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/games'),
        fetch('/api/teams')
      ]);
      const [articlesData, gamesData, teamsData] = await Promise.all([
        articlesRes.json(),
        gamesRes.json(),
        teamsRes.json()
      ]);
      setArticles(articlesData);
      setGames(gamesData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingGames = games
    .filter(g => g.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  const latestArticles = articles
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - News and Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Elite Basketball Association</h1>
            <p className="text-gray-600 dark:text-gray-400">Your home for the most competitive Roblox basketball experience</p>
          </div>

          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest News</h2>
              <Link href="/news" className="text-eba-blue hover:text-blue-600 flex items-center text-sm">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {latestArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-eba-blue dark:hover:border-eba-blue transition-colors shadow-sm"
                >
                  {article.image && (
                    <div className="w-full h-48 relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {new Date(article.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} • By {article.author}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{article.excerpt || article.content.slice(0, 150)}...</p>
                    <Link
                      href={`/news/${article.id}`}
                      className="inline-block mt-4 text-eba-blue hover:text-blue-600 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Upcoming Games */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <Calendar className="w-6 h-6 mr-2 text-eba-blue" />
              Upcoming Games
            </h2>
            
            <div className="space-y-3">
              {upcomingGames.length > 0 ? (
                upcomingGames.map((game) => {
                  const homeTeam = teams.find(t => t.id === game.homeTeamId);
                  const awayTeam = teams.find(t => t.id === game.awayTeamId);
                  
                  return (
                    <Link
                      key={game.id}
                      href={`/games/${game.id}`}
                      className="block bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-eba-blue dark:hover:border-eba-blue transition-colors shadow-sm"
                    >
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {new Date(game.scheduledDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{awayTeam?.name || 'TBD'}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm">@ {homeTeam?.name || 'TBD'}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 shadow-sm">
                  No upcoming games scheduled
                </div>
              )}
              
              <Link
                href="/games"
                className="block text-center py-3 px-4 bg-eba-blue hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                View Full Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
