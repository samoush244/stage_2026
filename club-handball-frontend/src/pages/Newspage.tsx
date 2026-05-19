import { Link } from "react-router";
import { newsItems } from "../data/news";

function NewsPage() {
  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Actualités
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            Les actualités du club
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
            Retrouvez les dernières nouvelles du club, les annonces importantes,
            les résultats, les événements et les articles de presse locale.
          </p>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
              À la une
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">
              Dernières publications
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((news) => (
              <article
                key={news.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-64 bg-zinc-900 text-white">
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-700 via-black to-black">
                      <p className="text-xl font-extrabold uppercase">
                        Actualité
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-bold uppercase text-red-600">
                      {news.type === "external"
                        ? "Revue de presse"
                        : "Vie du club"}
                    </p>

                    <p className="text-sm text-gray-500">{news.date}</p>
                  </div>

                  <h3 className="mt-3 text-2xl font-extrabold">
                    {news.title}
                  </h3>

                  <p className="mt-4 leading-relaxed text-gray-600">
                    {news.summary}
                  </p>

                  {news.type === "external" ? (
                    <a
                      href={news.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-block rounded bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      Lire l’article externe
                    </a>
                  ) : (
                    <Link
                      to={`/actualites/${news.slug}`}
                      className="mt-6 inline-block rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Lire l’actualité
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default NewsPage;