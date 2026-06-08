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
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
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
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age -= 1;
  return age;
}

function getPlayerNumber(player: PublicPlayer) {
  if (player.number !== null && player.number !== undefined) return player.number;
  if (player.jerseyNumber !== null && player.jerseyNumber !== undefined) return player.jerseyNumber;
  return null;
}

function getPlayerImage(player: PublicPlayer) {
  if (player.photoUrl && player.photoUrl.trim() !== "")
    return getBackendImageUrl(player.photoUrl) || defaultPlayerImage;
  if (player.photo && player.photo.trim() !== "")
    return getBackendImageUrl(player.photo) || defaultPlayerImage;
  return defaultPlayerImage;
}

function getInitials(firstName?: string, lastName?: string) {
  const f = firstName?.trim()[0] ?? "";
  const l = lastName?.trim()[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

function groupPlayersByPosition(players: PublicPlayer[]) {
  return players.reduce<Record<string, PublicPlayer[]>>((groups, player) => {
    const position = player.position?.trim() || "Non renseigné";
    if (!groups[position]) groups[position] = [];
    groups[position].push(player);
    return groups;
  }, {});
}

/* ─── Styles injectés une seule fois ─────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap');

  .roster-root {
    min-height: 100vh;
    background: #f5f4f0;
    font-family: 'Barlow', sans-serif;
    color: #111;
  }

  /* ── HERO ── */
  .roster-hero {
    background: #0d0d0d;
    position: relative;
    overflow: hidden;
  }
  .roster-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(225,29,46,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .roster-hero-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 64px 40px 72px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 40px;
    align-items: end;
  }
  .roster-hero-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #e11d2e;
    margin-bottom: 14px;
  }
  .roster-hero-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(52px, 8vw, 96px);
    font-weight: 800;
    text-transform: uppercase;
    color: #fff;
    line-height: 0.92;
    letter-spacing: -0.01em;
    margin-bottom: 20px;
  }
  .roster-hero-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    max-width: 440px;
    line-height: 1.65;
  }
  .roster-hero-stats {
    display: flex;
    gap: 2px;
  }
  .roster-hero-stat {
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    padding: 20px 28px;
    text-align: center;
  }
  .roster-hero-stat:first-child { border-radius: 12px 0 0 12px; }
  .roster-hero-stat:last-child  { border-radius: 0 12px 12px 0; }
  .roster-hero-stat-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 40px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }
  .roster-hero-stat-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-top: 4px;
  }
  .roster-hero-team-img {
    width: 100%;
    max-height: 360px;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  /* ── CONTENU ── */
  .roster-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 64px 40px;
  }

  /* ── SECTION POSTE ── */
  .roster-position-block {
    margin-bottom: 56px;
  }
  .roster-position-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
  }
  .roster-position-bar {
    width: 4px;
    height: 28px;
    background: #e11d2e;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .roster-position-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #111;
    flex: 1;
  }
  .roster-position-count {
    font-size: 11px;
    font-weight: 600;
    color: #e11d2e;
    background: rgba(225,29,46,0.08);
    border: 0.5px solid rgba(225,29,46,0.2);
    border-radius: 20px;
    padding: 3px 12px;
    letter-spacing: 0.05em;
  }

  /* ── GRID ── */
  .roster-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  /* ── PLAYER CARD ── */
  .player-card {
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    border: 0.5px solid rgba(0,0,0,0.08);
    transition: transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s;
    cursor: default;
  }
  .player-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.1);
  }
  .player-card-img-wrap {
    aspect-ratio: 3/4;
    background: #f0ede8;
    position: relative;
    overflow: hidden;
  }
  .player-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(.22,1,.36,1);
  }
  .player-card:hover .player-card-img {
    transform: scale(1.04);
  }
  .player-card-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 16px;
  }
  .player-card-img-placeholder svg {
    width: 60%;
    height: auto;
    opacity: 0.18;
  }
  .player-card-number {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: #e11d2e;
    color: #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 800;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: -0.02em;
  }
  .player-card-body {
    padding: 14px 16px 16px;
  }
  .player-card-last {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 19px;
    font-weight: 700;
    text-transform: uppercase;
    color: #111;
    letter-spacing: 0.03em;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .player-card-first {
    font-size: 13px;
    font-weight: 500;
    color: #e11d2e;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .player-card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 0.5px solid rgba(0,0,0,0.07);
  }
  .player-card-meta-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ccc;
    flex-shrink: 0;
  }
  .player-card-meta-text {
    font-size: 11px;
    color: #888;
    font-weight: 500;
    letter-spacing: 0.04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── STAFF ── */
  .roster-staff-section {
    background: #0d0d0d;
    padding: 64px 0;
    margin-top: 8px;
  }
  .roster-staff-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }
  .roster-staff-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 32px;
  }
  .roster-staff-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #fff;
    flex: 1;
  }
  .roster-staff-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }
  .staff-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px 18px;
    transition: background 0.2s, border-color 0.2s;
  }
  .staff-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.14);
  }
  .staff-card-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: #1a1a1a;
    border: 1.5px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: rgba(255,255,255,0.6);
  }
  .staff-card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .staff-card-last {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 17px;
    font-weight: 700;
    text-transform: uppercase;
    color: #fff;
    letter-spacing: 0.04em;
    line-height: 1.1;
  }
  .staff-card-first {
    font-size: 12px;
    color: #e11d2e;
    font-weight: 500;
    margin-top: 1px;
  }
  .staff-card-role {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-top: 4px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* ── EMPTY / ERROR ── */
  .roster-empty {
    text-align: center;
    padding: 56px 24px;
    border: 0.5px dashed rgba(0,0,0,0.15);
    border-radius: 14px;
    color: #888;
  }
  .roster-error {
    margin-bottom: 32px;
    padding: 16px 20px;
    border-radius: 10px;
    background: rgba(225,29,46,0.07);
    border: 0.5px solid rgba(225,29,46,0.2);
    color: #c0182a;
    font-size: 14px;
    font-weight: 500;
  }

  /* ── LOADING ── */
  .roster-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f4f0;
  }
  .roster-loading-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .roster-spinner {
    width: 36px;
    height: 36px;
    border: 2.5px solid rgba(0,0,0,0.08);
    border-top-color: #e11d2e;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .roster-loading-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #888;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .roster-hero-inner {
      grid-template-columns: 1fr;
      padding: 48px 20px 56px;
    }
    .roster-hero-stats {
      justify-content: flex-start;
    }
    .roster-content {
      padding: 40px 20px;
    }
    .roster-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }
    .roster-staff-inner {
      padding: 0 20px;
    }
  }
