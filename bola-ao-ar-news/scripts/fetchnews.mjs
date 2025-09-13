import Parser from "rss-parser";
import slugify from "slugify";
import matter from "gray-matter";
import fs from "fs/promises";
import fse from "fs-extra";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "src", "content", "posts");
const SOURCES_FILE = path.join(ROOT, "scripts", "news-sources.json");

function sha(s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}
function cleanText(s = "", max = 420) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}
function toISO(d) {
  if (!d) return new Date().toISOString().slice(0, 10);
  const date = new Date(d);
  return isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}
function pickCover(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  const m = (item.content || "").match(/<img[^>]+src="([^"]+)"/i);
  return m?.[1];
}
async function alreadyExists(id) {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files.some((f) => f.includes(id));
  } catch {
    return false;
  }
}
function inferTags(title = "", sourceName = "") {
  const t = title.toLowerCase() + " " + sourceName.toLowerCase();
  const tags = [];
  if (/\bnba\b/.test(t)) tags.push("NBA");
  if (/euroleague|euroliga/.test(t)) tags.push("EuroLeague");
  if (/liga betclic|portugal|fpb|benfica|porto|sporting/.test(t)) tags.push("Portugal");
  if (/wnba/.test(t)) tags.push("WNBA");
  return [...new Set(tags)];
}

async function writePost(item, sourceName) {
  const title = (item.title || "Sem título").trim();
  const link = (item.link || "").trim();
  if (!link) return;

  const date = toISO(item.isoDate || item.pubDate);
  const excerpt = cleanText(item.contentSnippet || item.content || "");
  const cover = pickCover(item);
  const guidRaw = item.guid || link || title;
  const id = sha(guidRaw);

  if (await alreadyExists(id)) return;

  const slugTitle = slugify(title, { lower: true, strict: true }) || "noticia";
  const slug = `${date}-${slugTitle}-${id.slice(0, 6)}`;

  const fm = {
    title,
    excerpt: excerpt || "Resumo indisponível.",
    cover,
    author: "Redação",
    tags: inferTags(title, sourceName),
    date,
    source: sourceName || "Google News",
    source_url: link,
    guid: id,
    draft: false
  };

  const body = [
    excerpt,
    "",
    `> Fonte: [${fm.source}](${fm.source_url})`
  ].join("\n");

  const out = matter.stringify(body, fm);
  await fse.ensureDir(POSTS_DIR);
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  await fs.writeFile(filePath, out, "utf8");
  console.log("✔ Novo post:", filePath);
}

async function main() {
  const parser = new Parser();
  const { feeds } = await fse.readJson(SOURCES_FILE);

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      const sourceName = feed.title || "Google News";
      const items = feed.items || [];
      for (const it of items.slice(0, 20)) {
        if (!it.title || !it.link) continue;
        await writePost(it, sourceName);
      }
    } catch (e) {
      console.error("Erro no feed:", url, e?.message || e);
    }
  }
}

main();
