import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import API from "../services/api";

type PublicTeam = {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string | null;
  imageUrl?: string | null;
};

type PublicPlayer = {
  _id: string;
  memberType?: "player" | "staff";
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  age?: number | null;
  photo?: string | null;
  photoUrl?: string | null;
  number?: number | null;
  jerseyNumber?: number | null;
  position?: string | null;
};

type PublicRosterResponse = {
  team: PublicTeam | null;
  players: PublicPlayer[];
  staff: PublicPlayer[];
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
  "Non renseigné",
];

const defaultPlayerImage = "/images/default-player.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

function getBackendImageUrl(image?: string | null) {
  if (!image || image.trim() === "") return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${SERVER_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

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
    return getBackendImageUrl(player.photoUrl) || defaultPlayerImage;
  }

  if (player.photo && player.photo.trim() !== "") {
    return getBackendImageUrl(player.photo) || defaultPlayerImage;
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

export default function PublicRosterPage() {
  const { teamSlug } = useParams();

  const [roster, setRoster] = useState<PublicRosterResponse>({
    team: null,
    players: [],
    staff: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoster = async () => {
      if (!teamSlug) {
        setError("Équipe introuvable.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/players/public/team/${teamSlug}/roster`
        );

        setRoster({
          team: response.data.team || null,
          players: Array.isArray(response.data.players)
            ? response.data.players
            : [],
          staff: Array.isArray(response.data.staff) ? response.data.staff : [],
        });
      } catch (err) {
        console.error("Erreur récupération effectif :", err);

        setRoster({
          team: null,
          players: [],
          staff: [],
        });

        setError("Impossible de récupérer l'effectif pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [teamSlug]);

  const players = Array.isArray(roster.players) ? roster.players : [];
  const staff = Array.isArray(roster.staff) ? roster.staff : [];

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

  const teamImageUrl = getBackendImageUrl(
    roster.team?.imageUrl || roster.team?.image
  );

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
      {/* HERO */}
      <section className="bg-white">
        <div className="bg-black px-6 py-16 text-white">
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

            {teamImageUrl && (
              <div className="mt-10 w-full overflow-hidden rounded-2xl bg-white">
                <img
                  src={teamImageUrl}
                  alt={roster.team?.name || "Photo de l'équipe"}
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTENU */}
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
                              alt={`${player.firstName || ""} ${
                                player.lastName || ""
                              }`}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-2xl font-black uppercase leading-tight">
                                  {player.lastName || ""}
                                </h3>

                                <p className="text-lg font-semibold text-red-600">
                                  {player.firstName || ""}
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

      {/* STAFF */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-10 w-2 bg-red-600" />

            <h2 className="text-3xl font-black uppercase">Staff</h2>
          </div>

          {staff.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
              <h3 className="text-2xl font-black uppercase">
                Aucun membre du staff affiché
              </h3>

              <p className="mt-3 text-zinc-600">
                Le staff de cette équipe n'est pas encore disponible.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {staff.map((member) => (
                <article
                  key={member._id}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-80 overflow-hidden bg-zinc-100">
                    <img
                      src={getPlayerImage(member)}
                      alt={`${member.firstName || ""} ${member.lastName || ""}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-black uppercase leading-tight">
                      {member.lastName || ""}
                    </h3>

                    <p className="text-lg font-semibold text-red-600">
                      {member.firstName || ""}
                    </p>

                    <div className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-600">
                      <p>Fonction : {member.position || "Staff"}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}