import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/getImageUrl";

type EngagementLabel = {
  _id: string;
  name: string;
  logo: string;
  description?: string;
  year?: string;
  order: number;
  isActive: boolean;
};

type EngagementGalleryItem = {
  _id: string;
  image: string;
  title: string;
  description: string;
  actionDate?: string;
  order: number;
  isActive: boolean;
};

type EngagementPageData = {
  partnerName: string;
  partnerLogo: string;
  partnerWebsite?: string;
  introText: string;
  labels: EngagementLabel[];
  gallery: EngagementGalleryItem[];
};

type SettingsForm = {
  partnerName: string;
  partnerWebsite: string;
  introText: string;
};

type LabelForm = {
  name: string;
  description: string;
  year: string;
  order: number;
  isActive: boolean;
};

type GalleryForm = {
  title: string;
  description: string;
  actionDate: string;
  order: number;
  isActive: boolean;
};

const emptyLabelForm: LabelForm = {
  name: "",
  description: "",
  year: "",
  order: 0,
  isActive: true,
};

const emptyGalleryForm: GalleryForm = {
  title: "",
  description: "",
  actionDate: "",
  order: 0,
  isActive: true,
};

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  return apiError.response?.data?.message || fallback;
}

function toInputDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
}

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function useImagePreview(file: File | null) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return preview;
}

