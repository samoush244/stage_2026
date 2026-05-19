import { ticketEvents } from "../data/tickets";

function TicketingPage() {
  const mainEvent = ticketEvents[0];
  const otherEvents = ticketEvents.slice(1);

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
            {mainEvent.imageUrl ? (
              <img
                src={mainEvent.imageUrl}
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
                {mainEvent.date}
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

            <a
              href={mainEvent.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Accéder à la billetterie
            </a>
          </div>
        </div>
      </section>

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
                key={event.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-64 bg-zinc-900 text-white">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
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
                    {event.date} · {event.time}
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

                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-block rounded bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Réserver
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Information
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            Paiement et réservation
          </h2>

          <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">
            Les réservations peuvent être gérées via une plateforme externe comme
            HelloAsso. Le club pourra ajouter ici les liens officiels vers les
            matchs, événements, stages ou campagnes associatives.
          </p>
        </div>
      </section>
    </main>
  );
}

export default TicketingPage;