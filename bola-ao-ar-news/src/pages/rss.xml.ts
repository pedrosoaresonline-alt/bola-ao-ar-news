import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getLatestNews } from '~/lib/news';

export const GET: APIRoute = async (context) => {
  const items = await getLatestNews(20);
  return rss({
    title: 'Bola ao Ar News',
    description: 'Últimas do basquetebol, dentro e fora de campo',
    site: context.site?.toString() ?? 'https://www.bolaoar.news',
    items: items.map(n => ({
      title: n.title,
      description: n.summary,
      link: n.link,
      pubDate: new Date(n.date),
    })),
  });
};
