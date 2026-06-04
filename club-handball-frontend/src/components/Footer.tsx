import { Link } from "react-router";
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-white overflow-hidden">

      {/* Ligne rouge décorative en haut */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      {/* Bande supérieure — logo + réseaux sociaux */}
      <div className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-8 md:flex-row">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src="/images/logo/VHB2.png"
              alt="Logo Valenciennes Handball Club"
              className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">Club officiel</p>
              <p className="text-lg font-black uppercase tracking-wide text-white leading-tight">
                Valenciennes<br />
                <span className="text-red-600">Handball Club</span>
              </p>
            </div>
          </Link>

          {/* Réseaux sociaux */}
          <div className="flex items-center gap-4">
            <span className="hidden text-xs uppercase tracking-widest text-zinc-500 md:block">
              Suivez-nous
            </span>
            <div className="h-px w-8 bg-red-600 hidden md:block" />
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/redswans2016"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white hover:scale-110"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/valenciennes_handball_club/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white hover:scale-110"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@valencienneshandballclub"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white hover:scale-110"
              >
                <SiTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Corps principal */}
      <div className="mx-auto grid max-w-7xl gap-10 px-8 py-12 md:grid-cols-3">

        {/* Colonne 1 — Description */}
        <div>
          <div className="mb-1 h-0.5 w-10 bg-red-600" />
          <h3 className="mt-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
            Le club
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Site officiel du Valenciennes Handball Club : actualités, équipes,
            matchs, billetterie, informations pratiques et vie associative.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            {[
              { label: "Histoire", to: "/club/histoire" },
              { label: "Organigramme", to: "/club/organigramme" },
              { label: "Infos pratiques", to: "/club/informations-pratiques" },
              { label: "Partenaires", to: "/partenaires" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="group flex items-center gap-2 text-zinc-400 transition hover:text-red-500"
              >
                <span className="h-px w-3 bg-zinc-600 transition-all group-hover:w-4 group-hover:bg-red-500" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Colonne 2 — Équipes */}
        <div>
          <div className="mb-1 h-0.5 w-10 bg-red-600" />
          <h3 className="mt-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
            Équipes premières
          </h3>
          <div className="mt-4 space-y-3">
            <Link
              to="/n3-masculine/effectif"
              className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition-all hover:border-red-600 hover:bg-zinc-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">
                N3
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-red-400">Nationale 3 Masculine</p>
                <p className="text-xs text-zinc-500">Voir l'effectif →</p>
              </div>
            </Link>
            <Link
              to="/n3-feminine/effectif"
              className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition-all hover:border-red-600 hover:bg-zinc-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">
                N2
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-red-400">Nationale 2 Féminine</p>
                <p className="text-xs text-zinc-500">Voir l'effectif →</p>
              </div>
            </Link>
            <Link
              to="/equipes"
              className="mt-2 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-red-500"
            >
              <span>Toutes les équipes</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Colonne 3 — Contact */}
        <div>
          <div className="mb-1 h-0.5 w-10 bg-red-600" />
          <h3 className="mt-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
            Contact
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="mailto:contact@club-handball.fr"
                className="group flex items-center gap-3 text-sm text-zinc-400 transition hover:text-red-500"
              >
                <FaEnvelope className="h-4 w-4 shrink-0 text-red-600" />
                contact@club-handball.fr
              </a>
            </li>
            <li>
              <a
                href="tel:0000000000"
                className="group flex items-center gap-3 text-sm text-zinc-400 transition hover:text-red-500"
              >
                <FaPhone className="h-4 w-4 shrink-0 text-red-600" />
                00 00 00 00 00
              </a>
            </li>
            <li className="flex items-start gap-3 text-sm text-zinc-400">
              <FaMapMarkerAlt className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              Gymnase du club
            </li>
          </ul>

          {/* CTA Billetterie */}
          <Link
            to="/billetterie"
            className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-700 active:scale-95"
          >
            🎟 Billetterie
          </Link>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-8 py-5 text-xs text-zinc-600 md:flex-row">
          <p>© 2026 Valenciennes Handball Club. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link to="/mentions-legales" className="transition hover:text-red-500">
              Mentions légales
            </Link>
            <Link to="/politique-confidentialite" className="transition hover:text-red-500">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;