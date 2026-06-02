import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

type NewsItem = {
  _id: string;
  title: string;
  slug?: string;
  image?: string;
  content?: string;
  summary?: string;
  type: "internal" | "external";
  source?: string;
  externalUrl?: string;
  publishedAt?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const API_URL = "http://localhost:5000";

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [type, setType] = useState<"internal" | "external">("internal");
  const [source, setSource] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const token = localStorage.getItem("token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token ?? ""}`,
  });

  async function getErrorMessage(res: Response) {
    try {
      const data = await res.json();
      return data.message || "Une erreur est survenue.";
    } catch {
      return "Une erreur est survenue.";
    }
  }

  async function fetchNews() {
    try {
      setError("");

      const res = await fetch(`${API_URL}/api/news/admin/all`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      const data = await res.json();

      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur récupération actualités admin :", error);
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger les actualités."
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setTitle("");
    setSummary("");
    setContent("");
    setImageFile(null);
    setPreviewImage("");
    setType("internal");
    setSource("");
    setExternalUrl("");
    setIsPublished(false);
    setEditingId(null);
    setError("");
  }

  function getImageUrl(image?: string) {
    if (!image) return "";

    if (image.startsWith("http") || image.startsWith("blob:")) {
      return image;
    }

    const cleanImage = image.startsWith("/") ? image : `/${image}`;

    return `${API_URL}${cleanImage}`;
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    if (!summary.trim()) {
      setError("Le résumé est obligatoire.");
      return;
    }

    if (type === "internal" && !content.trim()) {
      setError("Le contenu est obligatoire pour une actualité interne.");
      return;
    }

    if (type === "external" && (!source.trim() || !externalUrl.trim())) {
      setError(
        "La source et le lien externe sont obligatoires pour un article externe."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("summary", summary.trim());
      formData.append("content", content.trim());
      formData.append("type", type);
      formData.append("source", source.trim());
      formData.append("externalUrl", externalUrl.trim());
      formData.append("isPublished", String(isPublished));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url =
        editingId !== null
          ? `${API_URL}/api/news/${editingId}`
          : `${API_URL}/api/news`;

      const method = editingId !== null ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      await fetchNews();

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Erreur enregistrement actualité :", error);
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d’enregistrer l’actualité."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: NewsItem) {
    setEditingId(item._id);
    setTitle(item.title || "");
    setSummary(item.summary || "");
    setContent(item.content || "");
    setPreviewImage(getImageUrl(item.image));
    setImageFile(null);
    setType(item.type || "internal");
    setSource(item.source || "");
    setExternalUrl(item.externalUrl || "");
    setIsPublished(Boolean(item.isPublished));
    setShowForm(true);
    setError("");
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette actualité ?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const res = await fetch(`${API_URL}/api/news/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      setNews((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Erreur suppression actualité :", error);
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer l’actualité."
      );
    }
  }

  if (pageLoading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-zinc-600 shadow">
        Chargement des actualités...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Gestion des actualités
          </h1>
          <p className="mt-2 text-zinc-600">
            Créer, modifier et publier les actualités du club.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouvelle actualité
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId !== null
              ? "Modifier une actualité"
              : "Créer une actualité"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Titre
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                placeholder="Titre de l’actualité"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Résumé
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                placeholder="Court résumé affiché sur la page actualités"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3"
              />
            </div>

            {previewImage && (
              <img
                src={previewImage}
                alt="Aperçu de l’actualité"
                className="h-48 w-full rounded-lg object-cover"
              />
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Type d’actualité
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "internal" | "external")
                }
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
              >
                <option value="internal">Actualité interne</option>
                <option value="external">Article externe / revue de presse</option>
              </select>
            </div>

            {type === "internal" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                  Contenu
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={7}
                  required={type === "internal"}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Contenu complet de l’actualité"
                />
              </div>
            )}

            {type === "external" && (
              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Source
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required={type === "external"}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                    placeholder="Ex : La Voix du Nord"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Lien de l’article externe
                  </label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    required={type === "external"}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-red-600"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 rounded-xl bg-zinc-50 p-4 text-sm font-semibold text-zinc-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Publier sur le site
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {loading
                  ? "Enregistrement..."
                  : editingId !== null
                  ? "Mettre à jour"
                  : "Enregistrer"}
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
              <th className="px-6 py-4">Titre</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {news.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  Aucune actualité enregistrée pour le moment.
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item._id} className="border-t border-zinc-200">
                  <td className="px-6 py-4">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="h-16 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-500">
                        Aucune
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-zinc-800">{item.title}</p>
                    {item.summary && (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                        {item.summary}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {item.type === "internal" ? "Interne" : "Externe"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.isPublished ? "Publié" : "Brouillon"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}