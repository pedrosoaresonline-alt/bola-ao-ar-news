export type Game = {
  id: string;
  league: "LNB" | "NBA" | "EuroLeague";
  date: string; // ISO
  home: string;
  away: string;
  score?: string; // "95-90"
};

export const RECENT_GAMES: Game[] = [
  { id: "g1", league: "LNB", date: new Date().toISOString(), home: "Imortal", away: "Oliveirense", score: "78-74" },
  { id: "g2", league: "NBA", date: new Date().toISOString(), home: "Celtics", away: "Heat", score: "101-98" },
];

export function getGamesByLeague(league: Game["league"]): Game[] {
  return RECENT_GAMES.filter(g => g.league === league);
}
