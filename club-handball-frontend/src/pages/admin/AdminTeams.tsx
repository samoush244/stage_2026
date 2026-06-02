// src/pages/admin/AdminTeams.tsx

import { useEffect, useState } from "react";
import API from "../../services/api";

type TeamType = "premiere" | "autre";
type Gender = "masculin" | "feminin" | "mixte";

interface Team {
  _id: string;
  name: string;
  slug: string;
  teamType: TeamType;
  gender: Gender;
  category?: string;
  level?: string;
  image?: string;
  ffhandballUrl?: string;
  scorencoUrl?: string;
  order: number;
  isActive: boolean;
}

interface TeamForm {
  name: string;
  slug: string;
  teamType: TeamType;
  gender: Gender;
  category: string;
  level: string;
  ffhandballUrl: string;
  scorencoUrl: string;
  order: string;
  isActive: boolean;
  image: File | null;
}

const initialForm: TeamForm = {
  name: "",
  slug: "",
  teamType: "autre",
  gender: "mixte",
  category: "",
  level: "",
  ffhandballUrl: "",
  scorencoUrl: "",
  order: "0",
  isActive: true,
  image: null,
};

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState<TeamForm>(initialForm);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${BACKEND_URL}${image}`;
  };

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams/admin/all");
      setTeams(res.data);
    } catch (error) {
      console.error("Erreur récupération équipes :", error);
      setMessage("Erreur lors de la récupération des équipes.");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "isActive") {
      setForm((prev) => ({
        ...prev,
        isActive: value === "true",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingTeamId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();

      data.append("name", form.name);
      data.append("slug", form.slug);
      data.append("teamType", form.teamType);
      data.append("gender", form.gender);
      data.append("category", form.category);
      data.append("level", form.level);
      data.append("ffhandballUrl", form.ffhandballUrl);
      data.append("scorencoUrl", form.scorencoUrl);
      data.append("order", form.order);
      data.append("isActive", String(form.isActive));

      if (form.image) {
        data.append("image", form.image);
      }

      if (editingTeamId) {
        await API.put(`/teams/${editingTeamId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Équipe modifiée avec succès.");
      } else {
        await API.post("/teams", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Équipe créée avec succès.");
      }

      resetForm();
      fetchTeams();
    } catch (error) {
      console.error("Erreur enregistrement équipe :", error);
      setMessage("Erreur lors de l'enregistrement de l'équipe.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeamId(team._id);

    setForm({
      name: team.name || "",
      slug: team.slug || "",
      teamType: team.teamType || "autre",
      gender: team.gender || "mixte",
      category: team.category || "",
      level: team.level || "",
      ffhandballUrl: team.ffhandballUrl || "",
      scorencoUrl: team.scorencoUrl || "",
      order: String(team.order || 0),
      isActive: team.isActive,
      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Tu veux vraiment supprimer cette équipe ?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/teams/${id}`);
      setMessage("Équipe supprimée avec succès.");
      fetchTeams();
    } catch (error) {
      console.error("Erreur suppression équipe :", error);
      setMessage("Erreur lors de la suppression de l'équipe.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
            Dashboard admin
          </p>
          <h1 className="mt-3 text-4xl font-black text-black">
            Gestion des équipes
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            Ici tu peux modifier les équipes affichées sur le site : nom,
            image, lien FFHandball, lien Score’n’co, type d’équipe et ordre
            d’affichage.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-white p-4 font-semibold text-zinc-800 shadow">
            {message}
          </div>
        )}

        <section className="mb-10 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-black text-black">
            {editingTeamId ? "Modifier une équipe" : "Ajouter une équipe"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Nom de l'équipe *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Ex : Nationale 3 Masculine"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Ex : nationale-3-masculine"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Type d'équipe
                </label>
                <select
                  name="teamType"
                  value={form.teamType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                >
                  <option value="premiere">Équipe première</option>
                  <option value="autre">Autre équipe</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Sexe
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                >
                  <option value="masculin">Masculin</option>
                  <option value="feminin">Féminin</option>
                  <option value="mixte">Mixte</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Statut
                </label>
                <select
                  name="isActive"
                  value={String(form.isActive)}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                >
                  <option value="true">Visible sur le site</option>
                  <option value="false">Masquée</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Catégorie
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Ex : Seniors, U18, U15, Loisirs"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Niveau
                </label>
                <input
                  type="text"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Ex : Nationale 3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Lien FFHandball
                </label>
                <input
                  type="url"
                  name="ffhandballUrl"
                  value={form.ffhandballUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-zinc-800">
                  Lien Score’n’co
                </label>
                <input
                  type="url"
                  name="scorencoUrl"
                  value={form.scorencoUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold text-zinc-800">
                Image de l'équipe
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {loading
                  ? "Enregistrement..."
                  : editingTeamId
                    ? "Modifier l'équipe"
                    : "Ajouter l'équipe"}
              </button>

              {editingTeamId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-zinc-900 px-6 py-3 font-bold text-white transition hover:bg-black"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-black text-black">
            Équipes enregistrées
          </h2>

          {teams.length === 0 ? (
            <p className="text-zinc-600">
              Aucune équipe enregistrée pour le moment.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {teams.map((team) => (
                <article
                  key={team._id}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50"
                >
                  {team.image ? (
                    <img
                      src={getImageUrl(team.image)}
                      alt={team.name}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-zinc-200 font-bold text-zinc-500">
                      Aucune image
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-700">
                        {team.teamType === "premiere"
                          ? "Équipe première"
                          : "Autre équipe"}
                      </span>

                      <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-bold uppercase text-zinc-700">
                        {team.gender}
                      </span>

                      {!team.isActive && (
                        <span className="rounded-full bg-black px-3 py-1 text-xs font-bold uppercase text-white">
                          Masquée
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-black">
                      {team.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Slug : {team.slug}
                    </p>

                    {team.category && (
                      <p className="mt-2 text-zinc-700">
                        Catégorie : {team.category}
                      </p>
                    )}

                    {team.level && (
                      <p className="text-zinc-700">Niveau : {team.level}</p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEdit(team)}
                        className="rounded-lg bg-zinc-900 px-4 py-2 font-bold text-white hover:bg-black"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(team._id)}
                        className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}