import { Link, useParams } from "react-router";
import { newsItems } from "../data/news";

function NewsDetailPage() {
  const { newsSlug } = useParams();

  const news = newsItems.find((item) => item.slug === newsSlug);

  if (!news) {
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
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
            Revue de presse
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            {news.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            {news.summary}
          </p>

          <a
            href={news.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Lire sur {news.sourceName}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Actualité
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-extrabold">
            {news.title}
          </h1>

          <p className="mt-5 text-gray-300">{news.date}</p>
        </div>
      </section>

      {news.imageUrl && (
        <section className="bg-zinc-950 px-8 pb-16">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-xl">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="h-auto w-full object-contain"
            />
          </div>
        </section>
      )}

      <section className="px-8 py-20">
        <article className="mx-auto max-w-3xl">
          <p className="text-xl font-semibold leading-relaxed text-gray-800">
            {news.summary}
          </p>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-gray-700">
            {news.content?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

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