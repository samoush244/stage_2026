
type TeamKey = "masculin" | "feminin";
type CalendrierResultatsPageProps = {
  team: TeamKey;
};
const teams = {
  masculin: {
    title: "Nationale 3 Masculine",
    subtitle: "Calendrier, résultats et classement de l’équipe première masculine.",
    image: "/images/n3-masculine.jpg",
    scorencoUrl: "COLLE_ICI_LE_LIEN_WIDGET_SCORENCO_MASCULIN",
  },
  feminin: {
    title: "Nationale 3 Féminine",
    subtitle: "Calendrier, résultats et classement de l’équipe première féminine.",
    image: "/images/n3-feminine.jpg",
    scorencoUrl: "COLLE_ICI_LE_LIEN_WIDGET_SCORENCO_FEMININ",
  },
};

export default function CalendrierResultatsPage({ team }: CalendrierResultatsPageProps) {
  const data = teams[team];

  if (!data) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-black">
        <h1 className="text-3xl font-bold">Équipe introuvable</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden bg-black">
        <img
          src={data.image}
          alt={data.title}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">

          <h1 className="max-w-3xl text-4xl font-black uppercase text-white md:text-6xl">
            {data.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-zinc-200">
            {data.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-red-600">
              Calendrier & résultats
            </p>
          </div>
        </div>
      </section>

      {/* WIDGET SCORENCO */}
      <section
        id="calendrier-resultats"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
          <div className="border-b border-zinc-200 bg-zinc-950 px-6 py-5">
            <h2 className="text-2xl font-black uppercase text-white">
              Matchs, résultats & classement
            </h2>
            <p className="mt-1 text-sm text-zinc-300">
              Module officiel intégré automatiquement.
            </p>
          </div>

          <div className="bg-white p-3 md:p-6">
            {data.scorencoUrl.includes("COLLE_ICI") ? (
              <div className="rounded-2xl border border-dashed border-red-300 bg-red-50 p-8 text-center">
                <h3 className="text-xl font-black text-red-700">
                  Widget Score’n’co à ajouter
                </h3>
                <p className="mt-3 text-zinc-700">
                  Remplace la valeur{" "}
                  <span className="font-bold">
                    COLLE_ICI_LE_LIEN_WIDGET_SCORENCO
                  </span>{" "}
                  par le lien d’intégration fourni par Score’n’co.
                </p>
              </div>
            ) : (
              <iframe
                src={data.scorencoUrl}
                title={`Score'n'co - ${data.title}`}
                className="h-[900px] w-full rounded-2xl border-0"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}