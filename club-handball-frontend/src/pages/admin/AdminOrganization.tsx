import { useEffect, useState } from "react";
import {
  createOrganizationMember,
  deleteOrganizationMember,
  getAllOrganizationMembersAdmin,
  toggleOrganizationMemberStatus,
  updateOrganizationMember,
  type OrganizationMember,
} from "../../services/organizationMemberService";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/api\/?$/, "");

function getImageUrl(photo?: string) {
  if (!photo) {
    return "";
  }

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  const cleanPhoto = photo.startsWith("/") ? photo : `/${photo}`;

  return `${BACKEND_URL}${cleanPhoto}`;
}

function AdminOrganization() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [group, setGroup] = useState<"bureau" | "ca">("bureau");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState<"Visible" | "Masqué">("Visible");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getAllOrganizationMembersAdmin();
      setMembers(data);
    } catch (error) {
      console.error("Erreur récupération organigramme admin :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setRole("");
    setGroup("bureau");
    setEmail("");
    setOrder(1);
    setStatus("Visible");
    setPhotoFile(null);
    setPhotoPreview("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const memberData = {
        firstName,
        lastName,
        role,
        group,
        email,
        order,
        isActive: status === "Visible",
        photoFile,
      };

      if (editingId) {
        await updateOrganizationMember(editingId, memberData);
      } else {
        await createOrganizationMember(memberData);
      }

      await fetchMembers();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Erreur enregistrement membre :", error);
    }
  }

  function handleEdit(member: OrganizationMember) {
    setEditingId(member._id);
    setFirstName(member.firstName);
    setLastName(member.lastName);
    setRole(member.role);
    setGroup(member.group);
    setEmail(member.email || "");
    setOrder(member.order || 1);
    setStatus(member.isActive ? "Visible" : "Masqué");
    setPhotoFile(null);
    setPhotoPreview(getImageUrl(member.photo));
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce membre ?"
    );

    if (!confirmDelete) return;

    try {
      await deleteOrganizationMember(id);
      await fetchMembers();
    } catch (error) {
      console.error("Erreur suppression membre :", error);
    }
  }

  async function handleToggleStatus(id: string) {
    try {
      await toggleOrganizationMemberStatus(id);
      await fetchMembers();
    } catch (error) {
      console.error("Erreur changement statut membre :", error);
    }
  }

  const sortedMembers = [...members].sort((a, b) => {
    return Number(a.order || 0) - Number(b.order || 0);
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Organigramme
          </h1>

          <p className="mt-2 text-zinc-600">
            Gérer les membres du bureau et les dirigeants.
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
            {editingId ? "Modifier un membre" : "Ajouter un membre"}
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
              onChange={(e) => setGroup(e.target.value as "bureau" | "ca")}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="bureau">Bureau</option>
              <option value="ca">Conseil d'administration</option>
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
                  setPhotoFile(file);
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Visible" | "Masqué")
              }
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Visible">Visible</option>
              <option value="Masqué">Masqué</option>
            </select>

            {photoPreview && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu photo
                </p>

                <img
                  src={photoPreview}
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

      <div className="w-full max-w-full overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full min-w-[900px] table-fixed border-collapse">
          <thead>
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
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                  Chargement des membres...
                </td>
              </tr>
            )}

            {!loading &&
              sortedMembers.map((member) => (
                <tr key={member._id} className="border-t border-zinc-200">
                  <td className="px-6 py-4">
                    {member.photo ? (
                      <img
                        src={getImageUrl(member.photo)}
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

                  <td className="px-6 py-4 text-zinc-600">
                    {member.role}
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {member.group === "bureau"
                      ? "Bureau"
                      : "Conseil d'administration"}
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {member.email || "Non renseigné"}
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {member.order}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(member._id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        member.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {member.isActive ? "Visible" : "Masqué"}
                    </button>
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
                        onClick={() => handleDelete(member._id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && members.length === 0 && (
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

export default AdminOrganization;