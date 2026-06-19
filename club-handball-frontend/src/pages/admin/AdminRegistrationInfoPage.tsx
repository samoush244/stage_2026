import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  addRegistrationDocument,
  deletePricingImage,
  deleteRegistrationDocument,
  getAdminRegistrationInfo,
  updatePricingImage,
  updateRegistrationDocument,
  updateRegistrationInfo,
  type RegistrationDocument,
  type RegistrationInfo,
} from "../../services/registrationInfoService";

type DocumentFormState = {
  title: string;
  order: number;
  isActive: boolean;
  file: File | null;
};

const emptyDocumentForm: DocumentFormState = {
  title: "",
  order: 1,
  isActive: true,
  file: null,
};

function AdminRegistrationInfoPage() {
  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInfo | null>(null);

  const [season, setSeason] = useState("");
  const [paymentMethodsText, setPaymentMethodsText] = useState("");
  const [reductionsText, setReductionsText] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [documentForm, setDocumentForm] =
    useState<DocumentFormState>(emptyDocumentForm);

  const [pricingImageFile, setPricingImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [addingDocument, setAddingDocument] = useState(false);
  const [uploadingPricingImage, setUploadingPricingImage] = useState(false);
  const [message, setMessage] = useState("");

  const loadRegistrationInfo = async () => {
    try {
      setLoading(true);

      const data = await getAdminRegistrationInfo();

      setRegistrationInfo(data);
      setSeason(data.season || "");
      setPaymentMethodsText(data.paymentMethodsText || "");
      setReductionsText(data.reductionsText || "");
      setIsActive(data.isActive);
    } catch (error) {
      console.error("Erreur chargement admin inscription :", error);
      setMessage("Impossible de charger les informations d’inscription.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrationInfo();
  }, []);

  const handleSaveInfo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingInfo(true);
      setMessage("");

      const updatedInfo = await updateRegistrationInfo({
        season,
        paymentMethodsText,
        reductionsText,
        isActive,
      });

      setRegistrationInfo(updatedInfo);
      setMessage("Informations mises à jour avec succès.");
    } catch (error) {
      console.error("Erreur sauvegarde inscription :", error);
      setMessage("Erreur lors de la sauvegarde des informations.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleAddDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!documentForm.title.trim()) {
      setMessage("Le nom du document est obligatoire.");
      return;
    }

    if (!documentForm.file) {
      setMessage("Le fichier du document est obligatoire.");
      return;
    }

    try {
      setAddingDocument(true);
      setMessage("");

      const updatedInfo = await addRegistrationDocument({
        title: documentForm.title,
        order: documentForm.order,
        isActive: documentForm.isActive,
        file: documentForm.file,
      });

      setRegistrationInfo(updatedInfo);
      setDocumentForm(emptyDocumentForm);
      setMessage("Document ajouté avec succès.");
    } catch (error) {
      console.error("Erreur ajout document :", error);
      setMessage("Erreur lors de l’ajout du document.");
    } finally {
      setAddingDocument(false);
    }
  };

  const handleUpdateDocument = async (
    document: RegistrationDocument,
    field: "title" | "order" | "isActive",
    value: string | number | boolean
  ) => {
    try {
      setMessage("");

      const updatedDocument = {
        title: field === "title" ? String(value) : document.title,
        order: field === "order" ? Number(value) : document.order,
        isActive:
          field === "isActive" ? Boolean(value) : Boolean(document.isActive),
      };

      const updatedInfo = await updateRegistrationDocument(
        document._id,
        updatedDocument
      );

      setRegistrationInfo(updatedInfo);
      setMessage("Document mis à jour.");
    } catch (error) {
      console.error("Erreur modification document :", error);
      setMessage("Erreur lors de la modification du document.");
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce document ?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");

      const updatedInfo = await deleteRegistrationDocument(documentId);

      setRegistrationInfo(updatedInfo);
      setMessage("Document supprimé.");
    } catch (error) {
      console.error("Erreur suppression document :", error);
      setMessage("Erreur lors de la suppression du document.");
    }
  };

  const handleUploadPricingImage = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!pricingImageFile) {
      setMessage("Veuillez choisir une image pour les tarifs.");
      return;
    }

    try {
      setUploadingPricingImage(true);
      setMessage("");

      const updatedInfo = await updatePricingImage(pricingImageFile);

      setRegistrationInfo(updatedInfo);
      setPricingImageFile(null);
      setMessage("Image des tarifs mise à jour.");
    } catch (error) {
      console.error("Erreur upload tarifs :", error);
      setMessage("Erreur lors de l’upload de l’image des tarifs.");
    } finally {
      setUploadingPricingImage(false);
    }
  };

  const handleDeletePricingImage = async () => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer l’image des tarifs ?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");

      const updatedInfo = await deletePricingImage();

      setRegistrationInfo(updatedInfo);
      setMessage("Image des tarifs supprimée.");
    } catch (error) {
      console.error("Erreur suppression image tarifs :", error);
      setMessage("Erreur lors de la suppression de l’image des tarifs.");
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Chargement...</p>
      </main>
    );
  }

  const documents = [...(registrationInfo?.documents || [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <main className="space-y-8 p-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-gray-950">
          Inscription & Tarifs
        </h1>

        <p className="mt-2 text-gray-600">
          Gérez les documents à télécharger, les moyens de paiement, les
          réductions possibles et l’image des tarifs.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-700 shadow-sm">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSaveInfo}
        className="space-y-6 rounded-[28px] bg-white p-6 shadow-sm"
      >
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-extrabold text-gray-950">
            Informations générales
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Saison
            </label>

            <input
              type="text"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
              placeholder="2025/2026"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div className="flex items-center gap-3 pt-7">
            <input
              id="registration-active"
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-5 w-5 accent-red-600"
            />

            <label
              htmlFor="registration-active"
              className="text-sm font-bold text-gray-700"
            >
              Afficher la page publiquement
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Moyens de paiement
          </label>

          <textarea
            value={paymentMethodsText}
            onChange={(event) => setPaymentMethodsText(event.target.value)}
            rows={7}
            placeholder={`Le règlement de la licence peut être effectué par :
- Chèque
- Espèces
- Virement bancaire
- Chèques vacances
- Paiement en plusieurs fois possible`}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Réductions possibles
          </label>

          <textarea
            value={reductionsText}
            onChange={(event) => setReductionsText(event.target.value)}
            rows={8}
            placeholder={`- 2ème licence d’une famille : -10 €
- 3ème licence d’une famille : -15 €
- Pass Sport accepté
- Coupon Sport accepté
- Carte Sortir acceptée
Les justificatifs peuvent être demandés par le club.`}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
          />
        </div>

        <button
          type="submit"
          disabled={savingInfo}
          className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingInfo ? "Sauvegarde..." : "Sauvegarder les informations"}
        </button>
      </form>

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-extrabold text-gray-950">
            Documents à télécharger
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Ajoutez les PDF ou images que les visiteurs pourront télécharger.
          </p>
        </div>

        <form
          onSubmit={handleAddDocument}
          className="mb-8 grid gap-4 rounded-2xl bg-gray-50 p-5 md:grid-cols-[1fr_140px_180px] md:items-end"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Nom du document
            </label>

            <input
              type="text"
              value={documentForm.title}
              onChange={(event) =>
                setDocumentForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              placeholder="Certificat médical"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Ordre
            </label>

            <input
              type="number"
              min="0"
              value={documentForm.order}
              onChange={(event) =>
                setDocumentForm((prev) => ({
                  ...prev,
                  order: Number(event.target.value),
                }))
              }
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div className="flex items-center gap-3 pb-3">
            <input
              id="new-document-active"
              type="checkbox"
              checked={documentForm.isActive}
              onChange={(event) =>
                setDocumentForm((prev) => ({
                  ...prev,
                  isActive: event.target.checked,
                }))
              }
              className="h-5 w-5 accent-red-600"
            />

            <label
              htmlFor="new-document-active"
              className="text-sm font-bold text-gray-700"
            >
              Actif
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Fichier
            </label>

            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
              onChange={(event) =>
                setDocumentForm((prev) => ({
                  ...prev,
                  file: event.target.files?.[0] || null,
                }))
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={addingDocument}
            className="rounded-full bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addingDocument ? "Ajout..." : "Ajouter"}
          </button>
        </form>

        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document) => (
              <article
                key={document._id}
                className="grid gap-4 rounded-2xl border border-gray-200 p-4 md:grid-cols-[1fr_120px_100px_240px] md:items-center"
              >
                <input
                  type="text"
                  value={document.title}
                  onChange={(event) =>
                    handleUpdateDocument(document, "title", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-600"
                />

                <input
                  type="number"
                  min="0"
                  value={document.order}
                  onChange={(event) =>
                    handleUpdateDocument(
                      document,
                      "order",
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-600"
                />

                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={document.isActive}
                    onChange={(event) =>
                      handleUpdateDocument(
                        document,
                        "isActive",
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-red-600"
                  />
                  Actif
                </label>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                  >
                    Voir
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(document._id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucun document ajouté pour le moment.</p>
        )}
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-extrabold text-gray-950">
            Image des tarifs
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Ajoutez l’image contenant le tableau des tarifs de licences.
          </p>
        </div>

        {registrationInfo?.pricingImageUrl && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            <img
              src={registrationInfo.pricingImageUrl}
              alt="Tarifs des licences"
              className="h-auto w-full object-contain"
            />
          </div>
        )}

        <form
          onSubmit={handleUploadPricingImage}
          className="flex flex-col gap-4 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Nouvelle image des tarifs
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(event) =>
                setPricingImageFile(event.target.files?.[0] || null)
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={uploadingPricingImage}
            className="rounded-full bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingPricingImage ? "Upload..." : "Mettre à jour"}
          </button>

          {registrationInfo?.pricingImageUrl && (
            <button
              type="button"
              onClick={handleDeletePricingImage}
              className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Supprimer
            </button>
          )}
        </form>
      </section>
    </main>
  );
}

export default AdminRegistrationInfoPage;