function AdminEngagementDurableCitoyenPage() {
  const [pageData, setPageData] = useState<EngagementPageData | null>(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
    partnerName: "",
    partnerWebsite: "",
    introText: "",
  });
  const [partnerLogoFile, setPartnerLogoFile] = useState<File | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const [labelForm, setLabelForm] = useState<LabelForm>(emptyLabelForm);
  const [labelLogoFile, setLabelLogoFile] = useState<File | null>(null);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [savingLabel, setSavingLabel] = useState(false);

  const [galleryForm, setGalleryForm] =
    useState<GalleryForm>(emptyGalleryForm);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [savingGallery, setSavingGallery] = useState(false);

  const partnerLogoPreview = useImagePreview(partnerLogoFile);
  const labelLogoPreview = useImagePreview(labelLogoFile);
  const galleryImagePreview = useImagePreview(galleryImageFile);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get<EngagementPageData>(
        "/engagement-durable-citoyen/admin"
      );

      setPageData(response.data);

      setSettingsForm({
        partnerName: response.data.partnerName || "",
        partnerWebsite: response.data.partnerWebsite || "",
        introText: response.data.introText || "",
      });
    } catch (err) {
      console.error("Erreur récupération admin engagement :", err);
      setError(
        getErrorMessage(
          err,
          "Impossible de récupérer les informations de cette page."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const resetLabelForm = () => {
    setLabelForm(emptyLabelForm);
    setLabelLogoFile(null);
    setEditingLabelId(null);
  };

  const resetGalleryForm = () => {
    setGalleryForm(emptyGalleryForm);
    setGalleryImageFile(null);
    setEditingGalleryId(null);
  };

  const handleSaveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingSettings(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("partnerName", settingsForm.partnerName);
      formData.append("partnerWebsite", settingsForm.partnerWebsite);
      formData.append("introText", settingsForm.introText);

      if (partnerLogoFile) {
        formData.append("partnerLogo", partnerLogoFile);
      }

      await API.put(
        "/engagement-durable-citoyen/admin/settings",
        formData
      );

      setPartnerLogoFile(null);
      setMessage("Les informations du partenaire ont été mises à jour.");

      await fetchEngagementData();
    } catch (err) {
      console.error("Erreur sauvegarde paramètres engagement :", err);
      setError(
        getErrorMessage(
          err,
          "Impossible de mettre à jour les informations du partenaire."
        )
      );
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveLabel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingLabelId && !labelLogoFile) {
      setError("Le logo du label est obligatoire.");
      return;
    }

    try {
      setSavingLabel(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("name", labelForm.name);
      formData.append("description", labelForm.description);
      formData.append("year", labelForm.year);
      formData.append("order", String(labelForm.order));
      formData.append("isActive", String(labelForm.isActive));

      if (labelLogoFile) {
        formData.append("labelLogo", labelLogoFile);
      }

      if (editingLabelId) {
        await API.put(
          `/engagement-durable-citoyen/admin/labels/${editingLabelId}`,
          formData
        );

        setMessage("Le label a été modifié.");
      } else {
        await API.post("/engagement-durable-citoyen/admin/labels", formData);

        setMessage("Le label a été ajouté.");
      }

      resetLabelForm();
      await fetchEngagementData();
    } catch (err) {
      console.error("Erreur sauvegarde label :", err);
      setError(
        getErrorMessage(err, "Impossible d'enregistrer ce label.")
      );
    } finally {
      setSavingLabel(false);
    }
  };

  const handleEditLabel = (label: EngagementLabel) => {
    setEditingLabelId(label._id);
    setLabelLogoFile(null);

    setLabelForm({
      name: label.name,
      description: label.description || "",
      year: label.year || "",
      order: label.order || 0,
      isActive: label.isActive !== false,
    });

    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  };

  const handleDeleteLabel = async (labelId: string) => {
    const confirmed = window.confirm(
      "Supprimer définitivement ce label ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await API.delete(
        `/engagement-durable-citoyen/admin/labels/${labelId}`
      );

      if (editingLabelId === labelId) {
        resetLabelForm();
      }

      setMessage("Le label a été supprimé.");
      await fetchEngagementData();
    } catch (err) {
      console.error("Erreur suppression label :", err);
      setError(
        getErrorMessage(err, "Impossible de supprimer ce label.")
      );
    }
  };

  const handleSaveGalleryItem = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingGalleryId && !galleryImageFile) {
      setError("Une image est obligatoire.");
      return;
    }

    try {
      setSavingGallery(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("title", galleryForm.title);
      formData.append("description", galleryForm.description);
      formData.append("actionDate", galleryForm.actionDate);
      formData.append("order", String(galleryForm.order));
      formData.append("isActive", String(galleryForm.isActive));

      if (galleryImageFile) {
        formData.append("galleryImage", galleryImageFile);
      }

      if (editingGalleryId) {
        await API.put(
          `/engagement-durable-citoyen/admin/gallery/${editingGalleryId}`,
          formData
        );

        setMessage("La photo a été modifiée.");
      } else {
        await API.post("/engagement-durable-citoyen/admin/gallery", formData);

        setMessage("La photo a été ajoutée à la galerie.");
      }

      resetGalleryForm();
      await fetchEngagementData();
    } catch (err) {
      console.error("Erreur sauvegarde galerie :", err);
      setError(
        getErrorMessage(err, "Impossible d'enregistrer cette photo.")
      );
    } finally {
      setSavingGallery(false);
    }
  };

  const handleEditGalleryItem = (item: EngagementGalleryItem) => {
    setEditingGalleryId(item._id);
    setGalleryImageFile(null);

    setGalleryForm({
      title: item.title,
      description: item.description,
      actionDate: toInputDate(item.actionDate),
      order: item.order || 0,
      isActive: item.isActive !== false,
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleDeleteGalleryItem = async (galleryId: string) => {
    const confirmed = window.confirm(
      "Supprimer définitivement cette photo de la galerie ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await API.delete(
        `/engagement-durable-citoyen/admin/gallery/${galleryId}`
      );

      if (editingGalleryId === galleryId) {
        resetGalleryForm();
      }

      setMessage("La photo a été supprimée.");
      await fetchEngagementData();
    } catch (err) {
      console.error("Erreur suppression photo galerie :", err);
      setError(
        getErrorMessage(err, "Impossible de supprimer cette photo.")
      );
    }
  };

  const labels = [...(pageData?.labels || [])].sort(
    (first, second) => first.order - second.order
  );

  const gallery = [...(pageData?.gallery || [])].sort(
    (first, second) => first.order - second.order
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <p className="text-center text-gray-600">
          Chargement des informations...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-black uppercase text-black sm:text-4xl">
            Engagement durable et citoyen
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            Gérez le partenaire, les labels et les photos visibles sur la page
            publique.
          </p>
        </div>

        {message && (
          <div className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </div>
        )}

        {/* PARTENAIRE */}
        <section className="mb-8 rounded-xl bg-white p-5 shadow-sm sm:p-7">
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-2xl font-black uppercase text-black">
              Partenaire de la page
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ce partenaire apparaît dans l’introduction de la page publique.
            </p>
          </div>

          <form
            onSubmit={handleSaveSettings}
            className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]"
          >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="partnerName"
                  className="mb-2 block text-sm font-bold text-gray-800"
                >
                  Nom du partenaire
                </label>

                <input
                  id="partnerName"
                  type="text"
                  value={settingsForm.partnerName}
                  onChange={(event) =>
                    setSettingsForm((current) => ({
                      ...current,
                      partnerName: event.target.value,
                    }))
                  }
                  placeholder="Exemple : Toyota Valenciennes"
                  className="w-full border border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label
                  htmlFor="partnerWebsite"
                  className="mb-2 block text-sm font-bold text-gray-800"
                >
                  Site internet du partenaire
                </label>

                <input
                  id="partnerWebsite"
                  type="url"
                  value={settingsForm.partnerWebsite}
                  onChange={(event) =>
                    setSettingsForm((current) => ({
                      ...current,
                      partnerWebsite: event.target.value,
                    }))
                  }
                  placeholder="https://www.exemple.fr"
                  className="w-full border border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label
                  htmlFor="introText"
                  className="mb-2 block text-sm font-bold text-gray-800"
                >
                  Texte d’introduction
                </label>

                <textarea
                  id="introText"
                  rows={7}
                  value={settingsForm.introText}
                  onChange={(event) =>
                    setSettingsForm((current) => ({
                      ...current,
                      introText: event.target.value,
                    }))
                  }
                  className="w-full resize-y border border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="partnerLogo"
                className="mb-2 block text-sm font-bold text-gray-800"
              >
                Logo du partenaire
              </label>

              <div className="flex min-h-52 items-center justify-center border border-dashed border-gray-300 bg-gray-50 p-4">
                {partnerLogoPreview ? (
                  <img
                    src={partnerLogoPreview}
                    alt="Aperçu nouveau logo partenaire"
                    className="max-h-40 w-full object-contain"
                  />
                ) : pageData?.partnerLogo ? (
                  <img
                    src={getImageUrl(pageData.partnerLogo)}
                    alt="Logo partenaire actuel"
                    className="max-h-40 w-full object-contain"
                  />
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    Aucun logo ajouté
                  </p>
                )}
              </div>

              <input
                id="partnerLogo"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(event) =>
                  setPartnerLogoFile(event.target.files?.[0] || null)
                }
                className="mt-3 block w-full text-sm text-gray-600"
              />

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG ou WEBP — 8 Mo maximum.
              </p>
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingSettings
                  ? "Enregistrement..."
                  : "Enregistrer le partenaire"}
              </button>
            </div>
          </form>
        </section>

        {/* LABELS */}
        <section className="mb-8 rounded-xl bg-white p-5 shadow-sm sm:p-7">
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-2xl font-black uppercase text-black">
              Labels et reconnaissances
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ajoutez les labels officiels obtenus par le club.
            </p>
          </div>

          <div className="mt-7 grid gap-8 xl:grid-cols-[1fr_400px]">
            <div>
              {labels.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {labels.map((label) => (
                    <article
                      key={label._id}
                      className="border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={getImageUrl(label.logo)}
                          alt={`Logo ${label.name}`}
                          className="h-20 w-20 shrink-0 object-contain"
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold uppercase text-black">
                              {label.name}
                            </h3>

                            {!label.isActive && (
                              <span className="bg-gray-200 px-2 py-1 text-xs font-bold text-gray-700">
                                Masqué
                              </span>
                            )}
                          </div>

                          {label.description && (
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                              {label.description}
                            </p>
                          )}

                          <p className="mt-3 text-sm font-bold text-red-700">
                            {label.year || "Année non renseignée"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Ordre : {label.order}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditLabel(label)}
                          className="border border-black px-3 py-2 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteLabel(label._id)}
                          className="border border-red-700 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-700 hover:text-white"
                        >
                          Supprimer
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 px-5 py-10 text-center text-gray-500">
                  Aucun label n’a encore été ajouté.
                </div>
              )}
            </div>

            <form
              onSubmit={handleSaveLabel}
              className="h-fit border border-gray-200 bg-gray-50 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black uppercase text-black">
                  {editingLabelId ? "Modifier un label" : "Ajouter un label"}
                </h3>

                {editingLabelId && (
                  <button
                    type="button"
                    onClick={resetLabelForm}
                    className="text-sm font-bold text-red-700 hover:underline"
                  >
                    Annuler
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="labelName"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Nom du label *
                  </label>

                  <input
                    id="labelName"
                    type="text"
                    required
                    value={labelForm.name}
                    onChange={(event) =>
                      setLabelForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="labelDescription"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Description
                  </label>

                  <textarea
                    id="labelDescription"
                    rows={4}
                    value={labelForm.description}
                    onChange={(event) =>
                      setLabelForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="w-full resize-y border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="labelYear"
                      className="mb-2 block text-sm font-bold text-gray-800"
                    >
                      Année
                    </label>

                    <input
                      id="labelYear"
                      type="text"
                      value={labelForm.year}
                      onChange={(event) =>
                        setLabelForm((current) => ({
                          ...current,
                          year: event.target.value,
                        }))
                      }
                      placeholder="2026"
                      className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="labelOrder"
                      className="mb-2 block text-sm font-bold text-gray-800"
                    >
                      Ordre
                    </label>

                    <input
                      id="labelOrder"
                      type="number"
                      min="0"
                      value={labelForm.order}
                      onChange={(event) =>
                        setLabelForm((current) => ({
                          ...current,
                          order: Number(event.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="labelLogo"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Logo {!editingLabelId && "*"}
                  </label>

                  {labelLogoPreview && (
                    <div className="mb-3 flex h-28 items-center justify-center border border-gray-200 bg-white p-3">
                      <img
                        src={labelLogoPreview}
                        alt="Aperçu logo label"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <input
                    id="labelLogo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(event) =>
                      setLabelLogoFile(event.target.files?.[0] || null)
                    }
                    className="block w-full text-sm text-gray-600"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={labelForm.isActive}
                    onChange={(event) =>
                      setLabelForm((current) => ({
                        ...current,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-red-700"
                  />
                  Afficher ce label sur le site
                </label>

                <button
                  type="submit"
                  disabled={savingLabel}
                  className="w-full bg-black px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingLabel
                    ? "Enregistrement..."
                    : editingLabelId
                    ? "Enregistrer les modifications"
                    : "Ajouter le label"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* GALERIE */}
        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-2xl font-black uppercase text-black">
              Galerie — Nos actions en images
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Chaque photo est cliquable sur le site public et ouvre sa
              description complète.
            </p>
          </div>

          <div className="mt-7">
            {gallery.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {gallery.map((item) => (
                  <article
                    key={item._id}
                    className="overflow-hidden border border-gray-200 bg-white"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="aspect-[4/3] w-full object-cover"
                    />

                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold uppercase text-black">
                          {item.title}
                        </h3>

                        {!item.isActive && (
                          <span className="bg-gray-200 px-2 py-1 text-xs font-bold text-gray-700">
                            Masquée
                          </span>
                        )}
                      </div>

                      {item.actionDate && (
                        <p className="mt-2 text-sm font-semibold text-red-700">
                          {formatDate(item.actionDate)}
                        </p>
                      )}

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>

                      <p className="mt-3 text-xs text-gray-500">
                        Ordre : {item.order}
                      </p>

                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditGalleryItem(item)}
                          className="border border-black px-3 py-2 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item._id)}
                          className="border border-red-700 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-700 hover:text-white"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 px-5 py-10 text-center text-gray-500">
                Aucune photo n’a encore été ajoutée à la galerie.
              </div>
            )}
          </div>

          <form
            onSubmit={handleSaveGalleryItem}
            className="mt-10 border-t border-gray-200 pt-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black uppercase text-black">
                  {editingGalleryId
                    ? "Modifier une photo"
                    : "Ajouter une photo"}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  La description sera visible lorsque le visiteur clique sur
                  l’image.
                </p>
              </div>

              {editingGalleryId && (
                <button
                  type="button"
                  onClick={resetGalleryForm}
                  className="text-sm font-bold text-red-700 hover:underline"
                >
                  Annuler la modification
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_280px]">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="galleryTitle"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Titre de l’action *
                  </label>

                  <input
                    id="galleryTitle"
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(event) =>
                      setGalleryForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Exemple : Collecte solidaire"
                    className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="galleryDate"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Date de l’action
                  </label>

                  <input
                    id="galleryDate"
                    type="date"
                    value={galleryForm.actionDate}
                    onChange={(event) =>
                      setGalleryForm((current) => ({
                        ...current,
                        actionDate: event.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="galleryOrder"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Ordre d’affichage
                  </label>

                  <input
                    id="galleryOrder"
                    type="number"
                    min="0"
                    value={galleryForm.order}
                    onChange={(event) =>
                      setGalleryForm((current) => ({
                        ...current,
                        order: Number(event.target.value),
                      }))
                    }
                    className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="galleryDescription"
                    className="mb-2 block text-sm font-bold text-gray-800"
                  >
                    Description *
                  </label>

                  <textarea
                    id="galleryDescription"
                    required
                    rows={8}
                    value={galleryForm.description}
                    onChange={(event) =>
                      setGalleryForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Expliquez l’action réalisée, les personnes impliquées et son objectif."
                    className="w-full resize-y border border-gray-300 px-3 py-2.5 outline-none focus:border-red-700"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={galleryForm.isActive}
                    onChange={(event) =>
                      setGalleryForm((current) => ({
                        ...current,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-red-700"
                  />
                  Afficher cette photo sur le site
                </label>
              </div>

              <div>
                <label
                  htmlFor="galleryImage"
                  className="mb-2 block text-sm font-bold text-gray-800"
                >
                  Photo {!editingGalleryId && "*"}
                </label>

                <div className="flex aspect-[4/3] items-center justify-center border border-dashed border-gray-300 bg-gray-50 p-3">
                  {galleryImagePreview ? (
                    <img
                      src={galleryImagePreview}
                      alt="Aperçu de la photo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      Sélectionnez une image
                    </p>
                  )}
                </div>

                <input
                  id="galleryImage"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(event) =>
                    setGalleryImageFile(event.target.files?.[0] || null)
                  }
                  className="mt-3 block w-full text-sm text-gray-600"
                />

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG ou WEBP — 8 Mo maximum.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingGallery}
              className="mt-6 bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingGallery
                ? "Enregistrement..."
                : editingGalleryId
                ? "Enregistrer les modifications"
                : "Ajouter la photo"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default AdminEngagementDurableCitoyenPage;