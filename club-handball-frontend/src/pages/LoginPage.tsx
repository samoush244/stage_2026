import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {login} = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);
        login(data.token, data.user);


      if (data.user.roles.includes("admin")) {
        navigate("/admin");
      } else if (data.user.roles.includes("coach")) {
        navigate("/coach");
      } else {
        navigate("/espace-membre");
      }
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
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Espace membre
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Connexion
            </h1>

            <p className="mt-3 text-sm text-zinc-400">
              Connectez-vous pour accéder à votre espace personnel.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Votre mot de passe"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-400">
              Pas encore de compte ?
            </p>

            <Link
              to="/activation-compte"
              className="mt-2 inline-block text-sm font-bold text-red-500 hover:text-red-400"
            >
              Créer mon compte avec ma licence
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}