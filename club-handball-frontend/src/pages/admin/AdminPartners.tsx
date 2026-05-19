import { useState } from "react";

type PartnerItem = {
  id: number;
  name: string;
  website: string;
  logo: string;
  order: number;
  status: "Visible" | "Masqué";
};

export default function AdminPartners() {
  const [partners, setPartners] = useState<PartnerItem[]>([
    {
      id: 1,
      name: "Intersport Valenciennes",
      website: "https://www.intersport.fr",
      logo: "/images/partners/intersport.png",
      order: 1,
      status: "Visible",
    },
    {
      id: 2,
      name: "Crédit Mutuel",
      website: "https://www.creditmutuel.fr",
      logo: "/images/partners/credit-mutuel.png",
      order: 2,
      status: "Visible",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [order, setOrder] = useState(1);
  const [status, setStatus] =
    useState<PartnerItem["status"]>("Visible");

  function resetForm() {
    setName("");
    setWebsite("");
    setLogo("");
    setOrder(1);
    setStatus("Visible");
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      setPartners(
        partners.map((partner) =>
          partner.id === editingId
            ? {
                ...partner,
                name,
                website,
                logo,
                order,
                status,
              }
            : partner
        )
      );
    } else {
      const newPartner: PartnerItem = {
        id: Date.now(),
        name,
        website,
        logo,
        order,
        status,
      };

      setPartners([...partners, newPartner]);
    }

    resetForm();
    setShowForm(false);
  }

  function handleEdit(partner: PartnerItem) {
    setEditingId(partner.id);
    setName(partner.name);
    setWebsite(partner.website);
    setLogo(partner.logo);
    setOrder(partner.order);
    setStatus(partner.status);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setPartners(
      partners.filter((partner) => partner.id !== id)
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
            {editingId !== null
              ? "Modifier un partenaire"
              : "Ajouter un partenaire"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2"
          >
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
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Site internet"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  const logoUrl = URL.createObjectURL(file);
                  setLogo(logoUrl);
                }
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <input
              type="number"
              value={order}
              onChange={(e) =>
                setOrder(Number(e.target.value))
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Ordre d’affichage"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as PartnerItem["status"]
                )
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Visible">Visible</option>
              <option value="Masqué">Masqué</option>
            </select>

            {logo && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu du logo
                </p>

                <img
                  src={logo}
                  alt="Logo partenaire"
                  className="h-24 rounded-xl object-contain"
                />
              </div>
            )}

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
              >
                {editingId !== null
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
              <th className="px-6 py-4">Logo</th>
              <th className="px-6 py-4">Partenaire</th>
              <th className="px-6 py-4">Site web</th>
              <th className="px-6 py-4">Ordre</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {partners
              .sort((a, b) => a.order - b.order)
              .map((partner) => (
                <tr
                  key={partner.id}
                  className="border-t border-zinc-200"
                >
                  <td className="px-6 py-4">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
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
                    <a
                      href={partner.website}
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
                        partner.status === "Visible"
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {partner.status}
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
                        onClick={() =>
                          handleDelete(partner.id)
                        }
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