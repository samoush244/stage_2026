import { useEffect, useState } from "react";
import {
  createEvent,
  deleteEvent,
  getAdminEvents,
  updateEvent,
  type EventItem,
} from "../../services/eventService";

type EventType = "Match" | "Tournoi" | "Stage" | "Soirée club" | "Autre";
type EventStatus = "Visible" | "Masqué";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("Match");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");
  const [ticketingUrl, setTicketingUrl] = useState("");
  const [status, setStatus] = useState<EventStatus>("Visible");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [, setError] = useState("");

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return `${API_URL}${imagePath}`;
  }

  return `${API_URL}/${imagePath}`;
};

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAdminEvents();
      setEvents(data);
    } catch (error) {
      console.error("Erreur récupération événements :", error);
      setError("Impossible de récupérer les événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  function resetForm() {
    setTitle("");
    setType("Match");
    setDate("");
    setTime("");
    setLocation("");
    setImageFile(null);
    setImagePreview("");
    setDescription("");
    setTicketingUrl("");
    setStatus("Visible");
    setEditingId(null);
    setError("");
  }

  function formatDateForInput(value: string) {
    if (!value) return "";
    return value.slice(0, 10);
  }

  function formatDateForDisplay(value: string) {
    if (!value) return "";
    return new Date(value).toLocaleDateString("fr-FR");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData =new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("ticketUrl", ticketingUrl);
      formData.append("isTicketingEnabled", ticketingUrl ? "true" : "false");
      formData.append("isPublished", status === "Visible" ? "true" : "false");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingId) {
        await updateEvent(editingId, formData);
      } else {
        await createEvent(formData);
      }

      await fetchEvents();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Erreur enregistrement événement :", error);
      setError("Erreur lors de l’enregistrement de l’événement.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(event: EventItem) {
    setEditingId(event._id);
    setTitle(event.title);
    setType(event.type);
    setDate(formatDateForInput(event.date));
    setTime(event.time || "");
    setLocation(event.location || "");
    setImageFile(null);
    setImagePreview(getImageUrl(event.image));
    setDescription(event.description || "");
    setTicketingUrl(event.ticketUrl || "");
    setStatus(event.isPublished ? "Visible" : "Masqué");
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cet événement ?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Erreur suppression événement :", error);
      setError("Erreur lors de la suppression de l’événement.");
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Événements / Billetterie
          </h1>
          <p className="mt-2 text-zinc-600">
            Créer des événements et associer un lien de billetterie.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouvel événement
        </button>
      </div>


      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId ? "Modifier un événement" : "Créer un événement"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Titre de l’événement"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Match">Match</option>
              <option value="Tournoi">Tournoi</option>
              <option value="Stage">Stage</option>
              <option value="Soirée club">Soirée club</option>
              <option value="Autre">Autre</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Lieu"
            />

            <input
              type="url"
              value={ticketingUrl}
              onChange={(e) => setTicketingUrl(e.target.value)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
              placeholder="Lien HelloAsso / billetterie"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>{
                const file = e .target.files?.[0];

                if(file){
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Visible">Visible</option>
              <option value="Masqué">Masqué</option>
            </select>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3 md:col-span-2"
              placeholder="Description de l’événement"
            />

            {imagePreview && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu image
                </p>
                <img
                  src={imagePreview}
                  alt="Aperçu événement"
                  className="h-40 w-64 rounded-xl object-cover"
                />
              </div>
            )}

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving
                  ? "Enregistrement..."
                  : editingId
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
              <th className="px-6 py-4">Événement</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Lieu</th>
              <th className="px-6 py-4">Billetterie</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                  Chargement des événements...
                </td>
              </tr>
            )}

            {!loading &&
              events.map((event) => (
                <tr key={event._id} className="border-t border-zinc-200">
                  <td className="px-6 py-4">
                   {event.image ? (
                    <img src={getImageUrl(event.image)}
                    alt={event.title}
                      className="h-16 w-24 rounded-lg object-cover"
                        />
                      ) : (
                      <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-zinc-200 text-xs text-zinc-500">
                        —
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium text-zinc-800">
                    {event.title}
                  </td>

                  <td className="px-6 py-4 text-zinc-600">{event.type}</td>

                  <td className="px-6 py-4 text-zinc-600">
                    {formatDateForDisplay(event.date)} à {event.time}
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {event.location}
                  </td>

                  <td className="px-6 py-4">
                    {event.ticketUrl ? (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Voir le lien
                      </a>
                    ) : (
                      <span className="text-zinc-400">Aucun lien</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        event.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {event.isPublished ? "Visible" : "Masqué"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && events.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                  Aucun événement créé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}