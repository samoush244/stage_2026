import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  createHistory,
  deleteHistory,
  getAdminHistories,
  toggleHistoryStatus,
  updateHistory,
} from "../../services/historyServices";

type HistoryItem = {
  _id: string;
  year: string;
  title: string;
  image?: string;
  text: string[];
  details: string[];
  order: number;
  isActive: boolean;
};

type HistoryForm = {
  year: string;
  title: string;
  text: string;
  details: string;
  order: number;
  isActive: boolean;
};

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const initialForm: HistoryForm = {
  year: "",
  title: "",
  text: "",
  details: "",
  order: 0,
  isActive: true,
};

const getImageUrl = (image?: string) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
};

function AdminHistory() {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [form, setForm] = useState<HistoryForm>(initialForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingHistory, setEditingHistory] = useState<HistoryItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const data = await getAdminHistories();
      setHistories(data);
    } catch (error) {
      console.error("Erreur récupération histoires :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      isActive: e.target.value === "true",
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setImagePreview("");
    setEditingHistory(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("year", form.year);
    formData.append("title", form.title);
    formData.append("text", form.text);
    formData.append("details", form.details);
    formData.append("order", String(form.order));
    formData.append("isActive", String(form.isActive));

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    return formData;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.year.trim() || !form.title.trim()) {
      alert("L'année et le titre sont obligatoires.");
      return;
    }

    try {
      setSaving(true);

      const formData = buildFormData();

      if (editingHistory) {
        await updateHistory(editingHistory._id, formData);
      } else {
        await createHistory(formData);
      }

      resetForm();
      await fetchHistories();
    } catch (error) {
      console.error("Erreur enregistrement histoire :", error);
      alert("Erreur lors de l'enregistrement de l'histoire.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (history: HistoryItem) => {
    setEditingHistory(history);

    setForm({
      year: history.year || "",
      title: history.title || "",
      text: history.text?.join("\n") || "",
      details: history.details?.join("\n") || "",
      order: history.order || 0,
      isActive: history.isActive,
    });

    setSelectedImage(null);
    setImagePreview(getImageUrl(history.image));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette histoire ?"
    );

    if (!confirmDelete) return;

    try {
      await deleteHistory(id);
      await fetchHistories();

      if (editingHistory?._id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Erreur suppression histoire :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleHistoryStatus(id);
      await fetchHistories();
    } catch (error) {
      console.error("Erreur changement statut histoire :", error);
      alert("Erreur lors du changement de statut.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-8 text-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
            Dashboard admin
          </p>

          <h1 className="mt-2 text-3xl font-black uppercase text-zinc-900">
            Gestion de l'histoire du club
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-600">
            Ajoutez les grandes étapes du club. Elles seront affichées
            automatiquement sur la page publique sous forme de frise, en
            respectant l'ordre d'affichage.
          </p>
        </div>

        <section className="mb-10 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-black uppercase text-zinc-900">
            {editingHistory ? "Modifier une histoire" : "Ajouter une histoire"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">
                  Année / période
                </label>

                <input
                  type="text"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="Ex : 2016"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">
                  Ordre d'affichage
                </label>

                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">
                  Statut
                </label>

                <select
                  value={String(form.isActive)}
                  onChange={handleStatusChange}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Titre
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex : Création du club"
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Texte court affiché sur la carte
              </label>

              <textarea
                name="text"
                value={form.text}
                onChange={handleChange}
                rows={4}
                placeholder="Écris un paragraphe par ligne."
                className="w-full resize-none rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Détails affichés dans la modale
              </label>

              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                rows={6}
                placeholder="Écris un paragraphe par ligne."
                className="w-full resize-none rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-red-600"
              />

              {imagePreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-zinc-600">
                    Aperçu de l'image
                  </p>

                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="h-56 w-full max-w-md rounded-xl object-cover shadow"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-red-600 px-6 py-3 font-bold uppercase text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Enregistrement..."
                  : editingHistory
                  ? "Modifier l'histoire"
                  : "Ajouter l'histoire"}
              </button>

              {editingHistory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-zinc-400 px-6 py-3 font-bold uppercase text-zinc-700 transition hover:bg-zinc-200"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-black uppercase text-zinc-900">
              Histoires enregistrées
            </h2>

            <p className="text-sm text-zinc-500">
              Triées par ordre d'affichage.
            </p>
          </div>

          {loading ? (
            <p className="text-zinc-600">Chargement des histoires...</p>
          ) : histories.length === 0 ? (
            <p className="text-zinc-600">
              Aucune histoire n'a encore été ajoutée.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full min-w-[1000px] border-collapse bg-white">
                <thead className="bg-zinc-100">
                  <tr className="text-left text-sm text-zinc-600">
                    <th className="px-5 py-4">Image</th>
                    <th className="px-5 py-4">Année</th>
                    <th className="px-5 py-4">Titre</th>
                    <th className="px-5 py-4">Ordre</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {histories.map((history) => {
                    const imageUrl = getImageUrl(history.image);

                    return (
                      <tr
                        key={history._id}
                        className="border-t border-zinc-200 text-sm"
                      >
                        <td className="px-5 py-4">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={history.title}
                              className="h-16 w-24 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-zinc-400">
                              Aucune image
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 font-bold text-red-600">
                          {history.year}
                        </td>

                        <td className="px-5 py-4 font-semibold text-zinc-900">
                          {history.title}
                        </td>

                        <td className="px-5 py-4">{history.order}</td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                              history.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-zinc-200 text-zinc-600"
                            }`}
                          >
                            {history.isActive ? "Actif" : "Inactif"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(history)}
                              className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold uppercase text-white transition hover:bg-zinc-700"
                            >
                              Modifier
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(history._id)}
                              className="rounded-lg border border-zinc-400 px-4 py-2 text-xs font-bold uppercase text-zinc-700 transition hover:bg-zinc-100"
                            >
                              {history.isActive
                                ? "Désactiver"
                                : "Activer"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(history._id)}
                              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase text-white transition hover:bg-red-700"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminHistory;