import { useState } from "react";

type ClubInfo = {
  name: string;
  logo: string;
  address: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  description: string;
};

export default function AdminClubInfo() {
  const [clubInfo, setClubInfo] = useState<ClubInfo>({
    name: "Valenciennes Handball Club",
    logo: "/images/logo.png",
    address: "Valenciennes",
    email: "contact@vhc.fr",
    phone: "03 00 00 00 00",
    facebook: "",
    instagram: "",
    description:
      "Le Valenciennes Handball Club est un club engagé dans la formation, la compétition et la vie sportive locale.",
  });

  const [form, setForm] = useState<ClubInfo>(clubInfo);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClubInfo(form);
    alert("Informations du club mises à jour !");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          Informations du club
        </h1>
        <p className="mt-2 text-zinc-600">
          Modifier les informations générales affichées sur le site.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow lg:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Nom du club"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({
                    ...form,
                    logo: URL.createObjectURL(file),
                  });
                }
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="rounded-lg border border-zinc-300 px-4 py-3 md:col-span-2"
              placeholder="Adresse"
            />

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Email"
            />

            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Téléphone"
            />

            <input
              type="url"
              value={form.facebook}
              onChange={(e) =>
                setForm({ ...form, facebook: e.target.value })
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Lien Facebook"
            />

            <input
              type="url"
              value={form.instagram}
              onChange={(e) =>
                setForm({ ...form, instagram: e.target.value })
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Lien Instagram"
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={7}
              className="rounded-lg border border-zinc-300 px-4 py-3 md:col-span-2"
              placeholder="Présentation du club"
            />
          </div>

          <button
            type="submit"
            className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Enregistrer les informations
          </button>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            Aperçu
          </h2>

          {clubInfo.logo && (
            <img
              src={clubInfo.logo}
              alt={clubInfo.name}
              className="mb-4 h-24 object-contain"
            />
          )}

          <h3 className="text-lg font-bold">{clubInfo.name}</h3>
          <p className="mt-2 text-sm text-zinc-600">
            {clubInfo.address}
          </p>
          <p className="text-sm text-zinc-600">{clubInfo.email}</p>
          <p className="text-sm text-zinc-600">{clubInfo.phone}</p>

          <p className="mt-4 text-sm text-zinc-700">
            {clubInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
}