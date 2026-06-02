import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function CoachDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Espace coach
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Bienvenue {user?.firstName}
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Retrouvez ici vos équipes, vos matchs et les convocations à gérer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/coach/equipes"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-red-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-2xl">
              🤾
            </div>

            <h2 className="text-2xl font-black group-hover:text-red-500">
              Mes équipes
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Voir les équipes qui vous sont assignées et accéder à leur gestion.
            </p>

            <span className="mt-5 inline-block text-sm font-bold text-red-500">
              Accéder →
            </span>
          </Link>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 opacity-70">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
              📅
            </div>

            <h2 className="text-2xl font-black">Matchs</h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Les matchs seront gérés depuis chaque équipe.
            </p>

            <span className="mt-5 inline-block text-sm font-bold text-zinc-500">
              Via Mes équipes
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 opacity-70">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
              📋
            </div>

            <h2 className="text-2xl font-black">Convocations</h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Les convocations seront créées depuis les matchs des équipes.
            </p>

            <span className="mt-5 inline-block text-sm font-bold text-zinc-500">
              Via les matchs
            </span>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-bold">Informations du compte</h2>

          <div className="mt-4 grid gap-4 text-sm text-zinc-400 md:grid-cols-3">
            <p>
              <span className="block font-bold text-white">Nom</span>
              {user?.lastName}
            </p>

            <p>
              <span className="block font-bold text-white">Prénom</span>
              {user?.firstName}
            </p>

            <p>
              <span className="block font-bold text-white">Email</span>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-xl border border-red-500 px-5 py-3 font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
        >
          Se déconnecter
        </button>
      </div>
    </main>
  );
}