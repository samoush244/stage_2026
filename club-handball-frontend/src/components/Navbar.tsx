import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SiTiktok } from "react-icons/si";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import API from "../services/api";
import type { Team } from "../types/team";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  const closeMobileMenu = () => setIsMenuOpen(false);

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

const activeTeams = teams.filter((team) => team.isActive !== false);

const firstMaleTeam = activeTeams.find(
  (team) => team.teamType === "premiere"  && team.gender === "masculin"
);

const firstFemaleTeam = activeTeams.find(
  (team) => team.teamType === "premiere"  && team.gender === "feminin"
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

          {/* Desktop menu */}
          <div className="hidden items-center gap-5 navbar-font lg:flex">
            <div className="group relative">
              <button className="hover:text-red-500">LE CLUB</button>

              <div className="absolute left-0 top-full z-50 hidden rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
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

          {firstMaleTeam && (
  <div className="group relative">
    <button className="hover:text-red-500">
      {firstMaleTeam.name.toUpperCase()}
    </button>

    <div className="absolute left-0 top-full hidden w-60 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
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
            {firstFemaleTeam && (
  <div className="group relative">
    <button className="hover:text-red-500">
      {firstFemaleTeam.name.toUpperCase()}
    </button>

    <div className="absolute left-0 top-full hidden w-60 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
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
               
            <div className="group relative">
              <Link to="/equipes" className="hover:text-red-500">
                ÉQUIPES
              </Link>

              <div className="absolute left-0 top-full z-50 hidden pt-3 group-hover:block">
                <div className="w-64 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
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
                            Aucune équipe loisirs
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

            <Link
              to="/billetterie"
              className="rounded bg-red-600 px-6 py-3 hover:bg-red-700"
            >
              BILLETTERIE
            </Link>

            <Link
              to="/login"
              className="rounded-full border border-zinc-700 px-6 py-3 hover:border-red-500 hover:text-red-500"
            >
              CONNEXION
            </Link>
          </div>

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
                  <Link
                    to="/equipes"
                    onClick={closeMobileMenu}
                    className="font-semibold hover:text-red-500"
                  >
                    Voir toutes les équipes
                  </Link>

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

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-full border border-zinc-700 p-4 text-center font-bold hover:border-red-500 hover:text-red-500"
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