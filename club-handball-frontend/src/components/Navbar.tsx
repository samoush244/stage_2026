import { useState } from "react";
import { Link } from "react-router";
import {SiTiktok} from "react-icons/si";
import { FaFacebook, FaInstagram } from "react-icons/fa";
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMenuOpen(false);
  return (
    <header className=" sticky top-0 z-[9999] bg-zinc-950 text-white">
          <div className="border-b border-red-900 bg-zinc-950 px-8 py-2">
        <div className="mx-auto flex max-w-7xl justify-end gap-4 text-sm text-gray-20 ">
          <Link to="https://www.facebook.com/redswans2016" aria-label="Facebook" className="transition hover:text-red-500">
          <FaFacebook className="h-5 w-5" />
          </Link>
          <Link to="https://www.instagram.com/valenciennes_handball_club/" aria-label="Instagram" className="transition hover:text-red-500">
          <FaInstagram className="h-5 w-5" />
          </Link>
          <Link to="" aria-label="Tiktok" className="transition hover:text-red-500">
          <SiTiktok className="h-5 w-5" />
          </Link>

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
        {/* --- IGNORE ---
        <div className="text-2xl font-bold navbar-font hover:text-red-500">
        <span>Valenciennes </span>
        <span>Handball </span>
        <span>Club</span>
      </div>*/}

            </Link>
               {/* Desktop menu */}
          <div className="hidden items-center gap-5 navbar-font lg:flex">
            <div className="group relative">
              <button className="hover:text-red-500">LE CLUB</button>

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
               NATIONALE 3 MASCULINE
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
                NATIONALE 3 FÉMININE
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
              <button className="hover:text-red-500">ÉQUIPES</button>

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
              ACTUALITES
            </Link>

            <Link
              to="/billetterie"
              className="rounded bg-red-600 px-6 py-3 hover:bg-red-700"
            >
              BILLETERIE
            </Link>

            <a
              href="#"
              className="rounded-full border border-zinc-700 px-6 py-3 hover:border-red-500 hover:text-red-500"
            >
             CONNEXION
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
            <div className="flex flex-col gap-2 text-base navbar-font">
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