import { useEffect, useState } from "react";

type Partner = {
  _id: string;
  name: string;
  logo: string;
  url: string;
  category?: string;
  isActive?: boolean;
  order?: number;
};

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

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
  {
    key: "autres",
    title: "Autres partenaires",
  },
];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/partners`);

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des partenaires");
        }

        const data = await res.json();

        console.log("Partenaires récupérés :", data);

        setPartners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des partenaires :", error);
        setError("Impossible de charger les partenaires.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const getLogoUrl = (logo?: string) => {
    if (!logo) return "";

    if (logo.startsWith("http://") || logo.startsWith("https://")) {
      return logo;
    }

    if (logo.startsWith("/")) {
      return `${API_URL}${logo}`;
    }

    return `${API_URL}/${logo}`;
  };

  const normalizeCategory = (category?: string) => {
    const value = category?.trim().toLowerCase();

    if (
      value === "majeur" ||
      value === "partenaire majeur" ||
      value === "partenaires majeurs"
    ) {
      return "majeur";
    }

    if (
      value === "institutionnel" ||
      value === "partenaire institutionnel" ||
      value === "partenaires institutionnels"
    ) {
      return "institutionnel";
    }

    if (
      value === "officiel" ||
      value === "partenaire officiel" ||
      value === "partenaires officiels"
    ) {
      return "officiel";
    }

    return "autres";
  };

  const visiblePartners = partners
    .filter((partner) => partner.isActive !== false)
    .sort((a, b) => {
      const categoryA = normalizeCategory(a.category);
      const categoryB = normalizeCategory(b.category);

      if (categoryA !== categoryB) {
        return categoryA.localeCompare(categoryB, "fr", {
          sensitivity: "base",
        });
      }

      return (a.order ?? 999) - (b.order ?? 999);
    });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-zinc-600">Chargement des partenaires...</p>
      </main>
    );
  }

  return (
    <main className="bg-white">
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

      <section className="py-20">
        <div className="mx-auto max-w-7xl space-y-20 px-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          )}

          {!error && visiblePartners.length === 0 && (
            <p className="text-center text-zinc-500">
              Aucun partenaire affiché pour le moment.
            </p>
          )}

          {!error &&
            partnerSections.map((section) => {
              const sectionPartners = visiblePartners.filter(
                (partner) => normalizeCategory(partner.category) === section.key
              );

              if (sectionPartners.length === 0) return null;

              return (
                <div key={section.key}>
                  <div>
                    <h2 className="text-3xl font-black uppercase text-red-600 md:text-4xl">
                      {section.title}
                    </h2>
                  </div>

                  <div className="mt-10 grid grid-cols-2 items-center gap-x-12 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {sectionPartners.map((partner) => (
                      <a
                        key={partner._id}
                        href={partner.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Voir le site de ${partner.name}`}
                        className="group flex min-h-28 items-center justify-center"
                      >
                        <img
                          src={getLogoUrl(partner.logo)}
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