import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNewsletterMessage("Inscription réussie !");
      setEmail("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setNewsletterMessage(error.message);
      } else {
        setNewsletterMessage("Erreur lors de l'inscription.");
      }
    }
  };

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

        <div>
          <h3 className="font-bold uppercase text-white">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>Email : contact@club-handball.fr</li>
            <li>Téléphone : 00 00 00 00 00</li>
            <li>Adresse : Gymnase du club</li>
          </ul>

          <div className="mt-4 flex gap-3 text-sm">
            <a href="#" className="hover:text-red-500">
              Facebook
            </a>
            <a href="#" className="hover:text-red-500">
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold uppercase text-white">Newsletter</h3>

          <p className="mt-4 text-sm text-gray-400">
            Recevez les actualités du club, les matchs, événements et annonces
            importantes.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
             className="w-full rounded-md border border-zinc-700 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500 outline-none"
            />

            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              OK
            </button>
          </form>

          {newsletterMessage && (
            <p className="mt-2 text-sm text-gray-300">{newsletterMessage}</p>
          )}
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