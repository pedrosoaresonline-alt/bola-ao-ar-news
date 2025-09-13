export type Player = {
  slug: string;
  name: string;
  position: "Base" | "Extremo" | "Poste";
  team: string;
  photo?: string;
  stats?: {
    ppg?: number; rpg?: number; apg?: number; per?: number;
  };
};

export const PLAYERS: Player[] = [
  {
    slug: "joao-silva",
    name: "João Silva",
    position: "Base",
    team: "Imortal",
    photo: "https://picsum.photos/seed/joao/400/400",
    stats: { ppg: 14.2, rpg: 3.1, apg: 6.7, per: 18.4 }
  },
  {
    slug: "miguel-sousa",
    name: "Miguel Sousa",
    position: "Poste",
    team: "Oliveirense",
    photo: "https://picsum.photos/seed/miguel/400/400",
    stats: { ppg: 17.5, rpg: 9.3, apg: 2.1, per: 22.1 }
  },
];

export function getAllPlayers() { return PLAYERS; }
export function getPlayer(slug: string) { return PLAYERS.find(p => p.slug === slug); }
