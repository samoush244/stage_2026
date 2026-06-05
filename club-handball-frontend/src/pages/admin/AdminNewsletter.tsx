import { useMemo, useState,useEffect } from "react";

type Subscriber = {
  _id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
};
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  const fetchSubscribers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/newsletter`);
      const data = await response.json();
      setSubscribers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des abonnés :", error);
    }
  };

  fetchSubscribers();
}, []);
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, subscribers]);

  const totalSubscribers = subscribers.length;

  function handleDelete(id: number) {
    setSubscribers(subscribers.filter((subscriber) => subscriber._id !== id));
  }

  function toggleStatus(id: number) {
    setSubscribers(
      subscribers.map((subscriber) =>
        subscriber._id === id
          ? {
              ...subscriber,
              isActive:
                subscriber.isActive === true
                  ? false
                  : true
            }
          : subscriber
      )
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Newsletter
          </h1>

          <p className="mt-2 text-zinc-600">
            Gérer les abonnés à la newsletter du club.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-6 py-5 shadow">
          <p className="text-sm text-zinc-500">
            Abonnés actifs
          </p>

          <p className="mt-1 text-3xl font-bold text-zinc-900">
            {totalSubscribers}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-5 shadow">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un email..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
        />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-zinc-100">
            <tr className="text-left text-sm text-zinc-600">
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Date d’inscription</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubscribers.map((subscriber) => (
              <tr
                key={subscriber._id}
                className="border-t border-zinc-200"
              >
                <td className="px-6 py-4 font-medium text-zinc-800">
                  {subscriber.email}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {subscriber.createdAt}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      subscriber.isActive === true
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {subscriber.isActive === true ? "Actif" : "Désabonné"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        toggleStatus(subscriber._id)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {subscriber.isActive === true
                        ? "Désabonner"
                        : "Réactiver"}
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(subscriber._id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}

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
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-zinc-900">
          Export CSV
        </h2>

        <p className="mt-2 text-sm text-zinc-600">
          L’export réel sera connecté plus tard avec le backend et MongoDB.
        </p>

        <button
          className="mt-4 rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-zinc-800"
        >
          Exporter les abonnés
        </button>
      </div>
    </div>
  );
}