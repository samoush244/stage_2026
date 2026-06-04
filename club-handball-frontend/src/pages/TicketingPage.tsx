
import { useEffect, useState } from "react";
import { getPublicEvents, type EventItem } from "../services/eventService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_URL = API_URL.replace("/api", "");

function TicketingPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const mainEvent = events[0];
  const otherEvents = events.slice(1);

  const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${BACKEND_URL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

  const formatDate = (value: string) => {
    if (!value) return "";

    return new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getPublicEvents();
        setEvents(data);
      } catch (error) {
        console.error("Erreur récupération événements publics :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="bg-white px-8 py-24 text-black">
        <div className="mx-auto max-w-7xl">
          <p className="text-lg font-semibold text-gray-600">
            Chargement de la billetterie...
          </p>
        </div>
      </main>
    );
  }

  if (!mainEvent) {
    return (
      <main className="bg-white text-black">
        <section className="bg-black px-8 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Billetterie
            </p>

            <h1 className="mt-4 text-5xl font-extrabold">
              Réservez vos places
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
              Aucun événement publié pour le moment.
            </p>
          </div>
        </section>

        <section className="px-8 py-20">
          <div className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-extrabold">
              Aucun événement disponible
            </h2>

            <p className="mt-4 text-gray-600">
              Les prochains événements et liens de réservation apparaîtront ici
              dès qu’ils seront ajoutés par le club.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Billetterie
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            Réservez vos places
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
            Retrouvez ici les prochains matchs, événements et actions du club
            nécessitant une réservation ou une inscription en ligne.
          </p>
        </div>
      </section>

      <section className="bg-zinc-950 px-8 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-xl">
            {mainEvent.image ? (
              <img
                src={getImageUrl(mainEvent.image)}
                alt={mainEvent.title}
                className="h-auto w-full object-contain"
              />
            ) : (
              <div className="flex h-96 items-center justify-center bg-gradient-to-br from-red-700 via-black to-black">
                <p className="text-2xl font-extrabold uppercase">
                  Match à venir
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Prochain événement
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">
              {mainEvent.title}
            </h2>

            <div className="mt-6 space-y-3 text-gray-300">
              <p>
                <span className="font-bold text-white">Date :</span>{" "}
                {formatDate(mainEvent.date)}
              </p>

              <p>
                <span className="font-bold text-white">Heure :</span>{" "}
                {mainEvent.time}
              </p>

              <p>
                <span className="font-bold text-white">Lieu :</span>{" "}
                {mainEvent.location}
              </p>
            </div>

            <p className="mt-6 leading-relaxed text-gray-300">
              {mainEvent.description}
            </p>

            {mainEvent.ticketUrl ? (
              <a
                href={mainEvent.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
              >
                Accéder à la billetterie
              </a>
            ) : (
              <p className="mt-8 font-semibold text-gray-400">
                Billetterie bientôt disponible.
              </p>
            )}
          </div>
        </div>
      </section>

      {otherEvents.length > 0 && (
        <section className="px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
              À venir
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">
              Autres événements
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {otherEvents.map((event) => (
                <article
                  key={event._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-64 bg-zinc-900 text-white">
                    {event.image ? (
                      <img
                        src={getImageUrl(event.image)}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-700 via-black to-black">
                        <p className="text-xl font-extrabold uppercase">
                          Événement
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-sm font-bold uppercase text-red-600">
                      {formatDate(event.date)} · {event.time}
                    </p>

                    <h3 className="mt-3 text-2xl font-extrabold">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-gray-500">
                      {event.location}
                    </p>

                    <p className="mt-4 leading-relaxed text-gray-600">
                      {event.description}
                    </p>

                    {event.ticketUrl ? (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-block rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Réserver
                      </a>
                    ) : (
                      <p className="mt-6 text-sm font-semibold text-gray-400">
                        Billetterie bientôt disponible
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Information
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            Paiement et réservation
          </h2>

          <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">
            Les réservations peuvent être gérées via une plateforme externe
            comme HelloAsso. Le club pourra ajouter ici les liens officiels vers
            les matchs, événements, stages ou campagnes associatives.
          </p>
        </div>
      </section>
    </main>
  );
}

export default TicketingPage;