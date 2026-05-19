type TeamScheduleResultsPageProps = {
  category: string;
  title: string;
  description: string;
  scoreNCoUrl?: string;
};

function TeamScheduleResultsPage({
  category,
  title,
  description,
  scoreNCoUrl,
}: TeamScheduleResultsPageProps) {
  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            {category}
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-300">
            {description}
          </p>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
              Saison en cours
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">
              Calendrier, résultats et classement
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              Cette page affichera automatiquement les informations de la saison
              via Score’n’co : calendrier, résultats et classement.
            </p>
          </div>

          {scoreNCoUrl ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
              <iframe
                src={scoreNCoUrl}
                title={title}
                className="h-[800px] w-full"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-zinc-50 p-10 text-center shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
                Intégration à venir
              </p>

              <h3 className="mt-4 text-3xl font-extrabold">
                Module Score’n’co
              </h3>

              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                Le lien Score’n’co officiel de cette équipe sera ajouté ici pour
                afficher automatiquement le calendrier, les résultats et le
                classement.
              </p>

              <a
                href="#"
                className="mt-8 inline-block rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
              >
                Voir sur Score’n’co
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default TeamScheduleResultsPage;