import { useState } from "react";

type OrganizationMember = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  group: "Bureau" | "Conseil d'administration" ;
  email?: string;
  photo: string;
  order: number;
  status: "Visible" | "Masqué";
};

export default function AdminOrganization() {
  const [members, setMembers] = useState<OrganizationMember[]>([
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      role: "Président",
      group: "Bureau",
      email: "president@vhc.fr",
      photo: "/images/organization/president.jpg",
      order: 1,
      status: "Visible",
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      role: "Trésorière",
      group: "Bureau",
      email: "",
      photo: "/images/organization/tresoriere.jpg",
      order: 2,
      status: "Visible",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [group, setGroup] = useState<OrganizationMember["group"]>("Bureau");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [order, setOrder] = useState(1);
  const [status, setStatus] =
    useState<OrganizationMember["status"]>("Visible");

  function resetForm() {
    setFirstName("");
    setLastName("");
    setRole("");
    setGroup("Bureau");
    setEmail("");
    setPhoto("");
    setOrder(1);
    setStatus("Visible");
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      setMembers(
        members.map((member) =>
          member.id === editingId
            ? {
                ...member,
                firstName,
                lastName,
                role,
                group,
                email,
                photo,
                order,
                status,
              }
            : member
        )
      );
    } else {
      const newMember: OrganizationMember = {
        id: Date.now(),
        firstName,
        lastName,
        role,
        group,
        email,
        photo,
        order,
        status,
      };

      setMembers([...members, newMember]);
    }

    resetForm();
    setShowForm(false);
  }

  function handleEdit(member: OrganizationMember) {
    setEditingId(member.id);
    setFirstName(member.firstName);
    setLastName(member.lastName);
    setRole(member.role);
    setGroup(member.group);
    setEmail(member.email || "");
    setPhoto(member.photo);
    setOrder(member.order);
    setStatus(member.status);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setMembers(members.filter((member) => member.id !== id));
  }

  const sortedMembers = [...members].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Organigramme
          </h1>
          <p className="mt-2 text-zinc-600">
            Gérer les membres du bureau, les dirigeants .
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouveau membre
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId !== null ? "Modifier un membre" : "Ajouter un membre"}
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
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Fonction : Président, Trésorier..."
            />

            <select
              value={group}
              onChange={(e) =>
                setGroup(e.target.value as OrganizationMember["group"])
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Bureau">Bureau</option>
              <option value="Conseil d'administration">Conseil d'administration</option>
            </select>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Email facultatif"
            />

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
                  setPhoto(URL.createObjectURL(file));
                }
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as OrganizationMember["status"])
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Visible">Visible</option>
              <option value="Masqué">Masqué</option>
            </select>

            {photo && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu photo
                </p>

                <img
                  src={photo}
                  alt="Aperçu membre"
                  className="h-32 w-32 rounded-xl object-cover"
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
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Fonction</th>
              <th className="px-6 py-4">Groupe</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Ordre</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedMembers.map((member) => (
              <tr key={member.id} className="border-t border-zinc-200">
                <td className="px-6 py-4">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-xs text-zinc-500">
                      —
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 font-medium text-zinc-800">
                  {member.lastName} {member.firstName}
                </td>

                <td className="px-6 py-4 text-zinc-600">{member.role}</td>
                <td className="px-6 py-4 text-zinc-600">{member.group}</td>

                <td className="px-6 py-4 text-zinc-600">
                  {member.email || "Non renseigné"}
                </td>

                <td className="px-6 py-4 text-zinc-600">{member.order}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      member.status === "Visible"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {members.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                  Aucun membre ajouté.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}