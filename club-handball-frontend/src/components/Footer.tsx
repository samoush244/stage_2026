

function Footer() {

  return (
    <footer className="bg-black px-8 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-extrabold text-red-600">
            Club Handball
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Site officiel du club : actualités, équipes, matchs, billetterie,
            informations pratiques et vie associative.
          </p>
        </div>

        <div>
          <h3 className="font-bold uppercase text-white">Le club</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-red-500">
                Histoire
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                Organigramme
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                Informations pratiques
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                Partenaires
              </a>
            </li>
          </ul>
        </div>
    </div>
        <div>
          <h3 className="font-bold uppercase text-white">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>Email : contact@club-handball.fr</li>
            <li>Téléphone : 00 00 00 00 00</li>
            <li>Adresse : Gymnase du club</li>
          </ul>

          <div className="mt-4 flex gap-3 text-sm">
            <a href="https://www.facebook.com/redswans2016" className="hover:text-red-500">
              Facebook
            </a>
            <a href="https://www.instagram.com/valenciennes_handball_club/" className="hover:text-red-500">
              Instagram
            </a>
          </div>
        </div>


      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-zinc-800 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Club Handball. Tous droits réservés.</p>

        <div className="flex gap-4">
          <a href="#" className="hover:text-red-500">
            Mentions légales
          </a>
          <a href="#" className="hover:text-red-500">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;