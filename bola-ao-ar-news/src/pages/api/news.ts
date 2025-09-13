import type { APIRoute } from "astro";
import { getLatestNews } from "~/lib/news";

export const GET: APIRoute = async () => {
  const data = await getLatestNews(8);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
  });
};
