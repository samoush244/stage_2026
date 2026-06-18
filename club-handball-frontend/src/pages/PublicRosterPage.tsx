import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import API from "../services/api";

type PublicTeam = {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string | null;
  imageUrl?: string | null;
  category?: string;
  level?: string;
  teamType?: string;
};

type PublicMember = {
  _id: string;
  memberType?: "player" | "staff";
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  age?: number | null;
  photo?: string | null;
  photoUrl?: string | null;
  imageUrl?: string | null;
  number?: number | null;
  jerseyNumber?: number | null;
  position?: string | null;
  displayOrder?: number;
};

type RosterState = {
  team: PublicTeam | null;
  players: PublicMember[];
  staff: PublicMember[];
};

const playerPositionOrder = [
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

const staffPositionOrder = [
  "Entraîneur principal",
  "Entraîneur adjoint",
  "Préparateur physique",
  "Accompagnateur",
  "Responsable d'équipe",
  "Kinésithérapeute",
  "Médecin",
  "Autre",
  "Non renseigné",
];

const defaultPlayerImage = "/images/default-player.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

function optimizeCloudinaryImage(url: string, width = 800) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,c_limit,w_${width}/`
  );
}

function getBackendImageUrl(image?: string | null, width = 800) {
  if (!image || image.trim() === "") return null;

  let finalUrl = image;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    finalUrl = image;
  } else if (image.startsWith("/")) {
    finalUrl = `${SERVER_URL}${image}`;
  } else {
    finalUrl = `${SERVER_URL}/${image}`;
  }

  return optimizeCloudinaryImage(finalUrl, width);
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

function getPlayerNumber(player: PublicMember) {
  if (player.number !== null && player.number !== undefined) {
    return player.number;
  }

  if (player.jerseyNumber !== null && player.jerseyNumber !== undefined) {
    return player.jerseyNumber;
  }

  return null;
}

function getMemberImage(member: PublicMember) {
  if (member.photoUrl && member.photoUrl.trim() !== "") {
    return getBackendImageUrl(member.photoUrl, 450) || defaultPlayerImage;
  }

  if (member.photo && member.photo.trim() !== "") {
    return getBackendImageUrl(member.photo, 450) || defaultPlayerImage;
  }

  if (member.imageUrl && member.imageUrl.trim() !== "") {
    return getBackendImageUrl(member.imageUrl, 450) || defaultPlayerImage;
  }

  return defaultPlayerImage;
}

function groupMembersByPosition(members: PublicMember[]) {
  return members.reduce<Record<string, PublicMember[]>>((groups, member) => {
    const position = member.position?.trim() || "Non renseigné";

    if (!groups[position]) {
      groups[position] = [];
    }

    groups[position].push(member);

    return groups;
  }, {});
}

function sortPositions(positions: string[], order: string[]) {
  return positions.sort((a, b) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

function sortMembers(members: PublicMember[]) {
  return [...members].sort((a, b) => {
    const orderA = a.displayOrder ?? 0;
    const orderB = b.displayOrder ?? 0;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return `${a.lastName || ""} ${a.firstName || ""}`.localeCompare(
      `${b.lastName || ""} ${b.firstName || ""}`
    );
  });
}

export default function PublicRosterPage() {
  const { teamSlug } = useParams();

  const [roster, setRoster] = useState<RosterState>({
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

  const rawPlayers = Array.isArray(roster.players) ? roster.players : [];
  const rawStaff = Array.isArray(roster.staff) ? roster.staff : [];

  const players = useMemo(() => {
    return sortMembers(
      rawPlayers.filter((member) => member.memberType !== "staff")
    );
  }, [rawPlayers]);

  const staff = useMemo(() => {
    const separatedStaff =
      rawStaff.length > 0
        ? rawStaff
        : rawPlayers.filter((member) => member.memberType === "staff");

    return sortMembers(separatedStaff);
  }, [rawStaff, rawPlayers]);

  const groupedPlayers = useMemo(() => {
    return groupMembersByPosition(players);
  }, [players]);

  const sortedPlayerPositions = useMemo(() => {
    return sortPositions(Object.keys(groupedPlayers), playerPositionOrder);
  }, [groupedPlayers]);

  const groupedStaff = useMemo(() => {
    return groupMembersByPosition(staff);
  }, [staff]);

  const sortedStaffPositions = useMemo(() => {
    return sortPositions(Object.keys(groupedStaff), staffPositionOrder);
  }, [groupedStaff]);

  const teamImageUrl = getBackendImageUrl(
    roster.team?.imageUrl || roster.team?.image,
    1400
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="h-2 w-24 bg-red-600" />

          <p className="mt-8 text-lg font-bold uppercase tracking-wide">
            Chargement de l'effectif...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-red-500">
            Effectif
          </p>

          <h1 className="mt-6 text-5xl font-black uppercase leading-none md:text-7xl lg:text-8xl">
            {roster.team?.name || "Effectif"}
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-zinc-300">
            Retrouvez les joueurs de l'équipe, leurs postes, numéros et
            informations principales.
          </p>

          <div className="mt-8 w-full overflow-hidden rounded-[2rem] bg-black">
            {teamImageUrl ? (
              <img
                src={teamImageUrl}
                alt={roster.team?.name || "Photo de l'équipe"}
                className="max-h-[520px] w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex min-h-[340px] items-center justify-center bg-zinc-900">
                <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Photo d'équipe à venir
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* JOUEURS */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-10 rounded-xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700">
              {error}
            </div>
          )}

          {players.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-10 text-center">
              <h3 className="text-2xl font-black uppercase">
                Aucun joueur affiché
              </h3>

              <p className="mt-3 text-zinc-600">
                L'effectif de cette équipe n'est pas encore disponible.
              </p>
            </div>
          ) : (
            <div className="space-y-20">
              {sortedPlayerPositions.map((position) => (
                <section key={position}>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-12 w-2 bg-red-600" />

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
                        Poste
                      </p>

                      <h3 className="text-3xl font-black uppercase">
                        {position}
                      </h3>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {groupedPlayers[position].map((player) => {
                      const number = getPlayerNumber(player);

                      const age =
                        player.age !== null && player.age !== undefined
                          ? player.age
                          : getAgeFromBirthDate(player.birthDate);

                      return (
                        <article
                          key={player._id}
                          className="group mx-auto w-full max-w-[245px] overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                            <div className="absolute left-0 top-0 z-10 h-full w-2 bg-red-600" />

                            <img
                              src={getMemberImage(player)}
                              alt={`${player.firstName || ""} ${
                                player.lastName || ""
                              }`}
                              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />

                            {number !== null && (
                              <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl font-black text-white shadow-xl ring-4 ring-red-600">
                                {number}
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <h4 className="text-xl font-black uppercase leading-tight">
                              {player.lastName || ""}
                            </h4>

                            <p className="text-base font-bold text-red-600">
                              {player.firstName || ""}
                            </p>

                            <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-xs font-bold uppercase tracking-wide text-zinc-600">
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
      <section className="bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-red-500">
                Encadrement
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase md:text-5xl">
                Le staff
              </h2>
            </div>
          </div>

          {staff.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <h3 className="text-2xl font-black uppercase">
                Aucun membre du staff affiché
              </h3>

              <p className="mt-3 text-zinc-400">
                Le staff apparaîtra ici dès qu'il sera ajouté depuis
                l'administration.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {sortedStaffPositions.map((position) => (
                <section key={position}>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-10 w-2 bg-red-600" />

                    <h3 className="text-2xl font-black uppercase">
                      {position}
                    </h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {groupedStaff[position].map((member) => (
                      <article
                        key={member._id}
                        className="group rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-1 hover:border-red-600/60 hover:bg-white/[0.07]"
                      >
                        <div className="flex gap-5">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
                            <img
                              src={getMemberImage(member)}
                              alt={`${member.firstName || ""} ${
                                member.lastName || ""
                              }`}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                              Staff
                            </p>

                            <h4 className="mt-2 text-xl font-black uppercase leading-tight text-white">
                              {member.lastName || ""}
                            </h4>

                            <p className="text-lg font-bold text-zinc-300">
                              {member.firstName || ""}
                            </p>

                            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                              {member.position || "Fonction non renseignée"}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
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