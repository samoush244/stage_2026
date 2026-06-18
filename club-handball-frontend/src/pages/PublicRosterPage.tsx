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

function optimizeCloudinaryImage(url: string, width = 900) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

function getBackendImageUrl(image?: string | null, width = 900) {
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
  if (player.number !== null && player.number !== undefined) return player.number;
  if (player.jerseyNumber !== null && player.jerseyNumber !== undefined) return player.jerseyNumber;
  return null;
}

function getMemberImage(member: PublicMember) {
  if (member.photoUrl && member.photoUrl.trim() !== "") {
    return getBackendImageUrl(member.photoUrl, 700) || defaultPlayerImage;
  }
  if (member.photo && member.photo.trim() !== "") {
    return getBackendImageUrl(member.photo, 700) || defaultPlayerImage;
  }
  if (member.imageUrl && member.imageUrl.trim() !== "") {
    return getBackendImageUrl(member.imageUrl, 700) || defaultPlayerImage;
  }
  return defaultPlayerImage;
}

function getStaffInitials(member: PublicMember) {
  const first = member.firstName?.trim()[0] ?? "";
  const last = member.lastName?.trim()[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

function groupMembersByPosition(members: PublicMember[]) {
  return members.reduce<Record<string, PublicMember[]>>((groups, member) => {
    const position = member.position?.trim() || "Non renseigné";
    if (!groups[position]) groups[position] = [];
    groups[position].push(member);
    return groups;
  }, {});
}

function sortPositions(positions: string[], order: string[]) {
  return positions.sort((a, b) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

function sortMembers(members: PublicMember[]) {
  return [...members].sort((a, b) => {
    const orderA = a.displayOrder ?? 0;
    const orderB = b.displayOrder ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return `${a.lastName || ""} ${a.firstName || ""}`.localeCompare(
      `${b.lastName || ""} ${b.firstName || ""}`
    );
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PositionHeading({ position, count }: { position: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-0.5 h-7 bg-red-600 rounded-full flex-shrink-0" />
      <span className="text-sm font-semibold text-zinc-900 dark:text-white">
        {position}
      </span>
      <span className="text-xs text-zinc-400 font-medium">· {count}</span>
    </div>
  );
}

function PlayerCard({ player }: { player: PublicMember }) {
  const number = getPlayerNumber(player);
  const age =
    player.age !== null && player.age !== undefined
      ? player.age
      : getAgeFromBirthDate(player.birthDate);
  const imgSrc = getMemberImage(player);
  const hasRealImage = imgSrc !== defaultPlayerImage;

  return (
    <article className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-200">
      {/* Image zone */}
      <div className="relative h-44 bg-zinc-900 overflow-hidden">
        {hasRealImage ? (
          <img
            src={imgSrc}
            alt={`${player.firstName ?? ""} ${player.lastName ?? ""}`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          /* Placeholder silhouette */
          <div className="w-full h-full flex items-end justify-center bg-zinc-900">
            <div className="w-16 h-28 rounded-t-full bg-zinc-700/50 mb-0" />
          </div>
        )}

        {/* Dark gradient overlay at bottom for text legibility if needed */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-900/60 to-transparent pointer-events-none" />

        {/* Jersey number badge */}
        {number !== null && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {number}
          </div>
        )}
      </div>

      {/* Info zone */}
      <div className="px-4 py-3">
        <p className="text-base font-bold text-zinc-900 dark:text-white leading-tight uppercase tracking-wide">
          {player.lastName ?? ""}
        </p>
        <p className="text-sm text-red-600 font-medium mt-0.5">
          {player.firstName ?? ""}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {player.position ?? "Non renseigné"}
          </span>
          {age !== null && (
            <span className="text-[11px] text-zinc-400 font-medium">{age} ans</span>
          )}
        </div>
      </div>
    </article>
  );
}

function StaffCard({ member }: { member: PublicMember }) {
  const imgSrc = getMemberImage(member);
  const hasRealImage = imgSrc !== defaultPlayerImage;

  return (
    <article className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-200">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
        {hasRealImage ? (
          <img
            src={imgSrc}
            alt={`${member.firstName ?? ""} ${member.lastName ?? ""}`}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {getStaffInitials(member)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
          {member.lastName ?? ""}{" "}
          <span className="font-normal text-zinc-600 dark:text-zinc-300">
            {member.firstName ?? ""}
          </span>
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mt-1">
          {member.position ?? "Fonction non renseignée"}
        </p>
      </div>
    </article>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

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
        const response = await API.get(`/players/public/team/${teamSlug}/roster`);
        setRoster({
          team: response.data.team || null,
          players: Array.isArray(response.data.players) ? response.data.players : [],
          staff: Array.isArray(response.data.staff) ? response.data.staff : [],
        });
      } catch (err) {
        console.error("Erreur récupération effectif :", err);
        setRoster({ team: null, players: [], staff: [] });
        setError("Impossible de récupérer l'effectif pour le moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [teamSlug]);

  const rawPlayers = Array.isArray(roster.players) ? roster.players : [];
  const rawStaff = Array.isArray(roster.staff) ? roster.staff : [];

  const players = useMemo(
    () => sortMembers(rawPlayers.filter((m) => m.memberType !== "staff")),
    [rawPlayers]
  );

  const staff = useMemo(() => {
    const separated = rawStaff.length > 0
      ? rawStaff
      : rawPlayers.filter((m) => m.memberType === "staff");
    return sortMembers(separated);
  }, [rawStaff, rawPlayers]);

  const groupedPlayers = useMemo(() => groupMembersByPosition(players), [players]);
  const sortedPlayerPositions = useMemo(
    () => sortPositions(Object.keys(groupedPlayers), playerPositionOrder),
    [groupedPlayers]
  );

  const groupedStaff = useMemo(() => groupMembersByPosition(staff), [staff]);
  const sortedStaffPositions = useMemo(
    () => sortPositions(Object.keys(groupedStaff), staffPositionOrder),
    [groupedStaff]
  );

  const teamImageUrl = getBackendImageUrl(
    roster.team?.imageUrl || roster.team?.image,
    1600
  );

  const totalPlayers = players.length;
  const totalStaff = staff.length;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
            Chargement…
          </p>
        </div>
      </main>
    );
  }

  // ── Page ───────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 overflow-hidden">
        {/* Background large number watermark */}
        <span
          aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[22vw] font-black text-white/[0.03] leading-none select-none pointer-events-none tabular-nums"
        >
          {String(totalPlayers).padStart(2, "0")}
        </span>

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-4">
            Effectif
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-none mb-6">
            {roster.team?.name ?? "Effectif"}
          </h1>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2">
            {totalPlayers > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {totalPlayers} joueur{totalPlayers > 1 ? "s" : ""}
              </span>
            )}
            {totalStaff > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                {totalStaff} staff
              </span>
            )}
            {roster.team?.level && (
              <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/30">
                {roster.team.level}
              </span>
            )}
          </div>
        </div>

        {/* Team photo */}
        {teamImageUrl && (
          <div className="relative z-10 mx-auto max-w-6xl px-6 pb-0">
            <div className="rounded-t-2xl overflow-hidden border-t border-x border-white/10">
              <img
                src={teamImageUrl}
                alt={roster.team?.name ?? "Photo de l'équipe"}
                className="w-full max-h-[520px] object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        )}
      </section>

      {/* ── ERREUR ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* ── JOUEURS ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        {players.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Aucun joueur affiché
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              L'effectif de cette équipe n'est pas encore disponible.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {sortedPlayerPositions.map((position) => (
              <div key={position}>
                <PositionHeading
                  position={position}
                  count={groupedPlayers[position].length}
                />
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {groupedPlayers[position].map((player) => (
                    <PlayerCard key={player._id} player={player} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── STAFF ─────────────────────────────────────────────────────────── */}
      {staff.length > 0 && (
        <section className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-2">
                Encadrement
              </p>
              <h2 className="text-3xl font-black uppercase text-zinc-900 dark:text-white">
                Le staff
              </h2>
            </div>

            {sortedStaffPositions.map((position) => (
              <div key={position} className="mb-10 last:mb-0">
                <PositionHeading
                  position={position}
                  count={groupedStaff[position].length}
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedStaff[position].map((member) => (
                    <StaffCard key={member._id} member={member} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}