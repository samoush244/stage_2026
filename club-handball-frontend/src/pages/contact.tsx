import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Contact() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du message.");
      }

      setSuccessMessage(
        "Votre message a bien été envoyé. Nous vous répondrons rapidement."
      );
      setErrorMessage("");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSuccessMessage("");

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erreur lors de l'envoi du message.");
      }
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-red-500">
          Nous contacter
        </p>

        <h1 className="text-5xl font-black uppercase tracking-[0.18em] text-white md:text-7xl">
          Formulaire de contact
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
          Une question sur le club, les équipes, les horaires, les bénévoles, la
          Red Army ou une demande particulière ? Envoyez-nous un message.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-green-800">
            <p className="font-bold">Message envoyé ✅</p>
            <p className="mt-1 text-sm">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-800">
            <p className="font-bold">Erreur ❌</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="h-20 w-full border-2 border-zinc-300 bg-white px-8 text-xl text-zinc-700 outline-none transition focus:border-red-600"
          >
            <option value="" disabled>
              Votre demande concerne ...
            </option>
            <option value="Le club">Le club</option>
            <option value="Une inscription">Une inscription</option>
            <option value="Les équipes">Les équipes</option>
            <option value="Les horaires d’entraînement">
              Les horaires d’entraînement
            </option>
            <option value="Les bénévoles">Les bénévoles</option>
            <option value="La Red Army">La Red Army</option>
            <option value="Un partenariat">Un partenariat</option>
            <option value="Autre demande">Autre demande</option>
          </select>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Prénom *"
              className="h-20 border-2 border-zinc-300 bg-white px-8 text-xl text-zinc-700 outline-none transition placeholder:text-zinc-500 focus:border-red-600"
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Nom de famille *"
              className="h-20 border-2 border-zinc-300 bg-white px-8 text-xl text-zinc-700 outline-none transition placeholder:text-zinc-500 focus:border-red-600"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Adresse email *"
              className="h-20 border-2 border-zinc-300 bg-white px-8 text-xl text-zinc-700 outline-none transition placeholder:text-zinc-500 focus:border-red-600"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
              className="h-20 border-2 border-zinc-300 bg-white px-8 text-xl text-zinc-700 outline-none transition placeholder:text-zinc-500 focus:border-red-600"
            />
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Votre message *"
            rows={8}
            className="min-h-[260px] resize-y border-2 border-zinc-300 bg-white px-8 py-8 text-xl text-zinc-700 outline-none transition placeholder:text-zinc-500 focus:border-red-600"
          />

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-red-600 px-10 py-5 text-lg font-black uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
            >
              Envoyer
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}