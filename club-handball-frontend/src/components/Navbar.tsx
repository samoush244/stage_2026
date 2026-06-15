import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SiTiktok } from "react-icons/si";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import API from "../services/api";
import type { Team } from "../types/team";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openTeamCategory, setOpenTeamCategory] = useState<string | null>(null);
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  const closeMobileMenu = () => setIsMenuOpen(false);

  const closeDesktopMenus = () => {
    setOpenDropdown(null);
    setOpenTeamCategory(null);
  };

  const toggleDropdown = (menuName: string) => {
    // Sur ordinateur avec souris, on garde le hover.
    // Donc le clic ne sert que pour tablette/tactile.
    if (isHoverDevice) return;

    setOpenDropdown((currentMenu) =>
      currentMenu === menuName ? null : menuName
    );

    setOpenTeamCategory(null);
  };

  const toggleTeamCategory = (categoryName: string) => {
    if (isHoverDevice) return;

    setOpenTeamCategory((currentCategory) =>
      currentCategory === categoryName ? null : categoryName
    );
  };

  const getDropdownClass = (menuName: string) => {
    return `
      absolute left-0 top-full z-50 mt-3 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl
      hidden
      ${isHoverDevice ? "group-hover:block" : ""}
      ${!isHoverDevice && openDropdown === menuName ? "block" : ""}
    `;
  };

  const getSubDropdownClass = (categoryName: string) => {
    return `
      absolute left-full top-0 z-50 pl-3
      hidden
      ${isHoverDevice ? "group-hover/men:block group-hover/women:block group-hover/mixed:block" : ""}
      ${!isHoverDevice && openTeamCategory === categoryName ? "block" : ""}
    `;
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await API.get("/teams");
        const teamsData = (res.data || []) as Team[];

        setTeams(teamsData);
      } catch (error) {
        console.error("Erreur récupération équipes navbar :", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateHoverDevice = () => {
      setIsHoverDevice(mediaQuery.matches);
    };

    updateHoverDevice();

    mediaQuery.addEventListener("change", updateHoverDevice);

    return () => {
      mediaQuery.removeEventListener("change", updateHoverDevice);
    };
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
    .sort((a, b) => a.order - b.order);

  const femaleTeams = activeTeams
    .filter((team) => team.teamType === "autre" && team.gender === "feminin")
    .sort((a, b) => a.order - b.order);

  const mixedTeams = activeTeams
    .filter((team) => team.teamType === "autre" && team.gender === "mixte")
    .sort((a, b) => a.order - b.order);

  return (
    <header className="sticky top-0 z-[9999] bg-zinc-950 text-white">
      <div className="border-b border-red-900 bg-zinc-950 px-8 py-2">
        <div className="mx-auto flex max-w-7xl justify-end gap-4 text-sm text-gray-200">
          <a
            href="https://www.facebook.com/redswans2016"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="transition hover:text-red-500"
          >
            <FaFacebook className="h-5 w-5" />
          </a>

          <a
            href="https://www.instagram.com/valenciennes_handball_club/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="transition hover:text-red-500"
          >
            <FaInstagram className="h-5 w-5" />
          </a>

          <a
            href="https://www.tiktok.com/@valencienneshandballclub"
            aria-label="Tiktok"
            className="transition hover:text-red-500"
          >
            <SiTiktok className="h-5 w-5" />
          </a>

          <span className="h-5 w-px bg-zinc-700" />

          <Link to="/contact" className="hover:text-red-500">
            Contact
          </Link>
        </div>
      </div>

      <nav className="border-b border-zinc-800 px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo/VHB2.png"
              alt="Logo du club"
              className="h-22.5 w-22.5 object-contain"
            />
          </Link>

          {/* Desktop / tablette large */}
          <div className="hidden items-center gap-5 navbar-font lg:flex">
            {/* LE CLUB */}
            <div className="group relative">
              <button
                type="button"
                onClick={() => toggleDropdown("club")}
                className="hover:text-red-500"
              >
                LE CLUB
              </button>

              <div className={`${getDropdownClass("club")} w-72`}>
                <Link
                  to="/club/histoire"
                  onClick={closeDesktopMenus}
                  className="block px-3 py-2 hover:text-red-500"
                >
                  Histoire
                </Link>

                <Link
                  to="/club/organigramme"
                  onClick={closeDesktopMenus}
                  className="block px-3 py-2 hover:text-red-500"
                >
                  Organigramme
                </Link>

                <Link
                  to="/club/informations-pratiques"
                  onClick={closeDesktopMenus}
                  className="block px-3 py-2 hover:text-red-500"
                >
                  Informations pratiques
                </Link>

                <Link
                  to="/club/red-army-benevoles"
                  onClick={closeDesktopMenus}
                  className="block px-3 py-2 hover:text-red-500"
                >
                  La Red Army & Les bénévoles
                </Link>
              </div>
            </div>

            {/* ÉQUIPE PREMIÈRE MASCULINE */}
            {firstMaleTeam && (
              <div className="group relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("firstMaleTeam")}
                  className="hover:text-red-500"
                >
                  {firstMaleTeam.name.toUpperCase()}
                </button>

                <div className={`${getDropdownClass("firstMaleTeam")} w-60`}>
                  {firstMaleTeam.hasRosterPage && (
                    <Link
                      to={`/equipes/${firstMaleTeam.slug}/effectif`}
                      onClick={closeDesktopMenus}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Effectifs
                    </Link>
                  )}

                  {firstMaleTeam.hasResultsPage && (
                    <Link
                      to={`/equipes/${firstMaleTeam.slug}/calendrier-resultats`}
                      onClick={closeDesktopMenus}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Calendrier & résultats
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* ÉQUIPE PREMIÈRE FÉMININE */}
            {firstFemaleTeam && (
              <div className="group relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("firstFemaleTeam")}
                  className="hover:text-red-500"
                >
                  {firstFemaleTeam.name.toUpperCase()}
                </button>

                <div className={`${getDropdownClass("firstFemaleTeam")} w-60`}>
                  {firstFemaleTeam.hasRosterPage && (
                    <Link
                      to={`/equipes/${firstFemaleTeam.slug}/effectif`}
                      onClick={closeDesktopMenus}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Effectifs
                    </Link>
                  )}

                  {firstFemaleTeam.hasResultsPage && (
                    <Link
                      to={`/equipes/${firstFemaleTeam.slug}/calendrier-resultats`}
                      onClick={closeDesktopMenus}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Calendrier & résultats
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* ÉQUIPES */}
            <div className="group relative">
              <button
                type="button"
                onClick={() => toggleDropdown("equipes")}
                className="hover:text-red-500"
              >
                ÉQUIPES
              </button>

              <div className={`${getDropdownClass("equipes")} w-64`}>
                {/* Masculines */}
                <div className="group/men relative">
                  <button
                    type="button"
                    onClick={() => toggleTeamCategory("men")}
                    className="flex w-full items-center justify-between px-3 py-2 text-left hover:text-red-500"
                  >
                    <span>Équipes masculines</span>
                    <span>›</span>
                  </button>

                  <div className={getSubDropdownClass("men")}>
                    <div className="w-72 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                      {maleTeams.length > 0 ? (
                        maleTeams.map((team) => (
                          <Link
                            key={team._id}
                            to={`/equipes/${team.slug}`}
                            onClick={closeDesktopMenus}
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
                  <button
                    type="button"
                    onClick={() => toggleTeamCategory("women")}
                    className="flex w-full items-center justify-between px-3 py-2 text-left hover:text-red-500"
                  >
                    <span>Équipes féminines</span>
                    <span>›</span>
                  </button>

                  <div className={getSubDropdownClass("women")}>
                    <div className="w-72 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                      {femaleTeams.length > 0 ? (
                        femaleTeams.map((team) => (
                          <Link
                            key={team._id}
                            to={`/equipes/${team.slug}`}
                            onClick={closeDesktopMenus}
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

                {/* Loisirs */}
                <div className="group/mixed relative">
                  <button
                    type="button"
                    onClick={() => toggleTeamCategory("mixed")}
                    className="flex w-full items-center justify-between px-3 py-2 text-left hover:text-red-500"
                  >
                    <span>Loisirs</span>
                    <span>›</span>
                  </button>

                  <div className={getSubDropdownClass("mixed")}>
                    <div className="w-72 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
                      {mixedTeams.length > 0 ? (
                        mixedTeams.map((team) => (
                          <Link
                            key={team._id}
                            to={`/equipes/${team.slug}`}
                            onClick={closeDesktopMenus}
                            className="block px-3 py-2 hover:text-red-500"
                          >
                            {team.name}
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-zinc-400">
                          Aucune équipe loisirs
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/actualites"
              onClick={closeDesktopMenus}
              className="hover:text-red-500"
            >
              ACTUALITÉS
            </Link>

            <Link
              to="/billetterie"
              onClick={closeDesktopMenus}
              className="rounded bg-red-600 px-6 py-3 hover:bg-red-700"
            >
              BILLETTERIE
            </Link>
          </div>

          {/* Bouton mobile */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded border border-zinc-700 px-4 py-2 text-2xl font-bold hover:border-red-500 hover:text-red-500 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mx-auto mt-5 max-w-7xl border-t border-zinc-800 pt-5 lg:hidden">
            <div className="flex flex-col gap-2 text-base navbar-font">
              <details className="rounded-lg bg-zinc-950 p-4">
                <summary className="cursor-pointer hover:text-red-500">
                  Le club
                </summary>

                <div className="mt-3 flex flex-col gap-3 pl-3 text-gray-200">
                  <Link
                    to="/club/histoire"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Histoire
                  </Link>

                  <Link
                    to="/club/organigramme"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Organigramme
                  </Link>

                  <Link
                    to="/club/informations-pratiques"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Informations pratiques
                  </Link>

                  <Link
                    to="/club/red-army-benevoles"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    La Red Army & Les bénévoles
                  </Link>
                </div>
              </details>

              {firstMaleTeam && (
                <details className="rounded-lg bg-zinc-950 p-4">
                  <summary className="cursor-pointer hover:text-red-500">
                    {firstMaleTeam.name}
                  </summary>

                  <div className="mt-3 flex flex-col gap-3 pl-3 text-gray-200">
                    {firstMaleTeam.hasRosterPage && (
                      <Link
                        to={`/equipes/${firstMaleTeam.slug}/effectif`}
                        onClick={closeMobileMenu}
                        className="hover:text-red-500"
                      >
                        Effectifs
                      </Link>
                    )}

                    {firstMaleTeam.hasResultsPage && (
                      <Link
                        to={`/equipes/${firstMaleTeam.slug}/calendrier-resultats`}
                        onClick={closeMobileMenu}
                        className="hover:text-red-500"
                      >
                        Calendrier & résultats
                      </Link>
                    )}
                  </div>
                </details>
              )}

              {firstFemaleTeam && (
                <details className="rounded-lg bg-zinc-950 p-4">
                  <summary className="cursor-pointer hover:text-red-500">
                    {firstFemaleTeam.name}
                  </summary>

                  <div className="mt-3 flex flex-col gap-3 pl-3 text-gray-200">
                    {firstFemaleTeam.hasRosterPage && (
                      <Link
                        to={`/equipes/${firstFemaleTeam.slug}/effectif`}
                        onClick={closeMobileMenu}
                        className="hover:text-red-500"
                      >
                        Effectifs
                      </Link>
                    )}

                    {firstFemaleTeam.hasResultsPage && (
                      <Link
                        to={`/equipes/${firstFemaleTeam.slug}/calendrier-resultats`}
                        onClick={closeMobileMenu}
                        className="hover:text-red-500"
                      >
                        Calendrier & résultats
                      </Link>
                    )}
                  </div>
                </details>
              )}

              <details className="rounded-lg bg-zinc-950 p-4">
                <summary className="cursor-pointer hover:text-red-500">
                  Équipes
                </summary>

                <div className="mt-3 flex flex-col gap-5 pl-3 text-gray-200">
                  <div>
                    <p className="font-bold text-red-500">
                      Équipes masculines
                    </p>

                    <div className="mt-2 flex flex-col gap-2 pl-3 text-gray-400">
                      {maleTeams.length > 0 ? (
                        maleTeams.map((team) => (
                          <Link
                            key={team._id}
                            to={`/equipes/${team.slug}`}
                            onClick={closeMobileMenu}
                            className="block py-1 hover:text-red-500"
                          >
                            {team.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500">
                          Aucune équipe masculine
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-red-500">
                      Équipes féminines
                    </p>

                    <div className="mt-2 flex flex-col gap-2 pl-3 text-gray-400">
                      {femaleTeams.length > 0 ? (
                        femaleTeams.map((team) => (
                          <Link
                            key={team._id}
                            to={`/equipes/${team.slug}`}
                            onClick={closeMobileMenu}
                            className="block py-1 hover:text-red-500"
                          >
                            {team.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500">
                          Aucune équipe féminine
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-red-500">Loisirs</p>

                    <div className="mt-2 flex flex-col gap-2 pl-3 text-gray-400">
                      {mixedTeams.length > 0 ? (
                        mixedTeams.map((team) => (
                          <Link
                            key={team._id}
                            to={`/equipes/${team.slug}`}
                            onClick={closeMobileMenu}
                            className="block py-1 hover:text-red-500"
                          >
                            {team.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500">
                          Aucune équipe loisirs
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </details>

              <Link
                to="/actualites"
                onClick={closeMobileMenu}
                className="rounded-lg bg-zinc-950 p-4 hover:text-red-500"
              >
                Actualités
              </Link>

              <Link
                to="/billetterie"
                onClick={closeMobileMenu}
                className="rounded-lg bg-red-600 p-4 text-center font-bold hover:bg-red-700"
              >
                Billetterie
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;