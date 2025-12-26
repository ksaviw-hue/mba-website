/**
 * Global League Configuration
 * 
 * Update these values at the start of each new season to automatically
 * update season numbers across the entire website.
 */

export const LEAGUE_CONFIG = {
  // Current Season
  CURRENT_SEASON: 1,
  
  // Season Display Name (used in dropdowns and displays)
  CURRENT_SEASON_NAME: 'Season 1',
  
  // Available Seasons (for stats filtering)
  AVAILABLE_SEASONS: ['Season 1', 'All-Time'],
  
  // League Info
  LEAGUE_NAME: 'Elite Basketball Association',
  LEAGUE_SHORT_NAME: 'EBA',
  
  // Season Dates (optional)
  SEASON_START_DATE: '2024-12-01',
  SEASON_END_DATE: '2025-06-30',
} as const;

/**
 * Helper function to get season display text
 */
export function getSeasonDisplay(seasonNumber: number): string {
  return `Season ${seasonNumber}`;
}

/**
 * Helper function to check if a season is current
 */
export function isCurrentSeason(seasonNumber: number): boolean {
  return seasonNumber === LEAGUE_CONFIG.CURRENT_SEASON;
}
