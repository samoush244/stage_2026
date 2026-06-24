import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import API from "../services/api";
import type { Team } from "../types/team";
import { getImageUrl } from "../utils/getImageUrl";

function TeamDetailPage() {
  const { teamSlug } = useParams();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamSlug) {
        setError("Slug de l'équipe manquant.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/teams/slug/${teamSlug}`);
        const teamData = res.data as Team;

        if (teamData.teamType !== "autre") {
          setError("Cette page est réservée aux autres équipes.");
          setTeam(null);
          return;
        }

        setTeam(teamData);
      } catch (err) {
        console.error("Erreur récupération équipe :", err);
        setError("Impossible de récupérer cette équipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamSlug]);

  if (loading) {
    return (
      <main className="bg-white px-8 py-20 text-black">
        <div className="mx-auto max-w-7xl">
          <p className="text-xl font-bold text-gray-600">
            Chargement de l'équipe...
          </p>
        </div>
      </main>
    );
  }

  if (error || !team) {
    return (
      <main className="bg-white px-8 py-20 text-black">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-extrabold">Équipe introuvable</h1>

          <p className="mt-4 text-gray-600">
            {error ||
              "Cette équipe n’existe pas encore ou le lien est incorrect."}
          </p>

          <Link
            to="/equipes"
            className="mt-8 inline-block rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Retour aux équipes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            {team.category || "Équipe du club"}
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">{team.name}</h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
            Retrouvez les informations principales de cette équipe, sa photo et
            le lien vers la page officielle FFHandball pour consulter le
            calendrier, les résultats et le classement.
          </p>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-zinc-100 shadow-sm">
            {team.image ? (
              <img
                src={getImageUrl(team.image)}
                alt={team.name}
                className="h-auto w-full object-contain"
              />
            ) : (
              <div className="flex h-96 items-center justify-center bg-gradient-to-br from-red-700 via-black to-black text-white">
                <p className="text-2xl font-extrabold uppercase">
                  Photo équipe
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
              Équipe
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">{team.name}</h2>

            <div className="mt-5 space-y-2 text-gray-700">
              {team.category && (
                <p>
                  <span className="font-bold">Catégorie :</span>{" "}
                  {team.category}
                </p>
              )}

              {team.level && (
                <p>
                  <span className="font-bold">Niveau :</span> {team.level}
                </p>
              )}

              <p>
                <span className="font-bold">Section :</span>{" "}
                {team.gender === "masculin"
                  ? "Masculine"
                  : team.gender === "feminin"
                    ? "Féminine"
                    : "Mixte / loisirs"}
              </p>
            </div>

            <p className="mt-5 whitespace-pre-line leading-relaxed text-gray-700">
              {team.description?.trim() ||
                  "Cette page permet de présenter rapidement l’équipe et de rediriger les visiteurs vers les informations officielles de compétition."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {team.ffhandballUrl ? (
                <a
                  href={team.ffhandballUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                >
                  Voir les résultats
                </a>
              ) : (
                <p className="font-semibold text-gray-500">
                </p>
              )}

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TeamDetailPage;