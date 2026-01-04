'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Users, Link2, TrendingUp, Calendar, Search, Shield, Sun, Moon, Trophy, Briefcase, Award, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useSession, signIn } from 'next-auth/react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/branding', label: 'Branding', icon: Users },
  { href: '/links', label: 'Links', icon: Link2 },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/rankings', label: 'Rankings', icon: Award },
  { href: '/stats', label: 'Stats', icon: TrendingUp },
  { href: '/games', label: 'Games', icon: Calendar },
  { href: '/players', label: 'Players', icon: Search },
  { href: '/staff', label: 'Staff', icon: Briefcase },
  { href: '/admin', label: 'Admin', icon: Shield },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white dark:bg-eba-dark border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="EBA Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">Elite Basketball Association</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-1 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-eba-blue text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Profile Button */}
            {status === "authenticated" && session?.user?.playerId ? (
              <Link
                href={`/players/${session.user.playerId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-eba-blue text-white hover:bg-blue-700 transition-colors shadow-sm ml-2"
              >
                {session.user.image || session.user.profilePicture ? (
                  <Image
                    src={session.user.image || session.user.profilePicture || ''}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="whitespace-nowrap">Profile</span>
              </Link>
            ) : (
              <button
                onClick={() => signIn("roblox", { callbackUrl: '/' })}
                disabled={status === "loading"}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-eba-blue text-white hover:bg-blue-700 transition-colors shadow-sm ml-2 disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                <span className="whitespace-nowrap">Log In</span>
              </button>
            )}
            
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
