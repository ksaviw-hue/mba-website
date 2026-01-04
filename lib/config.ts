/**
 * Global League Configuration
 * 
 * Update these values at the start of each new season to automatically
 * update season numbers across the entire website.
 */

export const LEAGUE_CONFIG = {
  // Current Season (for default dropdown selection)
  CURRENT_SEASON: 0, // 0 = Preseason 1, 1 = Season 1, 2 = Season 2, 3 = Season 3
  
  // Season Display Name (used in dropdowns and displays)
  CURRENT_SEASON_NAME: 'Preseason 1',
  
  // Available Seasons (for stats filtering)
  AVAILABLE_SEASONS: ['Preseason 1', 'Season 1', 'Season 2', 'Season 3', 'All-Time'],
  
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
export function isCurrentSeason(seasonName: string): boolean {
  return seasonName === LEAGUE_CONFIG.CURRENT_SEASON_NAME;
}
