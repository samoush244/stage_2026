import { Link } from "react-router";
import { useEffect, useState } from "react";
import API from "../services/api";
import type { Team } from "../types/team";
import { getImageUrl } from "../utils/getImageUrl";

interface FirstTeamPageProps {
  teamSlug: string;
}

export default function FirstTeamPage({ teamSlug }: FirstTeamPageProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get<Team>(`/teams/slug/${teamSlug}`);

        if (res.data.teamType !== "premiere") {
          setError("Cette équipe n'est pas une équipe première.");
          return;
        }

        setTeam(res.data);
      } catch (err) {
        console.error("Erreur récupération équipe première :", err);
        setError("Impossible de récupérer cette équipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamSlug]);

  if (loading) {
    return (
      <main className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xl font-bold text-zinc-600">
            Chargement de l'équipe...
          </p>
        </div>
      </main>
    );
  }

  if (error || !team) {
    return (
      <main className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xl font-bold text-red-600">
            {error || "Équipe introuvable."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
            Équipe première
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-7xl">
            {team.name}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            {team.category && (
              <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold uppercase text-white">
                {team.category}
              </span>
            )}

            {team.level && (
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold uppercase text-black">
                {team.level}
              </span>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to={`/equipes/${team.slug}/effectif`}
              className="rounded bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Voir l'effectif
            </Link>

            <Link
              to={`/equipes/${team.slug}/calendrier-resultats`}
              className="rounded bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200"
            >
              Calendrier & résultats
            </Link>
          </div>
        </div>
      </section>

      {team.image && (
        <section>
          <img
            src={getImageUrl(team.image)}
            alt={team.name}
            className="h-[520px] w-full object-cover"
          />
        </section>
      )}

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-black text-black">
            Présentation de l'équipe
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700">
            Retrouvez ici les informations de l'équipe première, son effectif,
            son calendrier et ses résultats officiels.
          </p>

          {team.ffhandballUrl && (
            <a
              href={team.ffhandballUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded bg-black px-6 py-3 font-bold text-white transition hover:bg-zinc-800"
            >
              Voir sur FFHandball
            </a>
          )}
        </div>
      </section>
    </main>
  );
}