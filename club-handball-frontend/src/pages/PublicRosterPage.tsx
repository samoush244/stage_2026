import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import API from "../services/api";

type Team = {
  _id: string;
  name: string;
  slug: string;
  level?: string;
  category?: string;
  gender?: string;
  image?: string;
  imageUrl?: string;
};

type RosterMember = {
  _id: string;
  memberType: "player" | "staff";
  firstName: string;
  lastName: string;
  birthDate?: string;
  age?: number | null;
  photo?: string;
  photoUrl?: string;
  number?: number;
  position?: string;
  displayOrder?: number;
};

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";

  return `${first}${last}` || "RS";
}

function getPlayerPosition(player: RosterMember) {
  return player.position || "Poste à compléter";
}

function getPositionOrder(position: string) {
  const value = position.toLowerCase();

  if (value.includes("gardien")) return 1;
  if (value.includes("ailier gauche")) return 2;
  if (value.includes("arrière gauche") || value.includes("arriere gauche")) return 3;
  if (value.includes("demi")) return 4;
  if (value.includes("pivot")) return 5;
  if (value.includes("arrière droit") || value.includes("arriere droit")) return 6;
  if (value.includes("ailier droit")) return 7;
  if (value.includes("compléter")) return 99;

  return 50;
}

export default function PublicRosterPage() {
  const { teamSlug } = useParams();

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<RosterMember[]>([]);
  const [staff, setStaff] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoster = async () => {
      if (!teamSlug) return;

      try {
        setLoading(true);

        const response = await API.get(
          `/players/public/team/${teamSlug}/roster`
        );

        setTeam(response.data.team);
        setPlayers(response.data.players || []);
        setStaff(response.data.staff || []);
      } catch (error) {
        console.error("Erreur récupération effectif :", error);
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [teamSlug]);

  const playersByPosition = useMemo(() => {
    const groups: Record<string, RosterMember[]> = {};

    players.forEach((player) => {
      const position = getPlayerPosition(player);

      if (!groups[position]) {
        groups[position] = [];
      }

      groups[position].push(player);
    });

    return Object.entries(groups).sort(([positionA], [positionB]) => {
      return getPositionOrder(positionA) - getPositionOrder(positionB);
    });
  }, [players]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
            Effectif
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase">
            Chargement de l’effectif...
          </h1>
        </div>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
            Effectif
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase">
            Équipe introuvable
          </h1>
          <p className="mt-4 text-neutral-400">
            Impossible de récupérer l’effectif de cette équipe.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-red-600/30 bg-black">
        {team.imageUrl && (
          <img
            src={team.imageUrl}
            alt={team.name}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-red-500">
            Red Swans
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-none sm:text-5xl lg:text-7xl">
            {team.name}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            Découvrez l’effectif officiel de l’équipe, les joueurs, les postes
            et le staff.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/equipes/${teamSlug}/calendrier-resultats`}
              className="rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-700"
            >
              Calendrier & résultats
            </Link>

            <Link
              to="/"
              className="rounded-md border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-red-500 hover:text-red-500"
            >
              Retour accueil
            </Link>
          </div>
        </div>
      </section>

      {/* INFOS */}
      <section className="border-b border-white/10 bg-neutral-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 md:grid-cols-4">
          <div>
            <p className="text-3xl font-black text-red-500">{players.length}</p>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Joueurs
            </p>
          </div>

          <div>
            <p className="text-3xl font-black text-red-500">{staff.length}</p>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Staff
            </p>
          </div>

          <div>
            <p className="text-3xl font-black text-red-500">
              {playersByPosition.length}
            </p>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Postes
            </p>
          </div>

          <div>
            <p className="text-3xl font-black text-red-500">RS</p>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Red Swans
            </p>
          </div>
        </div>
      </section>

      {/* JOUEURS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
            Effectif
          </p>

          <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
            Joueurs
          </h2>
        </div>

        {players.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-neutral-400">
            Aucun joueur n’est encore affiché pour cette équipe.
          </div>
        ) : (
          <div className="space-y-14">
            {playersByPosition.map(([position, positionPlayers]) => (
              <div key={position}>
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="whitespace-nowrap text-xl font-black uppercase">
                    {position}
                  </h3>
                  <div className="h-px flex-1 bg-red-600/40" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {positionPlayers.map((player) => (
                    <article
                      key={player._id}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-red-600/70"
                    >
                      <div className="relative h-72 bg-neutral-800">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={`${player.firstName} ${player.lastName}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-black">
                            <span className="text-5xl font-black text-red-600">
                              {getInitials(player.firstName, player.lastName)}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        {player.number && (
                          <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
                            N° {player.number}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h4 className="text-xl font-black uppercase leading-tight">
                          {player.firstName} {player.lastName}
                        </h4>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-black/40 p-3">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                              Poste
                            </p>
                            <p className="mt-1 font-bold text-neutral-200">
                              {getPlayerPosition(player)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-black/40 p-3">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                              Âge
                            </p>
                            <p className="mt-1 font-bold text-neutral-200">
                              {player.age ? `${player.age} ans` : "À compléter"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STAFF */}
      <section className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
              Encadrement
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
              Staff
            </h2>
          </div>

          {staff.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-neutral-400">
              Aucun membre du staff n’est encore affiché pour cette équipe.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {staff.map((member) => (
                <article
                  key={member._id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:border-red-600/70"
                >
                  <div className="relative h-64 bg-neutral-800">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-black">
                        <span className="text-5xl font-black text-red-600">
                          {getInitials(member.firstName, member.lastName)}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>

                  <div className="p-5">
                    <h4 className="text-xl font-black uppercase leading-tight">
                      {member.firstName} {member.lastName}
                    </h4>

                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-red-500">
                      {member.position || "Staff"}
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