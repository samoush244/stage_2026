import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SiTiktok } from "react-icons/si";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import API from "../services/api";
import type { Team } from "../types/team";

type ClubInfo = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);

  const closeMobileMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const [teamsRes, clubInfoRes] = await Promise.all([
          API.get("/teams"),
          API.get("/club-info"),
        ]);

        setTeams((teamsRes.data || []) as Team[]);
        setClubInfo(clubInfoRes.data || null);
      } catch (error) {
        console.error("Erreur récupération données navbar :", error);
      }
    };

    fetchNavbarData();
  }, []);

  const activeTeams = teams.filter((team) => team.isActive !== false);

  const firstMaleTeam = activeTeams.find(
    (team) => team.teamType === "premiere" && team.gender === "masculin"
  );

  const firstFemaleTeam = activeTeams.find(
    (team) => team.teamType === "premiere" && team.gender === "feminin"
  );

  const maleTeams = activeTeams
    .filter((team) => team.teamType === "autre" && team.gender === "masculin")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const femaleTeams = activeTeams
    .filter((team) => team.teamType === "autre" && team.gender === "feminin")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const mixedTeams = activeTeams
    .filter((team) => team.teamType === "autre" && team.gender === "mixte")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const facebookUrl =
    clubInfo?.facebook || "https://www.facebook.com/redswans2016";

  const instagramUrl =
    clubInfo?.instagram ||
    "https://www.instagram.com/valenciennes_handball_club/";

  const tiktokUrl =
    clubInfo?.tiktok || "https://www.tiktok.com/@valencienneshandballclub";

  return (
    <header className="sticky top-0 z-[9999] bg-zinc-950 text-white">
      {/* Barre du haut avec réseaux sociaux */}
      <div className="border-b border-red-900 bg-zinc-950 px-8 py-2">
        <div className="mx-auto flex max-w-7xl justify-end gap-4 text-sm text-gray-200">
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition hover:text-red-500"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
          )}

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition hover:text-red-500"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
          )}

          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Tiktok"
              className="transition hover:text-red-500"
            >
              <SiTiktok className="h-5 w-5" />
            </a>
          )}

          <span className="h-5 w-px bg-zinc-700" />

          <Link to="/contact" className="hover:text-red-500">
            Contact
          </Link>
        </div>
      </div>

      <nav className="border-b border-zinc-800 px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo/VHB2.png"
              alt="Logo du club"
              className="h-[90px] w-[90px] object-contain"
            />
          </Link>

          {/* Menu desktop */}
          <div className="hidden items-center gap-5 navbar-font lg:flex">
            {/* Le club */}
            <div className="group relative">
              <button className="hover:text-red-500">LE CLUB</button>

              <div className="absolute left-0 top-full z-50 hidden min-w-56 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
                <Link
                  to="/club/histoire"
                  className="block px-3 py-2 hover:text-red-500"
                >
                  Histoire
                </Link>

                <Link
                  to="/club/organigramme"
                  className="block px-3 py-2 hover:text-red-500"
                >
                  Organigramme
                </Link>

                <Link
                  to="/club/informations-pratiques"
                  className="block px-3 py-2 hover:text-red-500"
                >
                  Informations pratiques
                </Link>

                <Link
                  to="/club/red-army-benevoles"
                  className="block px-3 py-2 hover:text-red-500"
                >
                  La Red Army & Les bénévoles
                </Link>
              </div>
            </div>

            {/* Équipe première masculine */}
            {firstMaleTeam && (
              <div className="group relative">
                <button className="hover:text-red-500">
                  {firstMaleTeam.name.toUpperCase()}
                </button>

                <div className="absolute left-0 top-full z-50 hidden w-64 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
                  {firstMaleTeam.hasRosterPage && (
                    <Link
                      to={`/equipes/${firstMaleTeam.slug}/effectif`}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Effectifs
                    </Link>
                  )}

                  {firstMaleTeam.hasResultsPage && (
                    <Link
                      to={`/equipes/${firstMaleTeam.slug}/calendrier-resultats`}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Calendrier & résultats
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Équipe première féminine */}
            {firstFemaleTeam && (
              <div className="group relative">
                <button className="hover:text-red-500">
                  {firstFemaleTeam.name.toUpperCase()}
                </button>

                <div className="absolute left-0 top-full z-50 hidden w-64 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
                  {firstFemaleTeam.hasRosterPage && (
                    <Link
                      to={`/equipes/${firstFemaleTeam.slug}/effectif`}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Effectifs
                    </Link>
                  )}

                  {firstFemaleTeam.hasResultsPage && (
                    <Link
                      to={`/equipes/${firstFemaleTeam.slug}/calendrier-resultats`}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Calendrier & résultats
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Équipes */}
            <div className="group relative">
              <button className="hover:text-red-500">ÉQUIPES</button>

              <div className="absolute left-0 top-full z-50 hidden pt-3 group-hover:block">
                <div className="w-64 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                  {/* Masculines */}
                  <div className="group/men relative">
                    <button className="flex w-full items-center justify-between px-3 py-2 text-left hover:text-red-500">
                      <span>Équipes masculines</span>
                      <span>›</span>
                    </button>

                    <div className="absolute left-full top-0 hidden pl-3 group-hover/men:block">
                      <div className="w-72 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                        {maleTeams.length > 0 ? (
                          maleTeams.map((team) => (
                            <Link
                              key={team._id}
                              to={`/equipes/${team.slug}`}
                              className="block px-3 py-2 hover:text-red-500"
                            >
                              {team.name}
                            </Link>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-zinc-400">
                            Aucune équipe masculine
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Féminines */}
                  <div className="group/women relative">
                    <button className="flex w-full items-center justify-between px-3 py-2 text-left hover:text-red-500">
                      <span>Équipes féminines</span>
                      <span>›</span>
                    </button>

                    <div className="absolute left-full top-0 hidden pl-3 group-hover/women:block">
                      <div className="w-72 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                        {femaleTeams.length > 0 ? (
                          femaleTeams.map((team) => (
                            <Link
                              key={team._id}
                              to={`/equipes/${team.slug}`}
                              className="block px-3 py-2 hover:text-red-500"
                            >
                              {team.name}
                            </Link>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-zinc-400">
                            Aucune équipe féminine
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Loisirs / mixtes */}
                  <div className="group/mixed relative">
                    <button className="flex w-full items-center justify-between px-3 py-2 text-left hover:text-red-500">
                      <span>Loisirs</span>
                      <span>›</span>
                    </button>

                    <div className="absolute left-full top-0 hidden pl-3 group-hover/mixed:block">
                      <div className="w-72 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                        {mixedTeams.length > 0 ? (
                          mixedTeams.map((team) => (
                            <Link
                              key={team._id}
                              to={`/equipes/${team.slug}`}
                              className="block px-3 py-2 hover:text-red-500"
                            >
                              {team.name}
                            </Link>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-zinc-400">
                            Aucune équipe loisir
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/actualites" className="hover:text-red-500">
              ACTUALITÉS
            </Link>

            <Link to="/billetterie" className="hover:text-red-500">
              BILLETTERIE
            </Link>

            {/* Si ta route est /login au lieu de /connexion, modifie ici */}
            <Link
              to="/connexion"
              className="rounded-md border border-red-600 px-4 py-2 text-sm font-bold uppercase text-white transition hover:bg-red-600"
            >
              Connexion
            </Link>
          </div>

          {/* Bouton mobile */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-700 text-white lg:hidden"
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="mt-4 space-y-4 border-t border-zinc-800 pt-4 lg:hidden">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                Le club
              </p>

              <div className="grid gap-2">
                <Link
                  to="/club/histoire"
                  onClick={closeMobileMenu}
                  className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                >
                  Histoire
                </Link>

                <Link
                  to="/club/organigramme"
                  onClick={closeMobileMenu}
                  className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                >
                  Organigramme
                </Link>

                <Link
                  to="/club/informations-pratiques"
                  onClick={closeMobileMenu}
                  className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                >
                  Informations pratiques
                </Link>

                <Link
                  to="/club/red-army-benevoles"
                  onClick={closeMobileMenu}
                  className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                >
                  La Red Army & Les bénévoles
                </Link>
              </div>
            </div>

            {firstMaleTeam && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {firstMaleTeam.name}
                </p>

                <div className="grid gap-2">
                  {firstMaleTeam.hasRosterPage && (
                    <Link
                      to={`/equipes/${firstMaleTeam.slug}/effectif`}
                      onClick={closeMobileMenu}
                      className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                    >
                      Effectifs
                    </Link>
                  )}

                  {firstMaleTeam.hasResultsPage && (
                    <Link
                      to={`/equipes/${firstMaleTeam.slug}/calendrier-resultats`}
                      onClick={closeMobileMenu}
                      className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                    >
                      Calendrier & résultats
                    </Link>
                  )}
                </div>
              </div>
            )}

            {firstFemaleTeam && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {firstFemaleTeam.name}
                </p>

                <div className="grid gap-2">
                  {firstFemaleTeam.hasRosterPage && (
                    <Link
                      to={`/equipes/${firstFemaleTeam.slug}/effectif`}
                      onClick={closeMobileMenu}
                      className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                    >
                      Effectifs
                    </Link>
                  )}

                  {firstFemaleTeam.hasResultsPage && (
                    <Link
                      to={`/equipes/${firstFemaleTeam.slug}/calendrier-resultats`}
                      onClick={closeMobileMenu}
                      className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                    >
                      Calendrier & résultats
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                Équipes masculines
              </p>

              <div className="grid gap-2">
                {maleTeams.map((team) => (
                  <Link
                    key={team._id}
                    to={`/equipes/${team.slug}`}
                    onClick={closeMobileMenu}
                    className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                  >
                    {team.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                Équipes féminines
              </p>

              <div className="grid gap-2">
                {femaleTeams.map((team) => (
                  <Link
                    key={team._id}
                    to={`/equipes/${team.slug}`}
                    onClick={closeMobileMenu}
                    className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                  >
                    {team.name}
                  </Link>
                ))}
              </div>
            </div>

            {mixedTeams.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Loisirs
                </p>

                <div className="grid gap-2">
                  {mixedTeams.map((team) => (
                    <Link
                      key={team._id}
                      to={`/equipes/${team.slug}`}
                      onClick={closeMobileMenu}
                      className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
                    >
                      {team.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-2 border-t border-zinc-800 pt-4">
              <Link
                to="/actualites"
                onClick={closeMobileMenu}
                className="rounded-md bg-zinc-900 px-4 py-3 hover:text-red-500"
              >
                Actualités
              </Link>

              <Link
                to="/billetterie"
                onClick={closeMobileMenu}
                className="rounded-md bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
              >
                Billetterie
              </Link>

              <Link
                to="/connexion"
                onClick={closeMobileMenu}
                className="rounded-md border border-red-600 px-4 py-3 font-bold text-white hover:bg-red-600"
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;