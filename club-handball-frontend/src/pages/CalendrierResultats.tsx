import { useEffect, useState } from "react";
import { useParams } from "react-router";
import API from "../services/api";

type Team = {
  _id: string;
  name: string;
  slug: string;
  teamType: "premiere" | "autre";
  gender: "masculin" | "feminin" | "mixte";
  category?: string;
  level?: string;
  image?: string;
  ffhandballUrl?: string;
  scorencoUrl?: string;
  order?: number;
  isActive?: boolean;
};

const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

function getImageUrl(image?: string) {
  if (!image) {
    return "/images/default-team.jpg";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${BACKEND_URL}${image}`;
  }

  return `${BACKEND_URL}/${image}`;
}

export default function CalendrierResultatsPage() {
  const { teamSlug } = useParams<{ teamSlug: string }>();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamSlug) {
        setLoading(false);
        setError("Aucune équipe sélectionnée.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/teams/slug/${teamSlug}`);

        setTeam(response.data);
      } catch (err) {
        console.error("Erreur récupération équipe :", err);
        setError("Impossible de récupérer les informations de cette équipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamSlug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-black">
        <p className="text-lg font-semibold">
          Chargement du calendrier...
        </p>
      </main>
    );
  }

  if (error || !team) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-black">
        <h1 className="text-3xl font-bold">Équipe introuvable</h1>

        <p className="mt-4 text-zinc-600">
          {error || "Cette équipe n’existe pas ou le lien est incorrect."}
        </p>
      </main>
    );
  }

  const image = getImageUrl(team.image);

  const title = team.name;

  const subtitle = `Calendrier, résultats et classement de ${
    team.category || team.name
  }.`;

  const scorencoUrl = team.scorencoUrl || "";

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden bg-black">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-red-500">
            Calendrier & résultats
          </p>

          <h1 className="max-w-3xl text-4xl font-black uppercase text-white md:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-zinc-200">
            {subtitle}
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-red-600">
              Calendrier & résultats
            </p>

            <h2 className="text-3xl font-black uppercase text-zinc-950">
              Suivez les matchs de l’équipe
            </h2>

            <p className="mt-4 max-w-3xl text-zinc-600">
              Retrouvez ici le calendrier, les derniers résultats et le classement
              de l’équipe première grâce au module Score’n’co.
            </p>
          </div>
        </div>
      </section>

      {/* WIDGET SCORENCO */}
      <section
        id="calendrier-resultats"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
          <div className="border-b border-zinc-200 bg-zinc-950 px-6 py-5">
            <h2 className="text-2xl font-black uppercase text-white">
              Matchs, résultats & classement
            </h2>

            <p className="mt-1 text-sm text-zinc-300">
              Module Score’n’co intégré automatiquement.
            </p>
          </div>

          <div className="bg-white p-3 md:p-6">
            {!scorencoUrl ? (
              <div className="rounded-2xl border border-dashed border-red-300 bg-red-50 p-8 text-center">
                <h3 className="text-xl font-black text-red-700">
                  Widget Score’n’co à ajouter
                </h3>

                <p className="mt-3 text-zinc-700">
                  Aucun lien Score’n’co n’a encore été renseigné pour cette
                  équipe. Ajoute le lien dans le dashboard admin ou directement
                  dans MongoDB.
                </p>
              </div>
            ) : (
              <iframe
                src={scorencoUrl}
                title={`Score'n'co - ${title}`}
                className="h-[900px] w-full rounded-2xl border-0"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}