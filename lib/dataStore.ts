import { Player, Team, Game, Article } from "@/types";
import { players as initialPlayers, teams as initialTeams, games as initialGames, articles as initialArticles } from './mockData';

// In-memory data store (will reset on server restart)
// For production, replace with a real database

class DataStore {
  private players: Player[] = [...initialPlayers];
  private teams: Team[] = [...initialTeams];
  private games: Game[] = [...initialGames];
  private articles: Article[] = [...initialArticles];

  // Players
  getPlayers(): Player[] {
    return this.players;
  }

  getPlayerById(id: string): Player | undefined {
    return this.players.find(p => p.id === id);
  }

  addPlayer(player: Omit<Player, 'id'>): Player {
    const newPlayer: Player = {
      ...player,
      id: (this.players.length + 1).toString(),
    };
    this.players.push(newPlayer);
    return newPlayer;
  }

  updatePlayer(id: string, updates: Partial<Player>): Player | null {
    const index = this.players.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.players[index] = { ...this.players[index], ...updates };
    return this.players[index];
  }

  deletePlayer(id: string): boolean {
    const index = this.players.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.players.splice(index, 1);
    return true;
  }

  // Teams
  getTeams(): Team[] {
    return this.teams;
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }

  addTeam(team: Omit<Team, 'id'>): Team {
    const newTeam: Team = {
      ...team,
      id: (this.teams.length + 1).toString(),
    };
    this.teams.push(newTeam);
    return newTeam;
  }

  updateTeam(id: string, updates: Partial<Team>): Team | null {
    const index = this.teams.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.teams[index] = { ...this.teams[index], ...updates };
    return this.teams[index];
  }

  deleteTeam(id: string): boolean {
    const index = this.teams.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.teams.splice(index, 1);
    return true;
  }

  // Games
  getGames(): Game[] {
    return this.games;
  }

  getGameById(id: string): Game | undefined {
    return this.games.find(g => g.id === id);
  }

  addGame(game: Omit<Game, 'id'>): Game {
    const newGame: Game = {
      ...game,
      id: (this.games.length + 1).toString(),
    };
    this.games.push(newGame);
    return newGame;
  }

  updateGame(id: string, updates: Partial<Game>): Game | null {
    const index = this.games.findIndex(g => g.id === id);
    if (index === -1) return null;
    
    this.games[index] = { ...this.games[index], ...updates };
    return this.games[index];
  }

  deleteGame(id: string): boolean {
    const index = this.games.findIndex(g => g.id === id);
    if (index === -1) return false;
    
    this.games.splice(index, 1);
    return true;
  }

  // Articles
  getArticles(): Article[] {
    return this.articles;
  }

  getArticleById(id: string): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  addArticle(article: Omit<Article, 'id'>): Article {
    const newArticle: Article = {
      ...article,
      id: (this.articles.length + 1).toString(),
    };
    this.articles.push(newArticle);
    return newArticle;
  }

  updateArticle(id: string, updates: Partial<Article>): Article | null {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.articles[index] = { ...this.articles[index], ...updates };
    return this.articles[index];
  }

  deleteArticle(id: string): boolean {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.articles.splice(index, 1);
    return true;
  }
}

// Export singleton instance
export const dataStore = new DataStore();

