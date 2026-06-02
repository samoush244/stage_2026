import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { activateAccount } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function ActivateAccountPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    licenseNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const redirectByRole = (roles: string[]) => {
    if (roles.includes("admin")) {
      navigate("/admin");
    } else if (roles.includes("coach")) {
      navigate("/coach");
    } else {
      navigate("/espace-membre");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const data = await activateAccount({
        licenseNumber: formData.licenseNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      login(data.token, data.user);

      setSuccess("Compte activé avec succès.");

      redirectByRole(data.user.roles);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Espace licencié
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Activer mon compte
            </h1>

            <p className="mt-3 text-sm text-zinc-400">
              Créez votre compte à partir de votre numéro de licence.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-300">
                Numéro de licence
              </label>

              <input
                type="text"
                name="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="Ex : 123456"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Prénom
                </label>

                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Nom
                </label>

                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-300">
                Adresse email
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Mot de passe
                </label>

                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 caractères"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Confirmer le mot de passe
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez le mot de passe"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Activation..." : "Activer mon compte"}
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-400">
              Vous avez déjà un compte ?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block text-sm font-bold text-red-500 hover:text-red-400"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}