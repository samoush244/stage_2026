import { useState } from "react";

type PlayerItem = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  team: "Nationale 3 masculine" | "Nationale 3 féminine";
  position: string;
  number: string;
  image: string;
  status: "Visible" | "Masqué";
};

const firstTeams = ["Nationale 3 masculine", "Nationale 3 féminine"] as const;

export default function AdminPlayers() {
  const [players, setPlayers] = useState<PlayerItem[]>([
    {
      id: 1,
      firstName: "Lucas",
      lastName: "Martin",
      birthDate: "2001-04-12",
      team: "Nationale 3 masculine",
      position: "Demi-centre",
      number: "10",
      image: "/images/players/lucas-martin.jpg",
      status: "Visible",
    },
    {
      id: 2,
      firstName: "Emma",
      lastName: "Bernard",
      birthDate: "2002-09-21",
      team: "Nationale 3 féminine",
      position: "Arrière gauche",
      number: "7",
      image: "/images/players/emma-bernard.jpg",
      status: "Visible",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [team, setTeam] =
    useState<PlayerItem["team"]>("Nationale 3 masculine");
  const [position, setPosition] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<PlayerItem["status"]>("Visible");

  function resetForm() {
    setFirstName("");
    setLastName("");
    setBirthDate("");
    setTeam("Nationale 3 masculine");
    setPosition("");
    setNumber("");
    setImage("");
    setStatus("Visible");
    setEditingId(null);
  }

  function calculateAge(birthDate: string) {
    if (!birthDate) return "";

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      setPlayers(
        players.map((player) =>
          player.id === editingId
            ? {
                ...player,
                firstName,
                lastName,
                birthDate,
                team,
                position,
                number,
                image,
                status,
              }
            : player
        )
      );
    } else {
      const newPlayer: PlayerItem = {
        id: Date.now(),
        firstName,
        lastName,
        birthDate,
        team,
        position,
        number,
        image,
        status,
      };

      setPlayers([newPlayer, ...players]);
    }

    resetForm();
    setShowForm(false);
  }

  function handleEdit(player: PlayerItem) {
    setEditingId(player.id);
    setFirstName(player.firstName);
    setLastName(player.lastName);
    setBirthDate(player.birthDate);
    setTeam(player.team);
    setPosition(player.position);
    setNumber(player.number);
    setImage(player.image);
    setStatus(player.status);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setPlayers(players.filter((player) => player.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Gestion des joueurs
          </h1>
          <p className="mt-2 text-zinc-600">
            Gérer uniquement les effectifs publics des équipes premières.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouveau joueur
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId !== null ? "Modifier un joueur" : "Ajouter un joueur"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Nom"
            />

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Prénom"
            />

            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <select
              value={team}
              onChange={(e) => setTeam(e.target.value as PlayerItem["team"])}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              {firstTeams.map((teamName) => (
                <option key={teamName} value={teamName}>
                  {teamName}
                </option>
              ))}
            </select>

            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="">Poste</option>
              <option value="Gardien">Gardien</option>
              <option value="Ailier gauche">Ailier gauche</option>
              <option value="Ailier droit">Ailier droit</option>
              <option value="Arrière gauche">Arrière gauche</option>
              <option value="Arrière droit">Arrière droit</option>
              <option value="Demi-centre">Demi-centre</option>
              <option value="Pivot">Pivot</option>
            </select>

            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Numéro"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setImage(imageUrl);
                }
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as PlayerItem["status"])
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Visible">Visible</option>
              <option value="Masqué">Masqué</option>
            </select>

            {image && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu photo
                </p>
                <img
                  src={image}
                  alt="Aperçu joueur"
                  className="h-40 w-32 rounded-xl object-cover"
                />
              </div>
            )}

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
              <th className="px-6 py-4">Photo</th>
              <th className="px-6 py-4">Joueur</th>
              <th className="px-6 py-4">Âge</th>
              <th className="px-6 py-4">Équipe</th>
              <th className="px-6 py-4">Poste</th>
              <th className="px-6 py-4">Numéro</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-t border-zinc-200">
                <td className="px-6 py-4">
                  {player.image ? (
                    <img
                      src={player.image}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="h-16 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-zinc-200 text-xs text-zinc-500">
                      —
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 font-medium text-zinc-800">
                  {player.lastName} {player.firstName}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {calculateAge(player.birthDate)} ans
                </td>

                <td className="px-6 py-4 text-zinc-600">{player.team}</td>
                <td className="px-6 py-4 text-zinc-600">{player.position}</td>
                <td className="px-6 py-4 text-zinc-600">#{player.number}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      player.status === "Visible"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {player.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(player.id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}