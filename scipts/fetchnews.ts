import Parser from 'rss-parser';
import slugify from 'slugify';
import matter from 'gray-matter';
import fs from 'fs-extra';
import crypto from 'crypto';
import path from 'path';

type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  guid?: string;
  isoDate?: string;
  enclosure?: { url?: string };
};

const ROOT = path.resolve(process.cwd());
const POSTS_DIR = path.join(ROOT, 'src/content/posts');
const SOURCES_FILE = path.join(ROOT, 'scripts/news-sources.json');

function sha(s: string) {
  return crypto.createHash('sha1').update(s).digest('hex');
}

function cleanText(s?: string, max = 420) {
  if (!s) return '';
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function toISO(d?: string) {
  if (!d) return new Date().toISOString().slice(0, 10);
  const date = new Date(d);
  return isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

function pickCover(it: FeedItem): string | undefined {
  // tenta enclosure ou adivinha imagens no content
  if (it.enclosure?.url) return it.enclosure.url;
  const m = (it.content || '').match(/<img[^>]+src="([^"]+)"/i);
  return m?.[1];
}

async function alreadyExists(guidOrUrl: string) {
  const id = sha(guidOrUrl);
  const glob = await fs.readdir(POSTS_DIR);
  return glob.some(f => f.includes(id));
}

async function writePost(item: FeedItem, sourceName: string) {
  const title = (item.title || 'Sem título').trim();
  const link = (item.link || '').trim();
  const date = toISO(item.isoDate || item.pubDate);
  const excerpt = cleanText(item.contentSnippet || item.content);
  const cover = pickCover(item);
  const guid = item.guid || link || title;
  const id = sha(guid);

  // evita duplicados
  if (await alreadyExists(guid)) return;

  const slug = `${date}-${slugify(title, { lower: true, strict: true })}-${id.slice(0,6)}`;
  const fm = {
    title,
    excerpt: excerpt || 'Resumo indisponível.',
    cover,
    author: 'Redação',
    tags: [],
    date,
    source: sourceName,
    source_url: link,
    guid: id,
    draft: false
  };

  const body = [
    excerpt,
    '',
    `> Fonte: [${sourceName}](${link})`
  ].join('\n');

  const out = matter.stringify(body, fm);
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  await fs.outputFile(filePath, out, 'utf8');
  console.log('✔ Novo post:', filePath);
}

async function main() {
  const parser = new Parser();
  const cfg = await fs.readJson(SOURCES_FILE);
  await fs.ensureDir(POSTS_DIR);

  for (const feedUrl of cfg.feeds as string[]) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const sourceName = feed.title || 'Google News';
      const items = (feed.items as FeedItem[]) || [];
      for (const it of items.slice(0, 20)) { // limita por feed
        if (!it.link || !it.title) continue;
        await writePost(it, sourceName);
      }
    } catch (e) {
      console.error('Erro no feed:', feedUrl, e);
    }
  }
}

main();
