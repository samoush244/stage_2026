import { useEffect, useState } from "react";
import API from "../../services/api";
import {Link} from "react-router";
type Convocation = {
  _id: string;
  statut: "en_attente" | "accepte" | "refuse";
  match?: {
    adversaire: string;
    date: string;
    adresse?: string;
    lieu?: string;
  };
};

export default function MyConvocationsPage() {
  const [convocations, setConvocations] = useState<Convocation[]>([]);
  const [filter, setFilter] = useState<"pending" | "answered" | "all">("all");
  const [loading, setLoading] = useState(true);

  const fetchConvocations = async () => {
    try {
      const res = await API.get<Convocation[]>("/convocations/me");
      setConvocations(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvocations();
  }, []);

  const updateStatus = async (
    id: string,
    statut: "en_attente" | "accepte" | "refuse"
  ) => {
    try {
      await API.put(`/convocations/${id}/status`, { statut });

      setConvocations((prev) =>
        prev.map((convocation) =>
          convocation._id === id ? { ...convocation, statut } : convocation
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const filteredConvocations = convocations.filter((convocation) => {
    if (filter === "pending") return convocation.statut === "en_attente";
    if (filter === "answered") return convocation.statut !== "en_attente";
    return true;
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
    <div className="mx-auto max-w-5xl">
        <Link
        to="/espace-membre/convocations"
        className="block rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-red-500 hover:-translate-y-1">
        <h2 className="text-xl font-bold">Mes convocations</h2>
        <p className="mt-2 text-sm text-zinc-400">
        Voir les matchs auxquels vous êtes convoqué.
        </p>
        </Link>

        <div className="mb-8 flex w-fit rounded-xl bg-zinc-900 p-1">
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition ${
              filter === "pending"
                ? "bg-red-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            En attente
          </button>

          <button
            onClick={() => setFilter("answered")}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition ${
              filter === "answered"
                ? "bg-red-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Répondues
          </button>

          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition ${
              filter === "all"
                ? "bg-red-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Toutes
          </button>
        </div>

        {loading ? (
          <p className="text-zinc-400">Chargement des convocations...</p>
        ) : filteredConvocations.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-zinc-400">
              Aucune convocation à afficher pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredConvocations.map((convocation) => (
              <div
                key={convocation._id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">
                      Match contre {convocation.match?.adversaire || "adversaire inconnu"}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      📅{" "}
                      {convocation.match?.date
                        ? new Date(convocation.match.date).toLocaleDateString("fr-FR")
                        : "Date non disponible"}
                    </p>

                    {(convocation.match?.lieu || convocation.match?.adresse) && (
                      <p className="mt-1 text-sm text-zinc-400">
                        📍 {convocation.match?.lieu || convocation.match?.adresse}
                      </p>
                    )}
                  </div>

                  <StatusBadge statut={convocation.statut} />
                </div>

                <div className="mt-6">
                  {convocation.statut === "en_attente" && (
                    <div className="grid gap-3 md:grid-cols-2">
                      <button
                        onClick={() => updateStatus(convocation._id, "accepte")}
                        className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                      >
                        Je suis disponible
                      </button>

                      <button
                        onClick={() => updateStatus(convocation._id, "refuse")}
                        className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
                      >
                        Je suis indisponible
                      </button>
                    </div>
                  )}

                  {convocation.statut === "accepte" && (
                    <p className="font-bold text-green-400">
                      Vous avez confirmé votre présence.
                    </p>
                  )}

                  {convocation.statut === "refuse" && (
                    <p className="font-bold text-red-400">
                      Vous avez indiqué votre absence.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({
  statut,
}: {
  statut: "en_attente" | "accepte" | "refuse";
}) {
  if (statut === "accepte") {
    return (
      <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white">
        Acceptée
      </span>
    );
  }

  if (statut === "refuse") {
    return (
      <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
        Refusée
      </span>
    );
  }

  return (
    <span className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-yellow-950">
      En attente
    </span>
  );
}