`;

export default function PublicRosterPage() {
  const { teamSlug } = useParams();

  const [roster, setRoster] = useState<PublicRosterResponse>({
    team: null,
    players: [],
    staff: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inject styles once
  useEffect(() => {
    const id = "roster-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = styles;
      document.head.appendChild(tag);
    }
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

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

  const players = Array.isArray(roster.players) ? roster.players : [];
  const staff = Array.isArray(roster.staff) ? roster.staff : [];

  const groupedPlayers = useMemo(() => groupPlayersByPosition(players), [players]);

  const sortedPositions = useMemo(() => {
    return Object.keys(groupedPlayers).sort((a, b) => {
      const ia = positionOrder.indexOf(a);
      const ib = positionOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [groupedPlayers]);

  const teamImageUrl = getBackendImageUrl(roster.team?.imageUrl || roster.team?.image);

  if (loading) {
    return (
      <div className="roster-loading">
        <div className="roster-loading-inner">
          <div className="roster-spinner" />
          <p className="roster-loading-text">Chargement de l'effectif</p>
        </div>
      </div>
    );
  }

  return (
    <main className="roster-root">
      {/* ── HERO ── */}
      <section className="roster-hero">
        {teamImageUrl && (
          <img
            src={teamImageUrl}
            alt={roster.team?.name || "Photo de l'équipe"}
            className="roster-hero-team-img"
          />
        )}
        <div className="roster-hero-inner">
          <div>
            <p className="roster-hero-eyebrow">Effectif · Saison 2025–2026</p>
            <h1 className="roster-hero-title">
              {roster.team?.name || "Effectif"}
            </h1>
            <p className="roster-hero-desc">
              Retrouvez les joueuses de l'équipe, leurs postes, numéros et
              informations principales.
            </p>
          </div>
          <div className="roster-hero-stats">
            <div className="roster-hero-stat">
              <div className="roster-hero-stat-num">{players.length}</div>
              <div className="roster-hero-stat-label">Joueuses</div>
            </div>
            <div className="roster-hero-stat">
              <div className="roster-hero-stat-num">{sortedPositions.length}</div>
              <div className="roster-hero-stat-label">Postes</div>
            </div>
            <div className="roster-hero-stat">
              <div className="roster-hero-stat-num">{staff.length}</div>
              <div className="roster-hero-stat-label">Staff</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOUEURS ── */}
      <section className="roster-content">
        {error && <div className="roster-error">{error}</div>}

        {players.length === 0 ? (
          <div className="roster-empty">
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              Aucun joueur affiché
            </p>
            <p style={{ fontSize: 14 }}>
              L'effectif de cette équipe n'est pas encore disponible.
            </p>
          </div>
        ) : (
          sortedPositions.map((position) => (
            <div className="roster-position-block" key={position}>
              <div className="roster-position-header">
                <div className="roster-position-bar" />
                <h2 className="roster-position-name">{position}</h2>
                <span className="roster-position-count">
                  {groupedPlayers[position].length}
                </span>
              </div>

              <div className="roster-grid">
                {groupedPlayers[position].map((player) => {
                  const number = getPlayerNumber(player);
                  const age =
                    player.age !== null && player.age !== undefined
                      ? player.age
                      : getAgeFromBirthDate(player.birthDate);
                  const imgSrc = getPlayerImage(player);
                  const hasRealImg = imgSrc !== defaultPlayerImage;

                  return (
                    <article className="player-card" key={player._id}>
                      <div className="player-card-img-wrap">
                        {hasRealImg ? (
                          <img
                            src={imgSrc}
                            alt={`${player.firstName ?? ""} ${player.lastName ?? ""}`}
                            className="player-card-img"
                          />
                        ) : (
                          <div className="player-card-img-placeholder">
                            {/* silhouette SVG */}
                            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="50" cy="30" r="22" fill="#111" />
                              <path d="M10 110 Q10 70 50 70 Q90 70 90 110" fill="#111" />
                            </svg>
                          </div>
                        )}
                        {number !== null && (
                          <div className="player-card-number">{number}</div>
                        )}
                      </div>
                      <div className="player-card-body">
                        <div className="player-card-last">
                          {player.lastName || ""}
                        </div>
                        <div className="player-card-first">
                          {player.firstName || ""}
                        </div>
                        {age !== null && (
                          <div className="player-card-meta">
                            <div className="player-card-meta-dot" />
                            <span className="player-card-meta-text">
                              {age} ans
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {/* ── STAFF ── */}
      <section className="roster-staff-section">
        <div className="roster-staff-inner">
          <div className="roster-staff-header">
            <div className="roster-position-bar" />
            <h2 className="roster-staff-title">Staff</h2>
            {staff.length > 0 && (
              <span
                className="roster-position-count"
                style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
              >
                {staff.length}
              </span>
            )}
          </div>

          {staff.length === 0 ? (
            <div
              className="roster-empty"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }}
            >
              <p style={{ fontSize: 16, fontWeight: 600 }}>Aucun membre du staff affiché</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>
                Le staff de cette équipe n'est pas encore disponible.
              </p>
            </div>
          ) : (
            <div className="roster-staff-grid">
              {staff.map((member) => {
                const imgSrc = getPlayerImage(member);
                const hasRealImg = imgSrc !== defaultPlayerImage;
                return (
                  <div className="staff-card" key={member._id}>
                    <div className="staff-card-avatar">
                      {hasRealImg ? (
                        <img src={imgSrc} alt={`${member.firstName ?? ""} ${member.lastName ?? ""}`} />
                      ) : (
                        getInitials(member.firstName, member.lastName)
                      )}
                    </div>
                    <div>
                      <div className="staff-card-last">{member.lastName || ""}</div>
                      <div className="staff-card-first">{member.firstName || ""}</div>
                      {member.position && (
                        <div className="staff-card-role">{member.position}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}