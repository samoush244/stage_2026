import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import API from "../../services/api";

type PartnerCategory = "majeur" | "institutionnel" | "officiel";

type PartnerItem = {
  _id: string;
  name: string;
  url: string;
  logo: string;
  order: number;
  category: PartnerCategory;
  isActive: boolean;
};

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const categoryLabels: Record<PartnerCategory, string> = {
  majeur: "Majeur",
  institutionnel: "Institutionnel",
  officiel: "Officiel",
};

const categoryStyles: Record<PartnerCategory, string> = {
  majeur: "bg-red-100 text-red-700",
  institutionnel: "bg-blue-100 text-blue-700",
  officiel: "bg-zinc-100 text-zinc-700",
};

export default function AdminPartners() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [order, setOrder] = useState(1);
  const [category, setCategory] = useState<PartnerCategory>("officiel");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    try {
      const res = await API.get("/partners/admin/all");
      setPartners(res.data);
    } catch (error) {
      console.error("Erreur récupération partenaires admin :", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setUrl("");
    setLogoPreview("");
    setLogoFile(null);
    setOrder(1);
    setCategory("officiel");
    setIsActive(true);
    setEditingId(null);
  }

function getLogoUrl(logo: string) {
  if (!logo) return "";

  if (
    logo.startsWith("http://") ||
    logo.startsWith("https://") ||
    logo.startsWith("blob:")
  ) {
    return logo;
  }

  if (logo.startsWith("/")) {
    return `${API_URL}${logo}`;
  }

  return `${API_URL}/${logo}`;
}

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("url", url);
      formData.append("category", category);
      formData.append("order", String(order));
      formData.append("isActive", String(isActive));

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (editingId) {
        await API.put(`/partners/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await API.post("/partners", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      await fetchPartners();

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Erreur sauvegarde partenaire :", error);
    }
  }

  function handleEdit(partner: PartnerItem) {
    setEditingId(partner._id);
    setName(partner.name);
    setUrl(partner.url);
    setLogoPreview(getLogoUrl(partner.logo));
    setLogoFile(null);
    setOrder(partner.order);
    setCategory(partner.category);
    setIsActive(partner.isActive);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    try {
      await API.delete(`/partners/${id}`);
      setPartners(partners.filter((partner) => partner._id !== id));
    } catch (error) {
      console.error("Erreur suppression partenaire :", error);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-zinc-600">Chargement des partenaires...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Gestion des partenaires
          </h1>

          <p className="mt-2 text-zinc-600">
            Gérer les logos partenaires affichés sur le site.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouveau partenaire
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId ? "Modifier un partenaire" : "Ajouter un partenaire"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Nom du partenaire"
            />

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Site internet"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PartnerCategory)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="majeur">Partenaire majeur</option>
              <option value="institutionnel">Partenaire institutionnel</option>
              <option value="officiel">Partenaire officiel</option>
            </select>

            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Ordre d’affichage"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setLogoFile(file);
                  setLogoPreview(URL.createObjectURL(file));
                }
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <select
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="true">Visible</option>
              <option value="false">Masqué</option>
            </select>

            {logoPreview && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu du logo
                </p>

                <img
                  src={logoPreview}
                  alt="Logo partenaire"
                  className="h-24 object-contain"
                />
              </div>
            )}

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
              >
                {editingId ? "Mettre à jour" : "Enregistrer"}
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
              <th className="px-6 py-4">Logo</th>
              <th className="px-6 py-4">Partenaire</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Site web</th>
              <th className="px-6 py-4">Ordre</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {[...partners]
              .sort((a, b) => {
              const categoryA = a.category || "Autres";
              const categoryB = b.category || "Autres";

                if (categoryA !== categoryB) {
                  return categoryA.localeCompare(categoryB, "fr", {
                  sensitivity: "base",
                    });
                  }
                  return (a.order ?? 999) - (b.order ?? 999);
                })
              .map((partner) => (
                <tr key={partner._id} className="border-t border-zinc-200">
                  <td className="px-6 py-4">
                    {partner.logo ? (
                      <img
                        src={getLogoUrl(partner.logo)}
                        alt={partner.name}
                        className="h-16 w-28 object-contain"
                      />
                    ) : (
                      <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-zinc-200 text-xs text-zinc-500">
                        Aucun logo
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium text-zinc-800">
                    {partner.name}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles[partner.category]}`}
                    >
                      {categoryLabels[partner.category]}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Voir le site
                    </a>
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {partner.order}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        partner.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {partner.isActive ? "Visible" : "Masqué"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(partner)}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(partner._id)}
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

        {partners.length === 0 && (
          <p className="px-6 py-8 text-center text-zinc-500">
            Aucun partenaire enregistré pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}