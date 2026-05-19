import { useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  content: string;
  image: string;
  type: "interne" | "externe";
  source?: string;
  externalUrl?: string;
  status: "Publié" | "Brouillon";
  date: string;
};

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Victoire de la N3 masculine",
      content: "Le club a remporté une victoire importante dans la N3 masculine.",
      image: "/images/news1.jpg",
      type: "interne",
      status: "Publié",
      date: "18 mai 2026",
    },
    {
      id: 2,
      title: "Tournoi jeunes du club",
      content: "Le club organise un tournoi pour les jeunes joueurs.",
      image: "/images/news2.jpg",
      type: "interne",
      status: "Brouillon",
      date: "16 mai 2026",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState<"interne" | "externe">("interne");
  const [source, setSource] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [status, setStatus] = useState<"Publié" | "Brouillon">("Brouillon");

  function resetForm() {
    setTitle("");
    setContent("");
    setImage("");
    setType("interne");
    setSource("");
    setExternalUrl("");
    setStatus("Brouillon");
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      setNews(
        news.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                content,
                image,
                type,
                source,
                externalUrl,
                status,
              }
            : item
        )
      );
    } else {
      const newItem: NewsItem = {
        id: Date.now(),
        title,
        content,
        image,
        type,
        source,
        externalUrl,
        status,
        date: new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };

      setNews([newItem, ...news]);
    }

    resetForm();
    setShowForm(false);
  }

  function handleEdit(item: NewsItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setImage(item.image);
    setType(item.type);
    setSource(item.source || "");
    setExternalUrl(item.externalUrl || "");
    setStatus(item.status);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setNews(news.filter((item) => item.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
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

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId !== null ? "Modifier une actualité" : "Créer une actualité"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Titre de l’actualité"
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

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Contenu ou résumé de l’actualité"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value as "interne" | "externe")}
              className="w-full rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="interne">Actualité interne</option>
              <option value="externe">Article externe / presse</option>
            </select>

            {type === "externe" && (
              <>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                  placeholder="Source : La Voix du Nord"
                />

                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                  placeholder="Lien de l’article"
                />
              </>
            )}

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Publié" | "Brouillon")
              }
              className="w-full rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Brouillon">Brouillon</option>
              <option value="Publié">Publié</option>
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
              <th className="px-6 py-4">Titre</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-t border-zinc-200">
                <td className="px-6 py-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-20 rounded-lg object-cover"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-zinc-800">
                  {item.title}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {item.type === "interne" ? "Interne" : "Externe"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "Publié"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-zinc-600">{item.date}</td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
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