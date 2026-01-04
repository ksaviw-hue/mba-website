/**
 * Global League Configuration
 * 
 * Seasons are now managed dynamically through the admin panel.
 * Use the helper functions below to fetch season data.
 */

export const LEAGUE_CONFIG = {
  // League Info
  LEAGUE_NAME: 'Minecraft Basketball Association',
  LEAGUE_SHORT_NAME: 'MBA',
} as const;

/**
 * Fetch all available seasons from the database
 */
export async function getAvailableSeasons(): Promise<string[]> {
  try {
    const res = await fetch('/api/seasons', { cache: 'no-store' });
    if (!res.ok) return ['All-Time']; // Fallback
    
    const seasons = await res.json();
    const seasonNames = seasons.map((s: any) => s.name);
    
    // Always include All-Time at the end
    if (!seasonNames.includes('All-Time')) {
      seasonNames.push('All-Time');
    }
    
    return seasonNames;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return ['All-Time']; // Fallback
  }
}

/**
 * Fetch the current season name from the database
 */
export async function getCurrentSeasonName(): Promise<string> {
  try {
    const res = await fetch('/api/seasons', { cache: 'no-store' });
    if (!res.ok) return 'All-Time'; // Fallback
    
    const seasons = await res.json();
    const currentSeason = seasons.find((s: any) => s.isCurrent);
    
    return currentSeason?.name || 'All-Time';
  } catch (error) {
    console.error('Error fetching current season:', error);
    return 'All-Time'; // Fallback
  }
}

/**
 * Helper function to get season display text
 */
export function getSeasonDisplay(seasonName: string): string {
  return seasonName;
}

/**
 * Helper function to convert season name to value for storage
 */
export function getSeasonValue(seasonName: string): string {
  return seasonName;
}

/**
 * Helper function to check if a season is current
 */
export async function isCurrentSeason(seasonName: string): Promise<boolean> {
  const current = await getCurrentSeasonName();
  return seasonName === current;
}


