
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
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
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
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age -= 1;
  return age;
}

function getPlayerNumber(player: PublicMember) {
  if (player.number !== null && player.number !== undefined) return player.number;
  if (player.jerseyNumber !== null && player.jerseyNumber !== undefined) return player.jerseyNumber;
  return null;
}

function getMemberImage(member: PublicMember) {
  if (member.photoUrl?.trim()) return getBackendImageUrl(member.photoUrl, 700) || defaultPlayerImage;
  if (member.photo?.trim()) return getBackendImageUrl(member.photo, 700) || defaultPlayerImage;
  if (member.imageUrl?.trim()) return getBackendImageUrl(member.imageUrl, 700) || defaultPlayerImage;
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
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

function sortMembers(members: PublicMember[]) {
  return [...members].sort((a, b) => {
    const oa = a.displayOrder ?? 0;
    const ob = b.displayOrder ?? 0;
    if (oa !== ob) return oa - ob;
    return `${a.lastName ?? ""} ${a.firstName ?? ""}`.localeCompare(
      `${b.lastName ?? ""} ${b.firstName ?? ""}`
    );
  });
}

// ─── Player card ──────────────────────────────────────────────────────────────

function PlayerCard({ player }: { player: PublicMember }) {
  const number = getPlayerNumber(player);
  const age =
    player.age !== null && player.age !== undefined
      ? player.age
      : getAgeFromBirthDate(player.birthDate);
  const imgSrc = getMemberImage(player);
  const hasPhoto = imgSrc !== defaultPlayerImage;

  return (
    <article className="group rounded-xl overflow-hidden border border-zinc-200 bg-white hover:border-red-400 transition-colors duration-200">
      {/* Photo zone */}
      <div className="relative h-52 overflow-hidden bg-zinc-100">
        {hasPhoto ? (
          <img
            src={imgSrc}
            alt={`${player.firstName ?? ""} ${player.lastName ?? ""}`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-zinc-100 flex items-end justify-center">
            <div className="relative w-full h-full flex items-end justify-center">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-28 bg-zinc-300 rounded-t-full" />
              <div className="absolute bottom-[108px] left-1/2 -translate-x-1/2 w-9 h-9 bg-zinc-300 rounded-full" />
            </div>
          </div>
        )}

        {number !== null && (
          <div className="absolute bottom-2.5 right-2.5 min-w-[28px] h-7 px-1.5 rounded-md bg-red-600 flex items-center justify-center text-white text-xs font-bold">
            {number}
          </div>
        )}
      </div>

      {/* Red stripe */}
      <div className="h-[3px] bg-red-600" />

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3">
        <p className="text-sm font-bold text-zinc-900 uppercase tracking-wide leading-tight">
          {player.lastName ?? ""}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">{player.firstName ?? ""}</p>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-zinc-100">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 truncate pr-1">
            {player.position ?? "Non renseigné"}
          </span>
          {age !== null && (
            <span className="text-[10px] text-zinc-400 flex-shrink-0">{age} ans</span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Position heading ─────────────────────────────────────────────────────────

function PositionHeading({ position, count }: { position: string; count: number }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-800">
        {position}
      </span>
      <span className="text-xs text-zinc-400 font-medium">· {count}</span>
    </div>
  );
}

// ─── Staff card ───────────────────────────────────────────────────────────────

function StaffCard({ member }: { member: PublicMember }) {
  const imgSrc = getMemberImage(member);
  const hasPhoto = imgSrc !== defaultPlayerImage;

  return (
    <article className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-colors duration-150">
      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center">
        {hasPhoto ? (
          <img
            src={imgSrc}
            alt={`${member.firstName ?? ""} ${member.lastName ?? ""}`}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-xs font-bold text-blue-600">
            {getStaffInitials(member)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-zinc-900 leading-tight truncate">
          {member.lastName ?? ""}{" "}
          <span className="font-normal text-zinc-600">{member.firstName ?? ""}</span>
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mt-0.5 truncate">
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
    const separated =
      rawStaff.length > 0
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

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            Chargement…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 px-6 pt-14 pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="w-8 h-1 bg-red-600 rounded-full mb-6" />

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 mb-3">
            Effectif
          </p>

          <h1 className="text-4xl md:text-5xl font-black uppercase text-zinc-900 leading-none mb-6">
            {roster.team?.name ?? "Effectif"}
          </h1>

          <div className="flex flex-wrap gap-8">
            {players.length > 0 && (
              <div>
                <p className="text-2xl font-black text-zinc-900">{players.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
                  Joueur{players.length > 1 ? "s" : ""}
                </p>
              </div>
            )}
            {staff.length > 0 && (
              <div>
                <p className="text-2xl font-black text-zinc-900">{staff.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
                  Staff
                </p>
              </div>
            )}
            {roster.team?.level && (
              <div>
                <p className="text-2xl font-black text-zinc-900">{roster.team.level}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
                  Division
                </p>
              </div>
            )}
          </div>

          {teamImageUrl && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-zinc-200">
              <img
                src={teamImageUrl}
                alt={roster.team?.name ?? "Photo de l'équipe"}
                className="w-full max-h-[480px] object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── ERREUR ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* ── JOUEURS ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        {players.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Aucun joueur affiché
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              L'effectif de cette équipe n'est pas encore disponible.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedPlayerPositions.map((position) => (
              <div key={position}>
                <PositionHeading
                  position={position}
                  count={groupedPlayers[position].length}
                />
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {groupedPlayers[position].map((player) => (
                    <PlayerCard key={player._id} player={player} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── STAFF ───────────────────────────────────────────────────────── */}
      {staff.length > 0 && (
        <section className="border-t border-zinc-200 bg-white px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <div className="w-8 h-1 bg-blue-500 rounded-full mb-6" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">
                Encadrement
              </p>
              <h2 className="text-3xl font-black uppercase text-zinc-900">
                Le staff
              </h2>
            </div>

            <div className="space-y-10">
              {sortedStaffPositions.map((position) => (
                <div key={position}>
                  <PositionHeading
                    position={position}
                    count={groupedStaff[position].length}
                  />
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {groupedStaff[position].map((member) => (
                      <StaffCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}