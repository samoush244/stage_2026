import { useState, useEffect } from "react";
import { getPublicHistories } from "../services/historyServices";

type HistoryItem = {
  _id: string;
  year: string;
  image?: string;
  title: string;
  text: string[];
  details: string[];
  order?: number;
  isActive?: boolean;
};

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

const getImageUrl = (image?: string) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_BASE_URL}${image}`;
  }

  return image;
};

const normalizeHistoryItem = (item: any): HistoryItem => {
  return {
    _id: item._id,
    year: item.year || "",
    image: item.image || "",
    title: item.title || "",
    text: Array.isArray(item.text) ? item.text : item.text ? [item.text] : [],
    details: Array.isArray(item.details)
      ? item.details
      : item.details
      ? [item.details]
      : [],
    order: item.order || 0,
    isActive: item.isActive,
  };
};

/* ─────────────────────────────────────────
   MODALE
───────────────────────────────────────── */
function Modal({
  item,
  onClose,
}: {
  item: HistoryItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const imageUrl = getImageUrl(item.image);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition hover:bg-red-600 hover:text-white"
          aria-label="Fermer"
        >
          ✕
        </button>

        {imageUrl && (
          <div className="relative w-full overflow-hidden rounded-t-2xl bg-black">
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full object-contain"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

            <span className="absolute bottom-4 left-6 text-5xl font-black text-red-500 drop-shadow-lg">
              {item.year}
            </span>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="mb-1 h-1 w-16 bg-red-600" />

          <h2 className="mb-6 text-2xl font-black uppercase text-white md:text-3xl">
            {item.title}
          </h2>

          {item.text.length > 0 && (
            <div className="mb-6 space-y-3 text-base leading-7 text-zinc-300">
              {item.text.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {item.details.length > 0 && (
            <div className="space-y-3 border-t border-zinc-700 pt-6 text-base leading-7 text-zinc-400">
              {item.details.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-red-600 px-5 py-2 text-sm font-bold uppercase tracking-wide text-red-500 transition hover:bg-red-600 hover:text-white"
          >
            Fermer ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CARTE
───────────────────────────────────────── */
function HistoryCard({
  item,
  align = "left",
  onOpen,
}: {
  item: HistoryItem;
  align?: "left" | "right";
  onOpen: () => void;
}) {
  const imageUrl = getImageUrl(item.image);

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      className={`group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/30 outline-none transition-all duration-300 hover:-translate-y-2 hover:border-red-600 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-red-950/30 focus:border-red-600 ${
        align === "right" ? "md:text-right" : "md:text-left"
      }`}
    >
      <h3 className="mb-4 text-4xl font-black text-red-600 transition-colors duration-300 group-hover:text-red-500">
        {item.year}
      </h3>

      {imageUrl && (
        <div className="mb-5 overflow-hidden rounded-lg border border-zinc-800 bg-black">
          <img
            src={imageUrl}
            alt={item.title}
            className="max-h-[360px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div
        className={`mb-4 h-1 w-16 bg-red-600 transition-all duration-300 group-hover:w-24 ${
          align === "right" ? "md:ml-auto" : ""
        }`}
      />

      <h4 className="mb-4 text-2xl font-black uppercase text-white transition-colors duration-300 group-hover:text-red-50">
        {item.title}
      </h4>

      {item.text.length > 0 && (
        <div className="space-y-3 text-lg leading-8 text-zinc-300">
          {item.text.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}
    </article>
  );
}

/* ─────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────── */
export default function Histoire() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const openModal = (item: HistoryItem) => {
    setSelectedHistory(item);
  };

  const closeModal = () => {
    setSelectedHistory(null);
  };

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const data = await getPublicHistories();

        const normalizedData = data
          .map(normalizeHistoryItem)
          .sort((a: HistoryItem, b: HistoryItem) => {
            return (a.order || 0) - (b.order || 0);
          });

        setHistoryItems(normalizedData);
      } catch (error) {
        console.error("Erreur récupération histoire :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen text-white">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-center text-zinc-500">
            Chargement de l'histoire du club...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white">
      {selectedHistory && (
        <Modal item={selectedHistory} onClose={closeModal} />
      )}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16 text-center">
          <h2 className="mt-4 text-2xl font-black uppercase text-red-600 md:text-3xl">
            L'histoire du club
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 bg-red-600" />
        </div>

        {historyItems.length === 0 ? (
          <p className="text-center text-zinc-500">
            Aucune histoire n'est disponible pour le moment.
          </p>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 h-full w-[3px] bg-red-600 md:hidden" />

            <div className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 bg-red-600 md:block" />

            <div className="space-y-16">
              {historyItems.map((item, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <article
                    key={item._id}
                    className="relative grid grid-cols-1 md:grid-cols-2 md:gap-12"
                  >
                    <div className="absolute left-[11px] top-2 z-10 h-6 w-6 rounded-full border-4 border-zinc-950 bg-red-600 md:hidden" />

                    <div className="absolute left-1/2 top-6 z-10 hidden h-6 w-6 -translate-x-1/2 rounded-full border-4 border-zinc-950 bg-red-600 md:block" />

                    <div className="pl-16 md:hidden">
                      <HistoryCard
                        item={item}
                        onOpen={() => openModal(item)}
                      />
                    </div>

                    <div className="hidden md:contents">
                      {isLeft ? (
                        <>
                          <div className="flex justify-end">
                            <div className="w-full max-w-xl pr-10">
                              <HistoryCard
                                item={item}
                                align="right"
                                onOpen={() => openModal(item)}
                              />
                            </div>
                          </div>

                          <div />
                        </>
                      ) : (
                        <>
                          <div />

                          <div className="flex justify-start">
                            <div className="w-full max-w-xl pl-10">
                              <HistoryCard
                                item={item}
                                align="left"
                                onOpen={() => openModal(item)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}