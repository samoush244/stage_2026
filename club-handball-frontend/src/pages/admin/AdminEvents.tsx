import { useState } from "react";

type EventItem = {
  id: number;
  title: string;
  type: "Match" | "Tournoi" | "Stage" | "Soirée club" | "Autre";
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  ticketingUrl: string;
  status: "Visible" | "Masqué";
};

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 1,
      title: "N3 masculine vs Lille Métropole",
      type: "Match",
      date: "2026-05-25",
      time: "20:00",
      location: "Salle du Hainaut",
      image: "/images/events/match-n3m.jpg",
      description: "Match à domicile de la Nationale 3 masculine.",
      ticketingUrl: "https://www.helloasso.com/",
      status: "Visible",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventItem["type"]>("Match");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [ticketingUrl, setTicketingUrl] = useState("");
  const [status, setStatus] = useState<EventItem["status"]>("Visible");

  function resetForm() {
    setTitle("");
    setType("Match");
    setDate("");
    setTime("");
    setLocation("");
    setImage("");
    setDescription("");
    setTicketingUrl("");
    setStatus("Visible");
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId !== null) {
      setEvents(
        events.map((event) =>
          event.id === editingId
            ? {
                ...event,
                title,
                type,
                date,
                time,
                location,
                image,
                description,
                ticketingUrl,
                status,
              }
            : event
        )
      );
    } else {
      const newEvent: EventItem = {
        id: Date.now(),
        title,
        type,
        date,
        time,
        location,
        image,
        description,
        ticketingUrl,
        status,
      };

      setEvents([newEvent, ...events]);
    }

    resetForm();
    setShowForm(false);
  }

  function handleEdit(event: EventItem) {
    setEditingId(event.id);
    setTitle(event.title);
    setType(event.type);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setImage(event.image);
    setDescription(event.description);
    setTicketingUrl(event.ticketingUrl);
    setStatus(event.status);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setEvents(events.filter((event) => event.id !== id));
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
            {editingId !== null
              ? "Modifier un événement"
              : "Créer un événement"}
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
              onChange={(e) => setType(e.target.value as EventItem["type"])}
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(URL.createObjectURL(file));
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as EventItem["status"])
              }
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

            {image && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu image
                </p>
                <img
                  src={image}
                  alt="Aperçu événement"
                  className="h-40 w-64 rounded-xl object-cover"
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
            {events.map((event) => (
              <tr key={event.id} className="border-t border-zinc-200">
                <td className="px-6 py-4">
                  {event.image ? (
                    <img
                      src={event.image}
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
                  {event.date} à {event.time}
                </td>

                <td className="px-6 py-4 text-zinc-600">
                  {event.location}
                </td>

                <td className="px-6 py-4">
                  {event.ticketingUrl ? (
                    <a
                      href={event.ticketingUrl}
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
                      event.status === "Visible"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {event.status}
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
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {events.length === 0 && (
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