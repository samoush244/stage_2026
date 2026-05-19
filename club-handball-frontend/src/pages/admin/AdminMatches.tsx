import { useState } from "react";

type MatchItem = {
  id: number;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  homeAway: "Domicile" | "Extérieur";
  createdBy: string;
  status: "À venir" | "Terminé" | "Annulé";
};

const teams = [
  "Nationale 3 masculine",
  "Nationale 3 féminine",
  "Moins de 18 masculins",
  "Moins de 18 féminines",
  "Loisirs",
];

export default function AdminMatches() {
  const [matches, setMatches] = useState<MatchItem[]>([
    {
      id: 1,
      team: "Nationale 3 masculine",
      opponent: "Lille Métropole Handball",
      date: "2026-05-25",
      time: "20:00",
      location: "Salle du Hainaut",
      homeAway: "Domicile",
      createdBy: "Coach N3M",
      status: "À venir",
    },
    {
      id: 2,
      team: "Nationale 3 féminine",
      opponent: "Amiens Handball",
      date: "2026-05-26",
      time: "18:30",
      location: "Amiens",
      homeAway: "Extérieur",
      createdBy: "Coach N3F",
      status: "À venir",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterTeam, setFilterTeam] = useState("Toutes");

  const [team, setTeam] = useState(teams[0]);
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [homeAway, setHomeAway] = useState<"Domicile" | "Extérieur">(
    "Domicile"
  );
  const [status, setStatus] = useState<MatchItem["status"]>("À venir");

  const filteredMatches =
    filterTeam === "Toutes"
      ? matches
      : matches.filter((match) => match.team === filterTeam);

  function resetForm() {
    setTeam(teams[0]);
    setOpponent("");
    setDate("");
    setTime("");
    setLocation("");
    setHomeAway("Domicile");
    setStatus("À venir");
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      setMatches(
        matches.map((match) =>
          match.id === editingId
            ? {
                ...match,
                team,
                opponent,
                date,
                time,
                location,
                homeAway,
                status,
              }
            : match
        )
      );
    } else {
      const newMatch: MatchItem = {
        id: Date.now(),
        team,
        opponent,
        date,
        time,
        location,
        homeAway,
        createdBy: "Admin",
        status,
      };

      setMatches([newMatch, ...matches]);
    }

    resetForm();
    setShowForm(false);
  }

  function handleEdit(match: MatchItem) {
    setEditingId(match.id);
    setTeam(match.team);
    setOpponent(match.opponent);
    setDate(match.date);
    setTime(match.time);
    setLocation(match.location);
    setHomeAway(match.homeAway);
    setStatus(match.status);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setMatches(matches.filter((match) => match.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Supervision des matchs
          </h1>
          <p className="mt-2 text-zinc-600">
            Voir, modifier ou supprimer les matchs créés par les coachs.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouveau match
        </button>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-5 shadow">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Filtrer par équipe
        </label>

        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-4 py-3 md:w-80"
        >
          <option value="Toutes">Toutes les équipes</option>
          {teams.map((teamName) => (
            <option key={teamName} value={teamName}>
              {teamName}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId !== null ? "Modifier un match" : "Créer un match"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              {teams.map((teamName) => (
                <option key={teamName} value={teamName}>
                  {teamName}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Adversaire"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Lieu"
            />

            <select
              value={homeAway}
              onChange={(e) =>
                setHomeAway(e.target.value as "Domicile" | "Extérieur")
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Domicile">Domicile</option>
              <option value="Extérieur">Extérieur</option>
            </select>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as MatchItem["status"])
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="À venir">À venir</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
              >
                {editingId !== null ? "Mettre à jour" : "Enregistrer"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-lg border border-zinc-300 px-5 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-zinc-100">
            <tr className="text-left text-sm text-zinc-600">
              <th className="px-6 py-4">Équipe</th>
              <th className="px-6 py-4">Adversaire</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Lieu</th>
              <th className="px-6 py-4">Créé par</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMatches.map((match) => (
              <tr key={match.id} className="border-t border-zinc-200">
                <td className="px-6 py-4 font-medium text-zinc-800">
                  {match.team}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {match.opponent}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {match.date} à {match.time}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {match.homeAway} - {match.location}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {match.createdBy}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      match.status === "À venir"
                        ? "bg-green-100 text-green-700"
                        : match.status === "Annulé"
                        ? "bg-red-100 text-red-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {match.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(match)}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(match.id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredMatches.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                  Aucun match trouvé pour cette équipe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}