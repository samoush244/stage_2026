import { useEffect, useState } from "react";
import { Link } from "react-router";
import API from "../../services/api";

type Team = {
  _id: string;
  name?: string;
  nom?: string;
  category?: string;
  niveau?: string;
  gender?: string;
  image?: string;
};

export default function CoachTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoachTeams();
  }, []);

  const fetchCoachTeams = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await API.get<Team[]>("/teams/my-teams");

      setTeams(res.data);
    } catch (err) {
      console.log(err);
      setError(
        "Impossible de récupérer les équipes du coach pour le moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((team) => {
    const teamName = team.name || team.nom || "";
    return teamName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Espace coach
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Mes équipes
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Retrouvez les équipes qui vous sont assignées pour gérer les matchs
              et les convocations.
            </p>
          </div>

          <input
            type="text"
            placeholder="Rechercher une équipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 md:w-80"
          />
        </div>

        {loading ? (
          <p className="text-zinc-400">Chargement des équipes...</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-zinc-400">
              Aucune équipe ne vous est assignée pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeams.map((team) => {
              const teamName = team.name || team.nom || "Équipe sans nom";

              return (
                <Link
                  key={team._id}
                  to={`/coach/equipes/${team._id}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-red-500"
                >
                  {team.image ? (
                    <img
                      src={team.image}
                      alt={teamName}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-zinc-800 text-5xl">
                      🤾
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-2xl font-black group-hover:text-red-500">
                      {teamName}
                    </h2>

                    <div className="mt-3 space-y-1 text-sm text-zinc-400">
                      {team.category && <p>Catégorie : {team.category}</p>}
                      {team.niveau && <p>Niveau : {team.niveau}</p>}
                      {team.gender && <p>Genre : {team.gender}</p>}
                    </div>

                    <span className="mt-5 inline-block text-sm font-bold text-red-500">
                      Gérer cette équipe →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}