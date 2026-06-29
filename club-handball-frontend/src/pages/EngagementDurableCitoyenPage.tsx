import { useEffect, useState } from "react";
import API from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

type EngagementLabel = {
  _id: string;
  name: string;
  logo: string;
  description?: string;
  year?: string;
  order: number;
  isActive: boolean;
};

type EngagementGalleryItem = {
  _id: string;
  image: string;
  title: string;
  description: string;
  actionDate?: string;
  order: number;
  isActive: boolean;
};

type EngagementPageData = {
  partnerName: string;
  partnerLogo: string;
  partnerWebsite?: string;
  introText: string;
  labels: EngagementLabel[];
  gallery: EngagementGalleryItem[];
};

const DEFAULT_INTRO_TEXT =
  "Grâce au soutien de notre partenaire, le Valenciennes Handball Club met en place des actions durables et citoyennes tout au long de l’année. Ensemble, nous réalisons des activités de sensibilisation, de solidarité et de protection de l’environnement afin de transmettre aux jeunes licenciés les valeurs de respect, d’engagement et de responsabilité.";

const engagements = [
  {
    number: "01",
    title: "Préserver l’environnement",
    description:
      "Réduire les déchets, encourager le tri et adopter des pratiques plus responsables lors des activités du club.",
  },
  {
    number: "02",
    title: "Agir pour la solidarité",
    description:
      "Participer à des collectes et soutenir des actions utiles au territoire, aux familles et aux associations locales.",
  },
  {
    number: "03",
    title: "Favoriser l’inclusion",
    description:
      "Faire du handball un espace ouvert, accessible et respectueux pour tous les publics.",
  },
  {
    number: "04",
    title: "Promouvoir l’égalité",
    description:
      "Valoriser la pratique féminine et lutter contre toutes les formes de discrimination.",
  },
  {
    number: "05",
    title: "Transmettre les valeurs citoyennes",
    description:
      "Sensibiliser les jeunes au respect, au fair-play, à l’entraide et à l’engagement collectif.",
  },
  {
    number: "06",
    title: "Valoriser les bénévoles",
    description:
      "Mettre en lumière les personnes qui donnent de leur temps et font vivre le club au quotidien.",
  },
];

function formatActionDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function EngagementDurableCitoyenPage() {
  const [pageData, setPageData] = useState<EngagementPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<EngagementGalleryItem | null>(null);

  useEffect(() => {
    const fetchEngagementPage = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get<EngagementPageData>(
          "/engagement-durable-citoyen"
        );

        setPageData(response.data);
      } catch (err) {
        console.error("Erreur récupération page engagement :", err);
        setError(
          "Les informations de la page ne sont pas disponibles pour le moment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementPage();
  }, []);

  useEffect(() => {
    const closeModalWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    window.addEventListener("keydown", closeModalWithEscape);

    return () => {
      window.removeEventListener("keydown", closeModalWithEscape);
    };
  }, []);

  const introText = pageData?.introText || DEFAULT_INTRO_TEXT;
  const labels = pageData?.labels || [];
  const gallery = pageData?.gallery || [];

  const partnerLogo = pageData?.partnerLogo
    ? getImageUrl(pageData.partnerLogo)
    : "";

  const renderPartnerLogo = () => {
    if (!partnerLogo) {
      return null;
    }

    const logo = (
      <img
        src={partnerLogo}
        alt={
          pageData?.partnerName
            ? `Logo ${pageData.partnerName}`
            : "Logo partenaire"
        }
        className="h-24 w-full object-contain sm:h-28"
      />
    );

    if (pageData?.partnerWebsite) {
      return (
        <a
          href={pageData.partnerWebsite}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-28 items-center justify-center rounded-xl bg-white p-4 shadow-sm transition hover:scale-[1.02]"
        >
          {logo}
        </a>
      );
    }

    return (
      <div className="flex min-h-28 items-center justify-center rounded-xl bg-white p-4 shadow-sm">
        {logo}
      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-24">
        <p className="text-center text-gray-600">
          Chargement de la page...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-black px-4 py-20 text-white sm:py-24">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-red-700 opacity-80" />
        <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full border-[30px] border-red-700 opacity-70" />

        <div className="relative mx-auto max-w-6xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-red-400">
            Valenciennes Handball Club
          </p>

          <h1 className="text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">
            Engagement durable
            <span className="block text-red-500">et citoyen</span>
          </h1>

          <div className="mx-auto mt-6 h-1 w-20 bg-red-600" />
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[280px_1fr]">
          {renderPartnerLogo()}

          <div>
            {pageData?.partnerName && (
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-red-700">
                En partenariat avec {pageData.partnerName}
              </p>
            )}

            <h2 className="text-3xl font-black uppercase text-black sm:text-4xl">
              Agir ensemble
            </h2>

            <div className="mt-4 h-1 w-16 bg-red-700" />

            <p className="mt-6 max-w-3xl text-base leading-8 text-gray-700 sm:text-lg">
              {introText}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-red-700">
              Nos valeurs
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase text-black sm:text-4xl">
              Nos engagements
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              À travers le sport, le VHC souhaite agir concrètement pour son
              territoire, ses licenciés et les générations futures.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {engagements.map((engagement) => (
              <article
                key={engagement.number}
                className="group border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-600 hover:shadow-lg"
              >
                <span className="text-4xl font-black text-red-700">
                  {engagement.number}
                </span>

                <h3 className="mt-6 text-xl font-extrabold uppercase text-black">
                  {engagement.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {engagement.description}
                </p>

                <div className="mt-6 h-1 w-10 bg-black transition-all duration-300 group-hover:w-16 group-hover:bg-red-700" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {labels.length > 0 && (
        <section className="bg-black px-4 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-red-400">
                Reconnaissances
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
                Nos labels
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-300">
                Ces labels valorisent l’investissement du club en faveur du
                sport, de la citoyenneté, de l’inclusion et du développement
                durable.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {labels.map((label) => (
                <article
                  key={label._id}
                  className="rounded-xl bg-white p-6 text-center text-black"
                >
                  <img
                    src={getImageUrl(label.logo)}
                    alt={`Logo ${label.name}`}
                    className="mx-auto h-24 w-full object-contain"
                  />

                  <h3 className="mt-5 text-lg font-extrabold uppercase">
                    {label.name}
                  </h3>

                  {label.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {label.description}
                    </p>
                  )}

                  {label.year && (
                    <p className="mt-4 text-sm font-bold text-red-700">
                      {label.year}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-red-700">
              Le club en action
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase text-black sm:text-4xl">
              Nos actions en images
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
              Découvrez les actions menées par le Valenciennes Handball Club
              avec ses licenciés, bénévoles et partenaires.
            </p>
          </div>

          {error && (
            <p className="mt-8 text-center text-sm text-red-700">{error}</p>
          )}

          {gallery.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="group relative aspect-[4/3] overflow-hidden bg-gray-200 text-left focus:outline-none focus:ring-4 focus:ring-red-600"
                  aria-label={`Voir l'action : ${item.title}`}
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/45 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <p className="text-lg font-extrabold uppercase text-white">
                      {item.title}
                    </p>

                    {item.actionDate && (
                      <p className="mt-1 text-sm font-medium text-red-300">
                        {formatActionDate(item.actionDate)}
                      </p>
                    )}

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-200">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-gray-300 px-6 py-12 text-center text-gray-500">
              Les photos des actions du club seront bientôt disponibles.
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Détail de l'action ${selectedItem.title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-white">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black text-2xl text-white transition hover:bg-red-700"
              aria-label="Fermer la photo"
            >
              ×
            </button>

            <img
              src={getImageUrl(selectedItem.image)}
              alt={selectedItem.title}
              className="max-h-[65vh] w-full bg-black object-contain"
            />

            <div className="p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-red-700">
                Action du club
              </p>

              <h3 className="mt-2 text-2xl font-black uppercase text-black sm:text-3xl">
                {selectedItem.title}
              </h3>

              {selectedItem.actionDate && (
                <p className="mt-3 font-semibold text-gray-500">
                  {formatActionDate(selectedItem.actionDate)}
                </p>
              )}

              <p className="mt-5 max-w-3xl leading-8 text-gray-700">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default EngagementDurableCitoyenPage;