import { useState, useEffect } from "react";
import { useLocation } from "react-router";

// ============================================================
// CONFIGURATION
// À adapter selon votre backend :
// - Remplacez l'URL de l'API par votre endpoint réel
// - La fonction subscribeToNewsletter envoie l'email à votre API
// ============================================================
const API_URL = "http://localhost:5000/api/newsletter/subscribe"; // 👈 Remplacez par votre endpoint

async function subscribeToNewsletter(email: string): Promise<void> {
  // 👇 Adaptez cette fonction à votre backend (axios, fetch, etc.)
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Erreur lors de l'inscription");
}

// ============================================================
// STORAGE KEY — clé localStorage pour mémoriser l'état
// ============================================================
const STORAGE_KEY = "rs_newsletter_v2";

type Status = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState(false);

  // Ne pas afficher sur les pages admin
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    // Ne plus afficher si déjà inscrit
    if (stored === "subscribed") return;

    // Apparaît après 2 secondes
    const timer = setTimeout(() => {
      setOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAdmin]);

  if (isAdmin) return null;

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      setFieldError(true);
      return;
    }
    setFieldError(false);
    setStatus("loading");

    try {
      await subscribeToNewsletter(email);
      setStatus("success");
      localStorage.setItem(STORAGE_KEY, "subscribed");
      // Ferme automatiquement après 3s
      setTimeout(() => setOpen(false), 3000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* ======================================================
          ONGLET LATÉRAL — toujours visible pour rouvrir
          ====================================================== */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Fermer la newsletter" : "Ouvrir la newsletter"}
        className="fixed bottom-36 right-0 z-40 flex flex-col items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white rounded-l-lg px-2.5 py-3 text-[10px] font-semibold tracking-widest uppercase transition-all duration-300"
        style={{ marginRight: open ? "300px" : "0" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        News
      </button>

      {/* ======================================================
          PANNEAU PRINCIPAL
          ====================================================== */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Inscription à la newsletter"
        className="fixed bottom-0 right-0 z-50 w-[300px] bg-neutral-900 rounded-tl-2xl p-6 shadow-2xl"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s ease",
        }}
      >
        {/* Bouton fermer (ne mémorise pas, juste cache) */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors p-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Badge */}
        <span className="inline-block bg-red-600 text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded mb-3">
          Newsletter
        </span>

        <h2 className="text-white text-lg font-semibold leading-snug mb-1">
          Restez dans la course
        </h2>
        <p className="text-neutral-400 text-xs leading-relaxed mb-4">
          Résultats, matchs, annonces — avant tout le monde.
        </p>

        {/* ---- État succès ---- */}
        {status === "success" && (
          <div className="text-center py-6">
            <div className="text-green-400 text-3xl mb-2">✓</div>
            <p className="text-white font-semibold">Bienvenue dans la famille</p>
            <p className="text-red-500 font-bold">Red Snakes !</p>
          </div>
        )}

        {/* ---- Formulaire ---- */}
        {status !== "success" && (
          <>
            <ul className="space-y-1.5 mb-4">
              {[
                { icon: "🏆", text: "Résultats en avant-première" },
                { icon: "📅", text: "Prochains matchs" },
                { icon: "📢", text: "Annonces du club" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-neutral-300 text-xs">
                  <span>{icon}</span>{text}
                </li>
              ))}
            </ul>

            <input
              type="email"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldError(false); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={`w-full bg-neutral-800 text-white text-sm placeholder-neutral-500 rounded-md px-3 h-10 outline-none mb-2 border transition-colors ${
                fieldError ? "border-red-500" : "border-neutral-600 focus:border-red-500"
              }`}
            />

            {fieldError && (
              <p className="text-red-500 text-[11px] -mt-1 mb-2">Adresse email invalide</p>
            )}

            {status === "error" && (
              <p className="text-red-500 text-[11px] mb-2">
                Une erreur est survenue, réessayez.
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm rounded-md h-10 transition-colors"
            >
              {status === "loading" ? "Inscription..." : "Je m'inscris"}
            </button>

            <p className="text-neutral-600 text-[10px] text-center mt-2">
              Pas de spam. Désabonnement en un clic.
            </p>
          </>
        )}
      </div>
    </>
  );
}