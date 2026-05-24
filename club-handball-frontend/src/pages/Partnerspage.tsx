import partners from "../data/partners";

const allPartners = [
  ...partners,
  {
    name: "Partenaire 7",
    logo: "/images/logo/logo7.png",
    url: "#",
    category: "majeur",
  },
  {
    name: "Partenaire 8",
    logo: "/images/logo/logo8.png",
    url: "#",
    category: "institutionnel",
  },
  {
    name: "Partenaire 9",
    logo: "/images/logo/logo9.png",
    url: "#",
    category: "officiel",
  },
  {
    name: "Partenaire 10",
    logo: "/images/logo/logo10.png",
    url: "#",
    category: "officiel",
  },
];

const partnerSections = [
  {
    key: "majeur",
    title: "Partenaires majeurs",

  },
  {
    key: "institutionnel",
    title: "Partenaires institutionnels",
  },
  {
    key: "officiel",
    title: "Partenaires officiels",
  },
];

export default function PartnersPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="bg-black py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
            Le club
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase">
            Nos partenaires
          </h1>

          <p className="mt-6 max-w-2xl text-zinc-300">
            Découvrez les entreprises et structures qui accompagnent le club
            dans son développement sportif et associatif.
          </p>
        </div>
      </section>

      {/* LISTE DES PARTENAIRES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl space-y-20 px-6">
          {partnerSections.map((section) => {
            const sectionPartners = allPartners.filter(
              (partner) => partner.category === section.key
            );

            if (sectionPartners.length === 0) return null;

            return (
              <div key={section.key}>
                <div>
                  <h2 className="text-3xl font-black uppercase text-red-600 md:text">
                    {section.title}
                  </h2>
                  </div>  

                <div className="grid grid-cols-2 items-center gap-x-12 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {sectionPartners.map((partner) => (
                    <a
                      key={partner.name}
                      href={partner.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Voir le site de ${partner.name}`}
                      className="group flex min-h-28 items-center justify-center"
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-24 max-w-[170px] object-contain grayscale transition duration-300 group-hover:scale-110 group-hover:grayscale-0"
                      />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEVENIR PARTENAIRE */}
      <section className="bg-zinc-950 py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
              Sponsoring
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase md:text-4xl">
              Devenir partenaire du club
            </h2>

            <p className="mt-5 max-w-2xl text-zinc-300">
              Vous souhaitez associer votre entreprise à un projet sportif local,
              dynamique et engagé ? Rejoignez les partenaires du club.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-700"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </main>
  );
}