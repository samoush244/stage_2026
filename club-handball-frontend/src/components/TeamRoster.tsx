type Player = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  number: number;
  position: string;
  photoUrl?: string;
};

type StaffMember = {
  id: number;
  role: string;
  name: string;
};

type TeamRosterPageProps = {
  category: string;
  title: string;
  description: string;
  photoTitle: string;
  teamImageUrl?: string;
  players: Player[];
  positions: string[];
  staff: StaffMember[];
};

function TeamRosterPage({
  category,
  title,
  description,
  photoTitle,
  teamImageUrl,
  players,
  positions,
  staff,
}: TeamRosterPageProps) {
  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            {category}
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">{title}</h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-300">
            {description}
          </p>
        </div>
      </section>

      <section className="bg-zinc-950 px-8 pb-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-xl">
            {teamImageUrl ? (
              <img
                src={teamImageUrl}
                alt={photoTitle}
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-gradient-to-br from-red-700 via-black to-black">
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-400">
                    Photo officielle
                  </p>

                  <h2 className="mt-3 text-4xl font-extrabold">
                    {photoTitle}
                  </h2>

                  <p className="mt-3 text-gray-300">
                    Ici, on affichera la grande photo officielle de l’effectif.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
              Joueurs
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">
              Les joueurs par poste
            </h2>
          </div>

          <div className="space-y-14">
            {positions.map((position) => {
              const playersByPosition = players.filter(
                (player) => player.position === position
              );

              if (playersByPosition.length === 0) {
                return null;
              }

              return (
                <div key={position}>
                  <h3 className="border-l-4 border-red-600 pl-4 text-2xl font-extrabold">
                    {position}
                  </h3>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {playersByPosition.map((player) => (
                      <article
                        key={player.id}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative h-72 bg-zinc-900 text-white">
                          {player.photoUrl ? (
                            <img
                              src={player.photoUrl}
                              alt={`${player.firstName} ${player.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-3xl font-extrabold">
                                {player.number}
                              </div>
                            </div>
                          )}

                          <div className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-xl font-extrabold shadow-lg">
                            {player.number}
                          </div>
                        </div>

                        <div className="p-5">
                          <p className="text-sm font-bold uppercase text-red-600">
                            {player.position}
                          </p>

                          <h4 className="mt-2 text-xl font-extrabold">
                            {player.firstName} {player.lastName}
                          </h4>

                          <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>
                              <span className="font-semibold text-black">
                                Âge :
                              </span>{" "}
                              {player.age} ans
                            </p>

                            <p>
                              <span className="font-semibold text-black">
                                Numéro :
                              </span>{" "}
                              {player.number}
                            </p>

                            <p>
                              <span className="font-semibold text-black">
                                Poste :
                              </span>{" "}
                              {player.position}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-8 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Staff
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {staff.map((member) => (
              <article
                key={member.id}
                className="rounded-2xl border border-zinc-800 bg-black p-6"
              >
                <p className="text-sm text-red-500">{member.role}</p>
                <h3 className="mt-2 text-2xl font-bold">{member.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default TeamRosterPage;