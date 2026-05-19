export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900">Dashboard admin</h1>
      <p className="mt-2 text-zinc-600">
        Bienvenue dans l’espace d’administration du club.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="font-semibold">Actualités</h2>
          <p className="mt-2 text-sm text-zinc-500">Gérer les articles du club.</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="font-semibold">Équipes</h2>
          <p className="mt-2 text-sm text-zinc-500">Gérer les catégories et équipes.</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="font-semibold">Matchs</h2>
          <p className="mt-2 text-sm text-zinc-500">Superviser les matchs créés.</p>
        </div>
      </div>
    </div>
  );
}