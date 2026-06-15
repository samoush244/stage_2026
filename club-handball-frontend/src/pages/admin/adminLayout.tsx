import { Link, Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="flex">
        <aside className="min-h-screen w-64 bg-zinc-950 text-white">
          <div className="border-b border-zinc-800 p-6">
            <h1 className="text-xl font-bold">Admin VHB</h1>
            <p className="text-sm text-zinc-400">Tableau de bord</p>
          </div>

          <nav className="space-y-1 p-4 text-sm">
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin">
              Accueil admin
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/actualites">
              Actualités
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/equipes">
              Équipes
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/joueurs">
              Joueurs
            </Link>
            
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/partenaires">
              Partenaires
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/infos-club">
              Infos club
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/evenements">
              Événements
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/organigramme">
              Organigramme
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/newsletter">
              Newsletter
            </Link>
            <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/contact-messages">
              Messages contact
              </Link>
              <Link className="block rounded px-4 py-2 hover:bg-red-600" to="/admin/histoire">
              Histoire du Club
              </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
