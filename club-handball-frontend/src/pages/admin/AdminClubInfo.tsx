import { useEffect, useState } from "react";
import API from "../../services/api";

type HeroMediaType = "none" | "image" | "video";

type ClubInfo = {
  _id?: string;
  address: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  heroText: string;
  heroMediaType: HeroMediaType;
  heroMediaUrl: string;
};

const DEFAULT_HERO_TEXT = "Un club, une équipe, une famille.";

const emptyForm: ClubInfo = {
  address: "",
  email: "",
  phone: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  heroText: DEFAULT_HERO_TEXT,
  heroMediaType: "none",
  heroMediaUrl: "",
};

const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

function getMediaUrl(media?: string) {
  if (!media) return "";

  if (media.startsWith("http://") || media.startsWith("https://")) {
    return media;
  }

  if (media.startsWith("/")) {
    return `${BACKEND_URL}${media}`;
  }

  return `${BACKEND_URL}/${media}`;
}

export default function AdminClubInfo() {
  const [form, setForm] = useState<ClubInfo>(emptyForm);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClubInfo();
  }, []);

  const fetchClubInfo = async () => {
    try {
      const res = await API.get("/club-info");

      const data = {
        ...emptyForm,
        ...res.data,
      };

      setForm(data);

      // Aperçu du média déjà enregistré
      setPreviewUrl(data.heroMediaUrl ? getMediaUrl(data.heroMediaUrl) : "");
    } catch (error) {
      console.error("Erreur récupération infos club :", error);
      alert("Impossible de récupérer les informations du club.");
    } finally {
      setLoading(false);
    }
  };

  const hasHeroMedia =
    form.heroMediaType !== "none" &&
    Boolean(heroFile || previewUrl || form.heroMediaUrl);

  const handleHeroFileChange = (file?: File) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Choisis une image ou une vidéo.");
      return;
    }

    setHeroFile(file);

    setForm((current) => ({
      ...current,
      heroMediaType: isVideo ? "video" : "image",
    }));

    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeHeroMedia = () => {
    setHeroFile(null);
    setPreviewUrl("");

    setForm((current) => ({
      ...current,
      heroMediaType: "none",
      heroMediaUrl: "",

      // Si on supprime l'image/vidéo et que le texte est vide,
      // on remet automatiquement le texte obligatoire.
      heroText: current.heroText.trim() || DEFAULT_HERO_TEXT,
    }));
  };

  const removeHeroText = () => {
    // Le texte peut être supprimé uniquement s'il y a une image ou une vidéo.
    if (!hasHeroMedia) {
      setForm((current) => ({
        ...current,
        heroText: DEFAULT_HERO_TEXT,
      }));

      alert(
        "Le texte est obligatoire si aucune image ou vidéo n'est utilisée en fond."
      );
      return;
    }

    setForm((current) => ({
      ...current,
      heroText: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      const hasMediaToSave =
        form.heroMediaType !== "none" &&
        Boolean(heroFile || form.heroMediaUrl || previewUrl);

      // RÈGLE IMPORTANTE :
      // - Si image/vidéo présente : le texte peut être vide.
      // - Si aucun média : le texte par défaut est obligatoire.
      const heroTextToSave =
        form.heroText.trim() || (!hasMediaToSave ? DEFAULT_HERO_TEXT : "");

      formData.append("address", form.address);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("facebook", form.facebook);
      formData.append("instagram", form.instagram);
      formData.append("tiktok", form.tiktok);
      formData.append("heroText", heroTextToSave);
      formData.append("heroMediaType", form.heroMediaType);
      formData.append("heroMediaUrl", form.heroMediaUrl);

      if (heroFile) {
        formData.append("heroMedia", heroFile);
      }

      const res = await API.put("/club-info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = {
        ...emptyForm,
        ...res.data,
      };

      setForm(updatedData);
      setHeroFile(null);
      setPreviewUrl(
        updatedData.heroMediaUrl ? getMediaUrl(updatedData.heroMediaUrl) : ""
      );

      alert("Informations du club enregistrées !");
    } catch (error) {
      console.error("Erreur sauvegarde infos club :", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">
          Informations du club
        </h1>
        <p className="mt-4 text-zinc-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          Informations du club
        </h1>
        <p className="mt-2 text-zinc-600">
          Gérer les informations de contact, les réseaux sociaux et le fond de
          la page d’accueil.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-6 shadow lg:col-span-2"
        >
          <section>
            <h2 className="mb-4 text-xl font-bold text-zinc-900">
              Contact du club
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="rounded-lg border border-zinc-300 px-4 py-3"
                placeholder="Adresse / Gymnase"
              />

              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-lg border border-zinc-300 px-4 py-3"
                placeholder="Téléphone"
              />

              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-zinc-300 px-4 py-3 md:col-span-2"
                placeholder="Email de contact"
              />
            </div>
          </section>

          <section className="border-t border-zinc-200 pt-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">
              Réseaux sociaux
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
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

              <input
                type="url"
                value={form.tiktok}
                onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                className="rounded-lg border border-zinc-300 px-4 py-3 md:col-span-2"
                placeholder="Lien TikTok"
              />
            </div>
          </section>

          <section className="border-t border-zinc-200 pt-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">
              Page d’accueil
            </h2>

            <div className="grid gap-4">
              <div>
                <textarea
                  value={form.heroText}
                  onChange={(e) =>
                    setForm({ ...form, heroText: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                  placeholder="Texte affiché sur la homepage"
                />

                <p className="mt-2 text-sm text-zinc-500">
                  Le texte peut être supprimé si une image ou une vidéo est
                  utilisée en fond. S’il n’y a aucun média, le texte par défaut
                  reste obligatoire.
                </p>

                <button
                  type="button"
                  onClick={removeHeroText}
                  className="mt-3 w-fit rounded-lg border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-100"
                >
                  Supprimer le texte d’accueil
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={form.heroMediaType}
                  onChange={(e) => {
                    const value = e.target.value as HeroMediaType;

                    if (value === "none") {
                      removeHeroMedia();
                      return;
                    }

                    setForm({
                      ...form,
                      heroMediaType: value,
                    });
                  }}
                  className="rounded-lg border border-zinc-300 px-4 py-3"
                >
                  <option value="none">Aucun média</option>
                  <option value="image">Photo</option>
                  <option value="video">Vidéo</option>
                </select>

                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleHeroFileChange(e.target.files?.[0])}
                  className="rounded-lg border border-zinc-300 px-4 py-3"
                />
              </div>

              <p className="text-sm text-zinc-500">
                Conseil : utilise une image large ou une courte vidéo en format
                paysage pour un meilleur rendu sur la homepage.
              </p>

              {previewUrl && form.heroMediaType === "image" && (
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  <img
                    src={previewUrl}
                    alt="Aperçu du fond accueil"
                    className="h-72 w-full object-cover"
                  />
                </div>
              )}

              {previewUrl && form.heroMediaType === "video" && (
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  <video
                    src={previewUrl}
                    controls
                    className="h-72 w-full object-cover"
                  />
                </div>
              )}

              {form.heroMediaType !== "none" && (
                <button
                  type="button"
                  onClick={removeHeroMedia}
                  className="w-fit rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Supprimer le média de fond
                </button>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer les informations"}
          </button>
        </form>

        <aside className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            Aperçu rapide
          </h2>

          <div className="space-y-3 text-sm text-zinc-700">
            <p>
              <span className="font-bold text-zinc-900">Adresse :</span>{" "}
              {form.address || "Non renseignée"}
            </p>

            <p>
              <span className="font-bold text-zinc-900">Email :</span>{" "}
              {form.email || "Non renseigné"}
            </p>

            <p>
              <span className="font-bold text-zinc-900">Téléphone :</span>{" "}
              {form.phone || "Non renseigné"}
            </p>

            <p>
              <span className="font-bold text-zinc-900">Facebook :</span>{" "}
              {form.facebook || "Non renseigné"}
            </p>

            <p>
              <span className="font-bold text-zinc-900">Instagram :</span>{" "}
              {form.instagram || "Non renseigné"}
            </p>

            <p>
              <span className="font-bold text-zinc-900">TikTok :</span>{" "}
              {form.tiktok || "Non renseigné"}
            </p>

            <div className="border-t border-zinc-200 pt-4">
              <p className="font-bold text-zinc-900">Texte homepage :</p>
              <p>
                {form.heroText.trim()
                  ? form.heroText
                  : hasHeroMedia
                  ? "Aucun texte affiché"
                  : DEFAULT_HERO_TEXT}
              </p>
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <p className="font-bold text-zinc-900">Fond homepage :</p>
              <p>
                {form.heroMediaType === "none"
                  ? "Aucun média"
                  : form.heroMediaType === "image"
                  ? "Photo"
                  : "Vidéo"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}