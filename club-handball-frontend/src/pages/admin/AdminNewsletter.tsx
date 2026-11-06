
import { useMemo, useState, useEffect } from "react";

type Subscriber = {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  consentDate?: string;
};

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // 1. RÉCUPÉRER LES ABONNÉS DEPUIS MONGODB
  // ==========================================

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/newsletter`
        );

        if (!response.ok) {
          throw new Error(
            `Erreur HTTP ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Format de réponse invalide");
        }

        setSubscribers(data);
      } catch (err) {
        console.error(
          "Erreur récupération newsletter :",
          err
        );

        setError(
          "Erreur lors du chargement des abonnés."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  // ==========================================
  // 2. RECHERCHE
  // ==========================================

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) =>
      subscriber.email
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );
  }, [subscribers, search]);

  // ==========================================
  // 3. STATISTIQUES
  // ==========================================

  const totalSubscribers = subscribers.length;

  const activeSubscribers = subscribers.filter(
    (subscriber) => subscriber.isActive
  ).length;

  const inactiveSubscribers =
    totalSubscribers - activeSubscribers;

  // ==========================================
  // 4. SUPPRIMER UN ABONNÉ
  // ==========================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet abonné ?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/newsletter/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      setSubscribers((previous) =>
        previous.filter(
          (subscriber) => subscriber._id !== id
        )
      );

      setSuccess("Abonné supprimé avec succès.");
    } catch (err) {
      console.error("Erreur suppression :", err);

      setError(
        "Impossible de supprimer cet abonné."
      );
    } finally {
      setActionId(null);
    }
  };

  // ==========================================
  // 5. DÉSABONNER UN UTILISATEUR
  // ==========================================

  const toggleStatus = async (id: string) => {
    const subscriber = subscribers.find(
      (s) => s._id === id
    );

    if (!subscriber) return;

    // Une personne désabonnée doit se réinscrire
    // volontairement pour être réactivée.
    if (!subscriber.isActive) {
      setError(
        "La réactivation nécessite une nouvelle inscription volontaire de l'abonné."
      );
      return;
    }

    const confirmed = window.confirm(
      "Voulez-vous désabonner cet utilisateur ?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/newsletter/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      const updatedSubscriber =
        await response.json();

      setSubscribers((previous) =>
        previous.map((s) =>
          s._id === id ? updatedSubscriber : s
        )
      );

      setSuccess("Abonné désabonné avec succès.");
    } catch (err) {
      console.error(
        "Erreur modification statut :",
        err
      );

      setError(
        "Impossible de modifier le statut."
      );
    } finally {
      setActionId(null);
    }
  };

  // ==========================================
  // 6. EXPORT CSV
  // ==========================================

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/newsletter/export`
      );

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "newsletter-valenciennes-handball.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      setSuccess(
        "Liste des abonnés exportée avec succès."
      );
    } catch (err) {
      console.error("Erreur export CSV :", err);

      setError(
        "Impossible d'exporter les abonnés."
      );
    } finally {
      setExporting(false);
    }
  };

  // ==========================================
  // 7. FORMAT DATE
  // ==========================================

  const formatDate = (date?: string) => {
    if (!date) return "Non renseignée";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date invalide";
    }

    return parsedDate.toLocaleDateString(
      "fr-FR"
    );
  };

  return (
    <div>
      {/* EN-TÊTE */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Newsletter
          </h1>

          <p className="mt-2 text-zinc-600">
            Gérer les abonnés à la newsletter du club.
          </p>
        </div>

        {/* STATISTIQUES */}
        <div className="flex flex-wrap gap-4">
          <div className="rounded-2xl bg-white px-6 py-5 shadow">
            <p className="text-sm text-zinc-500">
              Total inscrits
            </p>

            <p className="mt-1 text-3xl font-bold text-zinc-900">
              {totalSubscribers}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-6 py-5 shadow">
            <p className="text-sm text-zinc-500">
              Abonnés actifs
            </p>

            <p className="mt-1 text-3xl font-bold text-green-600">
              {activeSubscribers}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-6 py-5 shadow">
            <p className="text-sm text-zinc-500">
              Désabonnés
            </p>

            <p className="mt-1 text-3xl font-bold text-red-600">
              {inactiveSubscribers}
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-100 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-5 rounded-lg bg-green-100 p-4 text-green-700"
        >
          {success}
        </div>
      )}

      {/* RECHERCHE */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow">
        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Rechercher un email..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
        />
      </div>

      {/* TABLEAU */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-zinc-100">
            <tr className="text-left text-sm text-zinc-600">
              <th className="px-6 py-4">
                Email
              </th>

              <th className="px-6 py-4">
                Date d'inscription
              </th>

              <th className="px-6 py-4">
                Statut
              </th>

              <th className="px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-zinc-500"
                >
                  Chargement des abonnés...
                </td>
              </tr>
            ) : (
              <>
                {filteredSubscribers.map(
                  (subscriber) => (
                    <tr
                      key={subscriber._id}
                      className="border-t border-zinc-200"
                    >
                      <td className="px-6 py-4 font-medium text-zinc-800">
                        {subscriber.email}
                      </td>

                      <td className="px-6 py-4 text-zinc-600">
                        {formatDate(
                          subscriber.consentDate ||
                          subscriber.createdAt
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            subscriber.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {subscriber.isActive
                            ? "Actif"
                            : "Désabonné"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {subscriber.isActive && (
                            <button
                              disabled={actionId !== null}
                              onClick={() =>
                                toggleStatus(
                                  subscriber._id
                                )
                              }
                              className="text-blue-600 hover:underline disabled:opacity-50"
                            >
                              Désabonner
                            </button>
                          )}

                          <button
                            disabled={actionId !== null}
                            onClick={() =>
                              handleDelete(
                                subscriber._id
                              )
                            }
                            className="text-red-600 hover:underline disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {filteredSubscribers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-zinc-500"
                    >
                      Aucun abonné trouvé.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* EXPORT CSV */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-zinc-900">
          Export CSV
        </h2>

        <p className="mt-2 text-sm text-zinc-600">
          Télécharger la liste des abonnés actifs
          à la newsletter au format CSV,
          compatible avec Excel.
        </p>

        <button
          onClick={handleExportCSV}
          disabled={exporting || loading}
          className="mt-4 rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {exporting
            ? "Téléchargement..."
            : "Exporter les abonnés (CSV)"}
        </button>
      </div>
    </div>
  );
}
