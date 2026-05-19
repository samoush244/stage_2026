import { useState } from "react";

const historyItems = [
  {
    year: "2016",
    image: "/images/histoire-2016.jpg",
    title: "Création du club",
    text: [
      "Le Valenciennes Handball Club est fondé par un groupe de passionnés de sport et plus particulièrement de handball. Dès ses débuts, le club a eu pour objectif de promouvoir le handball au niveau local et de former des jeunes joueurs.",
    ],
    details: ["asdf"],
  },
  {
    year: "2018",
    image: "/images/histoire-2018.jpg",
    title: "Les premières équipes se structurent",
    text: [
      "Le club développe progressivement ses catégories et commence à accueillir davantage de licenciés.",
      "Les entraînements, les matchs et la vie associative prennent une place importante.",
    ],
    details: [ ],
  },
  {
    year: "2020",
    image: "/images/histoire-2020.jpg",
    title: "Une nouvelle dynamique sportive",
    text: [
      "Le projet sportif se renforce avec une meilleure organisation des équipes.",
      "Les jeunes catégories prennent de l’importance dans la construction du club.",
    ],
    details: [],
  },
  {
    year: "2022",
    image: "/images/histoire-2022.jpg",
    title: "Le club continue de grandir",
    text: [
      "Les équipes progressent et le club affirme davantage son identité locale.",
      "Les bénévoles, les coachs et les familles participent activement à cette évolution.",
    ],
    details: [],
  },
  {
    year: "2026",
    image: "/images/actualités/n3_championne.jpg",
    title: "Nos Red Girls accédent à la Nationale 2 !",
    text: [
      "8 ans après la création de section feminine , le club atteint un nouveau palier avec l’accession de l’équipe première féminine en Nationale 2.",
    ],
    details: [],
  },
];

export default function Histoire() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  return (
    <main className="min-h-screen font-white text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        {/* TITRE */}
        <div className="mb-16 text-center">
          <h2 className="mt-4 text-2xl font-black uppercase text-red-600 md:text-3xl">
            L’histoire du club
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 bg-red-600" />
        </div>

        {/* FRISE */}
        <div className="relative">
          {/* Ligne verticale mobile */}
          <div className="absolute left-5 top-0 h-full w-[3px] bg-red-600 md:hidden" />

          {/* Ligne verticale desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 bg-red-600 md:block" />

          <div className="space-y-16">
            {historyItems.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <article
                  key={`${item.year}-${index}`}
                  className="relative grid grid-cols-1 md:grid-cols-2 md:gap-12"
                >
                  {/* Point mobile */}
                  <div className="absolute left-[11px] top-2 z-10 h-6 w-6 rounded-full border-4 border-zinc-950 bg-red-600 md:hidden" />

                  {/* Point desktop */}
                  <div className="absolute left-1/2 top-6 z-10 hidden h-6 w-6 -translate-x-1/2 rounded-full border-4 border-zinc-950 bg-red-600 md:block" />

                  {/* MOBILE */}
                  <div className="pl-16 md:hidden">
                    <HistoryCard
                      item={item}
                      isOpen={openCard === index}
                      onToggle={() =>
                        setOpenCard(openCard === index ? null : index)
                      }
                    />
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden md:contents">
                    {isLeft ? (
                      <>
                        <div className="flex justify-end">
                          <div className="w-full max-w-xl pr-10">
                            <HistoryCard
                              item={item}
                              align="right"
                              isOpen={openCard === index}
                              onToggle={() =>
                                setOpenCard(openCard === index ? null : index)
                              }
                            />
                          </div>
                        </div>

                        <div />
                      </>
                    ) : (
                      <>
                        <div />

                        <div className="flex justify-start">
                          <div className="w-full max-w-xl pl-10">
                            <HistoryCard
                              item={item}
                              align="left"
                              isOpen={openCard === index}
                              onToggle={() =>
                                setOpenCard(openCard === index ? null : index)
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

type HistoryItem = {
  year: string;
  image: string;
  title: string;
  text: string[];
  details: string[];
};

function HistoryCard({
  item,
  align = "left",
  isOpen,
  onToggle,
}: {
  item: HistoryItem;
  align?: "left" | "right";
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasDetails = item.details.length > 0;

  return (
    <article
      onClick={hasDetails ? onToggle : undefined}
      onKeyDown={(event) => {
        if (!hasDetails) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      role={hasDetails ? "button" : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      className={`group rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/30 outline-none transition-all duration-300 hover:-translate-y-2 hover:border-red-600 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-red-950/30 focus:border-red-600 ${
        hasDetails ? "cursor-pointer" : "cursor-default"
      } ${align === "right" ? "md:text-right" : "md:text-left"}`}
    >
      {/* Année */}
      <h3 className="mb-4 text-4xl font-black text-red-600 transition-colors duration-300 group-hover:text-red-500">
        {item.year}
      </h3>

      {/* Image */}
      {item.image && (
        <div className="mb-5 overflow-hidden rounded-lg border border-zinc-800 bg-black">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[360px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Petite barre rouge */}
      <div
        className={`mb-4 h-1 w-16 bg-red-600 transition-all duration-300 group-hover:w-24 ${
          align === "right" ? "md:ml-auto" : ""
        }`}
      />

      {/* Titre */}
      <h4 className="mb-4 text-2xl font-black uppercase text-white transition-colors duration-300 group-hover:text-red-50">
        {item.title}
      </h4>

      {/* Texte visible directement */}
      <div className="space-y-3 text-lg leading-8 text-zinc-300">
        {item.text.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Bouton indicateur uniquement s'il y a des détails */}
      {hasDetails && (
        <div
          className={`mt-6 flex ${
            align === "right" ? "md:justify-end" : "md:justify-start"
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-red-500 transition group-hover:bg-red-600 group-hover:text-white">
            {isOpen ? "Voir moins" : "Voir plus"}
            <span className="text-lg">{isOpen ? "−" : "+"}</span>
          </span>
        </div>
      )}

      {/* Contenu caché / affiché au clic */}
      {isOpen && hasDetails && (
        <div className="mt-6 border-t border-zinc-700 pt-6">
          <div className="space-y-3 text-base leading-7 text-zinc-300">
            {item.details.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}