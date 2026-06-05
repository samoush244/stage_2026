import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  content?: string;
  summary?: string;
  type: "internal" | "external";
  source?: string;
  externalUrl?: string;
  publishedAt?: string;
  createdAt?: string;
  isPublished: boolean;
};

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

function NewsDetailPage() {
  const params = useParams();

  // Compatible avec /actualites/:slug ou /actualites/:newsSlug
  const currentSlug = params.slug || params.newsSlug;

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        if (!currentSlug) {
          throw new Error("Slug manquant");
        }

        const res = await fetch(`${API_URL}/api/news/${currentSlug}`);

        if (!res.ok) {
          throw new Error("Actualité introuvable");
        }

        const data = await res.json();

        console.log("Détail actualité :", data);

        setNews(data);
      } catch (error) {
        console.error("Erreur détail actualité :", error);
        setError("Cette actualité n’existe pas encore ou le lien est incorrect.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [currentSlug]);

  const getImageUrl = (image?: string) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
};

  const getDisplayDate = () => {
    const date = news?.publishedAt || news?.createdAt;

    if (!date) return "";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-8 text-black">
        <p className="text-gray-600">Chargement de l’actualité...</p>
      </main>
    );
  }

  if (error || !news) {
    return (
      <main className="bg-white px-8 py-20 text-black">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-extrabold">
            Actualité introuvable
          </h1>

          <p className="mt-4 text-gray-600">
            Cette actualité n’existe pas encore ou le lien est incorrect.
          </p>

          <Link
            to="/actualites"
            className="mt-8 inline-block rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Retour aux actualités
          </Link>
        </div>
      </main>
    );
  }

  if (news.type === "external") {
    return (
      <main className="bg-white px-8 py-20 text-black">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/actualites"
            className="inline-block rounded border border-black px-6 py-3 font-semibold hover:border-red-600 hover:text-red-600"
          >
            Retour aux actualités
          </Link>

          <p className="mt-10 text-sm font-bold uppercase tracking-[0.3em] text-red-600">
            Revue de presse
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            {news.title}
          </h1>

          {news.summary && (
            <p className="mt-5 max-w-3xl text-lg text-gray-600">
              {news.summary}
            </p>
          )}

          {news.source && (
            <p className="mt-4 text-gray-500">
              Source : {news.source}
            </p>
          )}

          {news.externalUrl && (
            <a
              href={news.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Lire l’article externe
            </a>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/actualites"
            className="inline-block text-sm font-bold uppercase text-red-500 hover:text-red-400"
          >
            ← Retour aux actualités
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Actualité
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-extrabold">
            {news.title}
          </h1>

          <p className="mt-5 text-gray-300">{getDisplayDate()}</p>
        </div>
      </section>

      {news.image && (
        <section className="bg-zinc-950 px-8 pb-16">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-xl">
            <img
              src={getImageUrl(news.image)}
              alt={news.title}
              className="h-auto w-full object-contain"
            />
          </div>
        </section>
      )}

      <section className="px-8 py-20">
        <article className="mx-auto max-w-3xl">
          {news.summary && (
            <p className="text-xl font-semibold leading-relaxed text-gray-800">
              {news.summary}
            </p>
          )}

          {news.content && (
            <div className="mt-10 space-y-6 text-lg leading-relaxed text-gray-700">
              {news.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          <Link
            to="/actualites"
            className="mt-10 inline-block rounded border border-black px-6 py-3 font-semibold hover:border-red-600 hover:text-red-600"
          >
            Retour aux actualités
          </Link>
        </article>
      </section>
    </main>
  );
}

export default NewsDetailPage;