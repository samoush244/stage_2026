import { useEffect, useMemo, useState } from "react";

type ContactMessage = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "nouveau" | "lu" | "traite";
  createdAt: string;
};

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/contact");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Erreur récupération messages contact :", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const fullText = `${msg.firstName} ${msg.lastName} ${msg.email} ${msg.subject}`;
      return fullText.toLowerCase().includes(search.toLowerCase());
    });
  }, [messages, search]);

  const updateStatus = async (
    id: string,
    status: "nouveau" | "lu" | "traite"
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/contact/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut.");
      }

      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du message.");
      }

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const totalNew = messages.filter((msg) => msg.status === "nouveau").length;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages contact</h1>
          <p className="mt-1 text-sm text-gray-500">
            {messages.length} message(s), dont {totalNew} nouveau(x)
          </p>
        </div>

        <input
          type="text"
          placeholder="Rechercher un message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-red-500"
        />
      </div>

      <div className="mt-6 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow">
            <p>Aucun message pour le moment.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg._id} className="rounded-xl bg-white p-5 shadow">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    {msg.subject}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    De {msg.firstName} {msg.lastName} • {msg.email}
                  </p>

                  {msg.phone && (
                    <p className="mt-1 text-sm text-gray-500">
                      Téléphone : {msg.phone}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-gray-400">
                    Reçu le{" "}
                    {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <select
                  value={msg.status}
                  onChange={(e) =>
                    updateStatus(
                      msg._id,
                      e.target.value as "nouveau" | "lu" | "traite"
                    )
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="lu">Lu</option>
                  <option value="traite">Traité</option>
                </select>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {msg.message}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => deleteMessage(msg._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}