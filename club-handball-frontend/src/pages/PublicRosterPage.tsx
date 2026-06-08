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
          staff: Array.isArray(response.data.staff)
            ? response.data.staff
            : [],
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

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [groupedPlayers]);

  const teamImageUrl = getBackendImageUrl(
    roster.team?.imageUrl || roster.team?.image
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
            Effectif
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase">
            Chargement de l'effectif...
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_520px]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">
              Effectif officiel
            </p>

            <h1 className="mt-5 text-5xl font-black uppercase leading-none md:text-7xl">
              {roster.team?.name || "Effectif"}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Retrouvez les joueurs, leurs postes, leurs numéros et le staff de
              l’équipe.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-4xl font-black text-red-500">
                  {players.length}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Joueurs
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-4xl font-black text-red-500">
                  {staff.length}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Staff
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-4xl font-black text-red-500">
                  {sortedPositions.length}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Postes
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-red-600/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-red-600/40 bg-neutral-900 p-3 shadow-2xl">
              {teamImageUrl ? (
                <img
                  src={teamImageUrl}
                  alt={roster.team?.name || "Photo de l'équipe"}
                  className="h-[360px] w-full rounded-[1.5rem] object-cover"
                />
              ) : (
                <div className="flex h-[360px] items-center justify-center rounded-[1.5rem] bg-neutral-800">
                  <p className="text-xl font-black uppercase text-zinc-500">
                    Photo équipe
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MESSAGE ERREUR */}
      {error && (
        <section className="px-6 pt-12">
          <div className="mx-auto max-w-7xl rounded-xl border border-red-500/40 bg-red-950/40 p-6 text-red-200">
            {error}
          </div>
        </section>
      )}

      {/* JOUEURS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-red-500">
                Les joueurs
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase md:text-5xl">
                Groupe sportif
              </h2>
            </div>
          </div>

          {players.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <h2 className="text-2xl font-black uppercase">
                Aucun joueur affiché
              </h2>

              <p className="mt-3 text-zinc-400">
                L'effectif de cette équipe n'est pas encore disponible.
              </p>
            </div>
          ) : (
            <div className="space-y-20">
              {sortedPositions.map((position) => (
                <section key={position}>
                  <div className="mb-8 flex items-center gap-5">
                    <h3 className="text-2xl font-black uppercase text-white md:text-3xl">
                      {position}
                    </h3>
                    <div className="h-px flex-1 bg-red-600/50" />
                  </div>

                  <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {groupedPlayers[position].map((player) => {
                      const number = getPlayerNumber(player);

                      const age =
                        player.age !== null && player.age !== undefined
                          ? player.age
                          : getAgeFromBirthDate(player.birthDate);

                      return (
                        <article
                          key={player._id}
                          className="group overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-red-600/70"
                        >
                          <div className="relative h-80 overflow-hidden bg-neutral-800">
                            <img
                              src={getPlayerImage(player)}
                              alt={`${player.firstName || ""} ${
                                player.lastName || ""
                              }`}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            {number !== null && (
                              <div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-black text-white shadow-lg">
                                {number}
                              </div>
                            )}

                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                                {player.position || "Non renseigné"}
                              </p>
                            </div>
                          </div>

                          <div className="p-6">
                            <h3 className="text-2xl font-black uppercase leading-tight text-white">
                              {player.lastName || ""}
                            </h3>

                            <p className="mt-1 text-xl font-bold text-red-500">
                              {player.firstName || ""}
                            </p>

                            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold uppercase tracking-wide text-zinc-400">
                              <span>Âge</span>
                              <span className="text-white">
                                {age !== null ? `${age} ans` : "N/R"}
                              </span>
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

      {/* STAFF HORIZONTAL */}
      <section className="bg-black px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-red-500">
              Encadrement
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase text-white md:text-5xl">
              Staff technique
            </h2>
          </div>

          {staff.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <h3 className="text-2xl font-black uppercase text-white">
                Aucun membre du staff affiché
              </h3>

              <p className="mt-3 text-zinc-400">
                Le staff de cette équipe n'est pas encore disponible.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {staff.map((member) => (
                <article
                  key={member._id}
                  className="group flex overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 transition duration-300 hover:border-red-600/70"
                >
                  <div className="h-44 w-36 shrink-0 overflow-hidden bg-neutral-800 sm:h-52 sm:w-44">
                    <img
                      src={getPlayerImage(member)}
                      alt={`${member.firstName || ""} ${member.lastName || ""}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-center p-6">
                    <p className="mb-3 w-fit rounded-full bg-red-600 px-4 py-1 text-xs font-black uppercase tracking-widest text-white">
                      {member.position || "Staff"}
                    </p>

                    <h3 className="text-2xl font-black uppercase leading-tight text-white">
                      {member.lastName || ""}
                    </h3>

                    <p className="mt-1 text-xl font-bold text-red-500">
                      {member.firstName || ""}
                    </p>

                    <div className="mt-5 h-px w-full bg-white/10" />

                    <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                      Membre de l’encadrement de l’équipe.
                    </p>
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