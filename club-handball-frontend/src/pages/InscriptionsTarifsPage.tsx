import { useEffect, useState } from "react";
import {
  getPublicRegistrationInfo,
  type RegistrationInfo,
} from "../services/registrationInfoService";

function formatTextWithLines(text?: string) {
  if (!text) {
    return null;
  }

  return text.split("\n").map((line, index) => {
    const cleanLine = line.trim();

    if (!cleanLine) {
      return <br key={index} />;
    }

    return (
      <p key={index} className="mb-1">
        {cleanLine}
      </p>
    );
  });
}

function InscriptionTarifsPage() {
  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationInfo = async () => {
      try {
        const data = await getPublicRegistrationInfo();
        setRegistrationInfo(data);
      } catch (error) {
        console.error("Erreur chargement inscription et tarifs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationInfo();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-600">Chargement des informations...</p>
        </div>
      </main>
    );
  }

  if (!registrationInfo) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-extrabold text-gray-950">
            Inscription & Tarifs
          </h1>

          <p className="mt-4 text-gray-600">
            Les informations d’inscription ne sont pas encore disponibles.
          </p>
        </div>
      </main>
    );
  }

  const documents = [...registrationInfo.documents].sort(
    (a, b) => a.order - b.order
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Licences
          </p>

          <h1 className="text-4xl font-extrabold md:text-5xl">
            Inscription & Tarifs
          </h1>

          {registrationInfo.season && (
            <p className="mt-4 max-w-3xl text-lg text-gray-300">
              Saison {registrationInfo.season}
            </p>
          )}
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-10">
          <section className="rounded-[28px] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-600">
                Documents
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                Documents à télécharger
              </h2>
            </div>

            {documents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {documents.map((document) => (
                  <article
                    key={document._id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center"
                  >
                    <div>
                      <h3 className="font-bold text-gray-950">
                        {document.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Document officiel du club
                      </p>
                    </div>

                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gray-950 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                    >
                      Télécharger
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Aucun document n’est disponible pour le moment.
              </p>
            )}
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-600">
                Paiement
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                Moyens de paiement
              </h2>
            </div>

            <div className="prose max-w-none text-gray-700">
              {formatTextWithLines(registrationInfo.paymentMethodsText)}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-600">
                Aides
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                Réductions possibles
              </h2>
            </div>

            <div className="prose max-w-none text-gray-700">
              {formatTextWithLines(registrationInfo.reductionsText)}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-600">
                Tarifs
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                Tarifs des licences
              </h2>
            </div>

            {registrationInfo.pricingImageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <img
                  src={registrationInfo.pricingImageUrl}
                  alt={`Tarifs des licences ${registrationInfo.season}`}
                  className="h-auto w-full object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-600">
                L’image des tarifs n’est pas encore disponible.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default InscriptionTarifsPage;