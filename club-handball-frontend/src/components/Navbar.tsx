import { useState } from "react";
import { Link } from "react-router";
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMenuOpen(false);
  return (
    <header className=" sticky top-0 z-[9999] bg-zinc-950 text-white">
          <div className="border-b border-red-900 bg-zinc-950 px-8 py-2">
        <div className="mx-auto flex max-w-7xl justify-end gap-4 text-sm text-gray-20 ">
          <Link to="https://www.facebook.com/redswans2016" aria-label="Facebook" className="transition hover:text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5v2h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
            </svg>
          </Link>
          <a
    href="#"
    aria-label="Instagram"
    className="transition hover:text-red-500"
  >
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  </a>

  <span className="h-5 w-px bg-zinc-700" />
          <Link to="/contact" className="hover:text-red-500">
            Contact
          </Link>
        </div>
      </div>
    
      <nav className="border-b border-zinc-800 px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to ="/" className="flex items-center gap-3">
            <img
              src="/images/logo/VHB.png"
              alt="Logo du club"
              className="h-20 w-20 object-contain"
            />


            </Link>
               {/* Desktop menu */}
          <div className="hidden items-center gap-6 text-sm font-bold lg:flex">
            <div className="group relative">
              <button className="hover:text-red-500">Le club</button>

              <div className="absolute left-0 top-full hidden z-50 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
                <Link to ="/club/histoire" className="block px-3 py-2 hover:text-red-500">
                  Histoire
                </Link>
                <Link to="/club/organigramme" className="block px-3 py-2 hover:text-red-500">
                  Organigramme
                </Link>
                <Link to="/club/informations-pratiques" className="block px-3 py-2 hover:text-red-500">
                  Informations pratiques
                </Link>
                <Link to="/club/red-army-benevoles" className="block px-3 py-2 hover:text-red-500">
                  La Red Army & Les bénévoles
                </Link>
              </div>
            </div>

            <div className="group relative">
              <button className="hover:text-red-500">
                Nationale 3 masculine
              </button>

              <div className="absolute left-0 top-full hidden w-60 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
                <Link to="/n3-masculine/effectif" className="block px-3 py-2 hover:text-red-500">
                  Effectifs
                </Link>
                <Link to="/n3-masculine/calendrier-resultats"className="block px-3 py-2 hover:text-red-500">
                    Calendrier & résultats
                </Link>
              </div>
            </div>

            <div className="group relative">
              <button className="hover:text-red-500">
                Nationale 2 féminine
              </button>

              <div className="absolute left-0 top-full hidden w-60 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl group-hover:block">
                <Link to="/n3-feminine/effectif" className="block px-3 py-2 hover:text-red-500">
                  Effectifs
                </Link>
                <Link to="/n3-feminine/calendrier-resultats"className="block px-3 py-2 hover:text-red-500">
                    Calendrier & résultats
                </Link>
              </div>
            </div>

            <div className="group relative">
              <button className="hover:text-red-500">Équipes</button>

               <div className="absolute left-0 top-full z-50 hidden pt-3 group-hover:block">
              <div className="w-64 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
               <div className="group/men relative">
              <button className="flex w-full items-center justify-between px-3 py-2 text-left hover:text-red-500">
              <span>Équipes masculines</span>
              <span>›</span>
              </button>

        <div className="absolute left-full top-0 hidden pl-3 group-hover/men:block">
          <div className="w-72 rounded-md border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
            <Link
              to="/equipes/honneur-regional-masculin"
              className="block px-3 py-2 hover:text-red-500"
            >
              Honneur régional
            </Link>

            <Link
              to="/equipes/u18-masculins-region"
              className="block px-3 py-2 hover:text-red-500"
            >
              U18 masculins Region
            </Link>

            <Link
              to="/equipes/u15-masculins-region"
              className="block px-3 py-2 hover:text-red-500"
            >
              U15 masculins Region
            </Link>
            
            <Link
              to="/equipes/u15-masculins-depart"
              className="block px-3 py-2 hover:text-red-500"
            >
              U15 masculins Depart
            </Link>
            <Link
              to="/equipes/u13-masculins"
              className="block px-3 py-2 hover:text-red-500"
            >
              U13 masculins
            </Link>

            <Link
              to="/equipes/u11-mixte"
              className="block px-3 py-2 hover:text-red-500"
            >
              U11 mixte
            </Link>
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
            <Link
              to="/equipes/departementale-feminin"
              className="block px-3 py-2 hover:text-red-500"
            >
              1ère division départementale
            </Link>

            <Link
              to="/equipes/u18-feminines-depart"
              className="block px-3 py-2 hover:text-red-500"
            >
              U18 féminines Depart
            </Link>

            <Link
              to="/equipes/u15-feminines"
              className="block px-3 py-2 hover:text-red-500"
            >
              U15 féminines Depart
            </Link>
          </div>
        </div>
      </div>
      <Link
        to="/equipes/loisirs"
        className="block px-3 py-2 hover:text-red-500"
      >
        Loisirs
      </Link>
    </div>
  </div>
</div>

            <Link to="/actualites" className="hover:text-red-500">
              Actualités
            </Link>

            <Link
              to="/billetterie"
              className="rounded bg-red-600 px-6 py-3 hover:bg-red-700"
            >
              Billetterie
            </Link>

            <a
              href="#"
              className="rounded-full border border-zinc-700 px-6 py-3 hover:border-red-500 hover:text-red-500"
            >
              Connexion
            </a>
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
            <div className="flex flex-col gap-2 text-base font-semibold">
              <details className="rounded-lg bg-zinc-950 p-4">
                <summary className="cursor-pointer hover:text-red-500">
                  Le club
                </summary>

                 <div className="mt-3 flex flex-col gap-3 pl-3 text-gray-20 ">
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

              <details className="rounded-lg bg-zinc-950 p-4">
                <summary className="cursor-pointer hover:text-red-500">
                  Nationale 3 masculine
                </summary>

                <div className="mt-3 flex flex-col gap-3 pl-3 text-gray-20 ">
                  <Link
                    to="/n3-masculine/effectif"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Effectifs
                  </Link>

                  <Link
                    to="/n3-masculine/calendrier-resultats"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Calendrier & résultats
                  </Link>
                </div>
              </details>

              <details className="rounded-lg bg-zinc-950 p-4">
                <summary className="cursor-pointer hover:text-red-500">
                  Nationale 2 féminine
                </summary>

                <div className="mt-3 flex flex-col gap-3 pl-3 text-gray-20 ">
                  <Link
                    to="/n3-feminine/effectif"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Effectifs
                  </Link>

                  <Link
                    to="/n3-feminine/calendrier-resultats"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Calendrier & résultats
                  </Link>
                </div>
              </details>

              <details className="rounded-lg bg-zinc-950 p-4">
                <summary className="cursor-pointer hover:text-red-500">
                  Équipes
                </summary>

                <div className="mt-3 flex flex-col gap-3 pl-3 text-gray-20 ">
                  <Link
                    to="#"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Équipes masculines
                  </Link>
                  <div className="ml-3 mt-2 flex flex-col gap-2 pl-3 text-gray-400">
                    <Link
                      to="/equipes/honneur-regional-masculin"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      Honneur régional
                    </Link>

                    <Link
                      to="/equipes/u18-masculins-region"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      U18 masculins Region
                    </Link>

                    <Link
                      to="/equipes/u15-masculins-region"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      U15 masculins Region
                    </Link>
                    
                    <Link
                      to="/equipes/u15-masculins-depart"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      U15 masculins Depart
                    </Link>
                    <Link
                      to="/equipes/u13-masculins"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      U13 masculins
                    </Link>

                    <Link
                      to="/equipes/u11-mixte"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      U11 mixte
                    </Link>
                  </div>

                  <Link
                    to="#"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Équipes féminines
                  </Link>
                  <div className="ml-3 mt-2 flex flex-col gap-2 pl-3 text-gray-400">
                    <Link
                      to="/equipes/departementale-feminin"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      1ère division départementale
                    </Link>

                    <Link
                      to="/equipes/u18-feminines-depart"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      U18 féminines Depart
                    </Link>

                    <Link
                      to="/equipes/u15-feminines"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 hover:text-red-500"
                    >
                      U15 féminines Depart
                    </Link>
                  </div>
                  <Link
                    to="#"
                    onClick={closeMobileMenu}
                    className="hover:text-red-500"
                  >
                    Loisirs
                  </Link>
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
                to="#"
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