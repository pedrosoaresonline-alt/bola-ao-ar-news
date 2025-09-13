export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  date: string;   // ISO
  link: string;
  image?: string;
  tags?: string[];
};

const MOCK: NewsItem[] = [
  {
    id: "n1",
    title: "Triplo ao estalar da buzina decide clássico",
    summary: "Base entra frio e sela vitória no último segundo.",
    date: new Date().toISOString(),
    link: "/",
    image: "https://picsum.photos/seed/basket1/800/450",
    tags: ["LNB", "Destaque"],
  },
  {
    id: "n2",
    title: "MVP da jornada: poste domina tabela",
    summary: "Ressaltos ofensivos e boa seleção de lançamento.",
    date: new Date().toISOString(),
    link: "/",
    image: "https://picsum.photos/seed/basket2/800/450",
    tags: ["MVP"],
  },
];

export async function getLatestNews(limit = 8): Promise<NewsItem[]> {
  // TODO: substituir por fetch a API/BD quando tiveres ETL
  return MOCK.slice(0, limit);
}
