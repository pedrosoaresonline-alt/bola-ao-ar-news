import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  date: string;
  link: string;
  image?: string;
  tags?: string[];
};

export default function NewsList({ initial }: { initial?: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(initial ?? []);

  useEffect(() => {
    if (!initial) {
      fetch("/api/news")
        .then(r => r.json())
        .then(setItems)
        .catch(() => setItems([]));
    }
  }, [initial]);

  if (!items.length) {
    return <p className="opacity-80">Sem novidades para já.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {items.map(n => (
        <a key={n.id} href={n.link} className="block rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition">
          {n.image && <img src={n.image} alt="" className="w-full aspect-video object-cover" />}
          <div className="p-4">
            <h3 className="font-bold text-lg">{n.title}</h3>
            <p className="text-sm opacity-70 mt-1">{new Date(n.date).toLocaleDateString("pt-PT")}</p>
            <p className="mt-2">{n.summary}</p>
            {n.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {n.tags.map(t => (
                  <span key={t} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{t}</span>
                ))}
              </div>
            ) : null}
          </div>
        </a>
      ))}
    </div>
  );
}
