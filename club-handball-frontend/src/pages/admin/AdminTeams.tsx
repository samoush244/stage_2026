import { useState } from "react";

type TeamItem = {
  id: number;
  name: string;
  category: string;
  gender: "Masculin" | "Féminin" | "Mixte";
  type: "Équipe première" | "Autre équipe" | "Loisir";
  image: string;
  ffhandballUrl?: string;
  scorencoUrl?: string;
  status: "Visible" | "Masquée";
};

export default function AdminTeams() {
  const [teams, setTeams] = useState<TeamItem[]>([
    {
      id: 1,
      name: "Nationale 3 masculine",
      category: "Seniors",
      gender: "Masculin",
      type: "Équipe première",
      image: "/images/n3-masculine.jpg",
      ffhandballUrl: "",
      status: "Visible",
    },
    {
      id: 2,
      name: "Nationale 3 féminine",
      category: "Seniors",
      gender: "Féminin",
      type: "Équipe première",
      image: "/images/n3-feminine.jpg",
      ffhandballUrl: "",
      status: "Visible",
    },
    {
      id: 3,
      name: "Moins de 18 masculins",
      category: "-18 ans",
      gender: "Masculin",
      type: "Autre équipe",
      image: "/images/u18-masculin.jpg",
      ffhandballUrl: "https://www.ffhandball.fr/",
      status: "Visible",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<"Masculin" | "Féminin" | "Mixte">(
    "Masculin"
  );
  const [type, setType] = useState<
    "Équipe première" | "Autre équipe" | "Loisir"
  >("Autre équipe");
  const [image, setImage] = useState("");
  const [ffhandballUrl, setFfhandballUrl] = useState("");
  const [status, setStatus] = useState<"Visible" | "Masquée">("Visible");
  const [scorencoUrl, setScorencoUrl] = useState("");

  function resetForm() {
    setName("");
    setCategory("");
    setGender("Masculin");
    setType("Autre équipe");
    setImage("");
    setFfhandballUrl("");
    setScorencoUrl("");
    setStatus("Visible");
    setEditingId(null);

  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      setTeams(
        teams.map((team) =>
          team.id === editingId
            ? {
                ...team,
                name,
                category,
                gender,
                type,
                image,
                ffhandballUrl,
                scorencoUrl,
                status,
              }
            : team
        )
      );
    } else {
      const newTeam: TeamItem = {
        id: Date.now(),
        name,
        category,
        gender,
        type,
        image,
        ffhandballUrl,
        status,
      };

      setTeams([newTeam, ...teams]);
    }

    resetForm();
    setShowForm(false);
  }

  function handleEdit(team: TeamItem) {
    setEditingId(team.id);
    setName(team.name);
    setCategory(team.category);
    setGender(team.gender);
    setType(team.type);
    setImage(team.image);
    setFfhandballUrl(team.ffhandballUrl || "");
    setScorencoUrl(team.scorencoUrl || "");
    setStatus(team.status);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setTeams(teams.filter((team) => team.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Gestion des équipes
          </h1>
          <p className="mt-2 text-zinc-600">
            Gérer les équipes premières, les autres catégories et les loisirs.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouvelle équipe
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId !== null ? "Modifier une équipe" : "Créer une équipe"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Nom de l’équipe"
            />

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Catégorie : Seniors, -18 ans..."
            />

            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value as "Masculin" | "Féminin" | "Mixte")
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
              <option value="Mixte">Mixte</option>
            </select>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "Équipe première"
                    | "Autre équipe"
                    | "Loisir"
                )
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Équipe première">Équipe première</option>
              <option value="Autre équipe">Autre équipe</option>
              <option value="Loisir">Loisir</option>
            </select>
            {type === "Équipe première" && (
              <input
                type="url"
                value={scorencoUrl}
                onChange={(e) => setScorencoUrl(e.target.value)}
                className="rounded-lg border border-zinc-300 px-4 py-3"
                placeholder="Lien Scorenco"
              />
            )
                }
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
             {type !== "Équipe première" && (
            <input
              type="url"
              value={ffhandballUrl}
              onChange={(e) => setFfhandballUrl(e.target.value)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Lien FFHandball"
            />
        ) }
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Visible" | "Masquée")
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Visible">Visible</option>
              <option value="Masquée">Masquée</option>
            </select>

            <div className="flex gap-3">
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
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Équipe</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Genre</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-t border-zinc-200">
                <td className="px-6 py-4">
                  <img
                    src={team.image}
                    alt={team.name}
                    className="h-16 w-24 rounded-lg object-cover"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-zinc-800">
                  {team.name}
                </td>

                <td className="px-6 py-4 text-zinc-600">{team.category}</td>
                <td className="px-6 py-4 text-zinc-600">{team.gender}</td>
                <td className="px-6 py-4 text-zinc-600">{team.type}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      team.status === "Visible"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {team.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(team)}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(team.id)}
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