import { useEffect, useMemo, useState } from "react";
import {
  getPublicRosterByTeamSlug,
  type PublicPlayer,
  type PublicRosterResponse,
} from "../services/publicPlayerService";

type PublicRosterPageProps = {
  teamSlug: string;
};

const positionOrder = [
  "Gardien",
  "Gardienne",
  "Ailier gauche",
  "Ailière gauche",
  "Ailier droit",
  "Ailière droite",
  "Arrière gauche",
  "Arrière droite",
  "Demi-centre",
  "Pivot",
  "Entraîneur principal",
  "Entraîneur adjoint",
  "Préparateur physique",
  "Accompagnateur",
  "Non renseigné",
];

const defaultPlayerImage = "/images/default-player.png";

function getAgeFromBirthDate(birthDate?: string) {
  if (!birthDate) return null;

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

function getPlayerNumber(player: PublicPlayer) {
  if (player.number !== null && player.number !== undefined) {
    return player.number;
  }

  if (player.jerseyNumber !== null && player.jerseyNumber !== undefined) {
    return player.jerseyNumber;
  }

  return null;
}

function getPlayerImage(player: PublicPlayer) {
  if (player.photoUrl && player.photoUrl.trim() !== "") {
    return player.photoUrl;
  }

  if (player.photo && player.photo.trim() !== "") {
    return player.photo;
  }

  return defaultPlayerImage;
}

function groupPlayersByPosition(players: PublicPlayer[]) {
  return players.reduce<Record<string, PublicPlayer[]>>((groups, player) => {
    const position = player.position?.trim() || "Non renseigné";

    if (!groups[position]) {
      groups[position] = [];
    }

    groups[position].push(player);

    return groups;
  }, {});
}

export default function PublicRosterPage({ teamSlug }: PublicRosterPageProps) {
  const [roster, setRoster] = useState<PublicRosterResponse>({
    team: null,
    players: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicRosterByTeamSlug(teamSlug);

        setRoster({
          team: data.team,
          players: Array.isArray(data.players) ? data.players : [],
        });
      } catch (err) {
        console.error("Erreur récupération effectif :", err);

        setRoster({
          team: null,
          players: [],
        });

        setError("Impossible de récupérer l'effectif pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [teamSlug]);

const players = Array.isArray(roster?.players) ? roster.players : [];

const groupedPlayers = useMemo(() => {
  return groupPlayersByPosition(players);
}, [players]);

const sortedPositions = useMemo(() => {
  return Object.keys(groupedPlayers).sort((a, b) => {
    const indexA = positionOrder.indexOf(a);
    const indexB = positionOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }

    if (indexA === -1) {
      return 1;
    }

    if (indexB === -1) {
      return -1;
    }

    return indexA - indexB;
  });
}, [groupedPlayers]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-black">
        <div className="mx-auto max-w-7xl">
          <p className="text-lg font-semibold">Chargement de l'effectif...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
            Effectif
          </p>

          <h1 className="mt-4 text-4xl font-black uppercase md:text-6xl">
            {roster.team?.name || "Effectif"}
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-zinc-300">
            Retrouvez les joueurs de l'équipe, leurs postes, numéros et
            informations principales.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-10 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          )}

          {players.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">
              <h2 className="text-2xl font-black uppercase">
                Aucun joueur affiché
              </h2>

              <p className="mt-3 text-zinc-600">
                L'effectif de cette équipe n'est pas encore disponible.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {sortedPositions.map((position) => (
                <section key={position}>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-10 w-2 bg-red-600" />

                    <h2 className="text-3xl font-black uppercase">
                      {position}
                    </h2>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {groupedPlayers[position].map((player) => {
                      const number = getPlayerNumber(player);

                      const age =
                        player.age !== null && player.age !== undefined
                          ? player.age
                          : getAgeFromBirthDate(player.birthDate);

                      return (
                        <article
                          key={player._id}
                          className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                          <div className="h-80 overflow-hidden bg-zinc-100">
                            <img
                              src={getPlayerImage(player)}
                              alt={`${player.firstName} ${player.lastName}`}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-2xl font-black uppercase leading-tight">
                                  {player.lastName}
                                </h3>

                                <p className="text-lg font-semibold text-red-600">
                                  {player.firstName}
                                </p>
                              </div>

                              {number !== null && (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl font-black text-white">
                                  {number}
                                </div>
                              )}
                            </div>

                            <div className="mt-6 space-y-2 text-sm font-semibold uppercase tracking-wide text-zinc-600">
                              <p>
                                Poste : {player.position || "Non renseigné"}
                              </p>

                              {age !== null && <p>Âge : {age} ans</p>}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}