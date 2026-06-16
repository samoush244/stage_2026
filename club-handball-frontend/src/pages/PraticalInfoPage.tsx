import type { Key } from "react";
import { useEffect, useState } from "react";
import API from "../services/api";
import type { PracticeCategory, ScheduleCell } from "../types/practiceCategory";

function CategoryLogo({ category }: { category: PracticeCategory }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {category.logoUrl ? (
        <img
          src={category.logoUrl}
          alt={category.title}
          className="h-32 w-32 rounded-full object-cover object-contain ring-4 ring-red-600 md:h-40 md:w-40"
        />
      ) : (
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold uppercase text-zinc-600 ring-4 ring-red-600 md:h-40 md:w-40">
          {category.title}
        </div>
      )}

      <div className="text-center lg:hidden">
        <p className="text-xl font-extrabold">{category.title}</p>

        {category.birthYearsLabel && (
          <p className="mt-1 text-sm font-semibold text-red-600">
            {category.birthYearsLabel}
          </p>
        )}
      </div>
    </div>
  );
}

function DesktopScheduleTable({ category }: { category: PracticeCategory }) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <div
        className="min-w-[760px] overflow-hidden rounded-2xl border border-zinc-800 bg-white shadow-sm"
        style={{
          display: "grid",
          gridTemplateColumns: `150px repeat(${category.columns.length}, minmax(190px, 1fr))`,
        }}
      >
        <div className="bg-black px-5 py-4 text-sm font-bold uppercase text-white">
          Jour
        </div>

        {category.columns.map((column) => (
          <div
            key={column}
            className="border-l border-zinc-800 bg-black px-5 py-4 text-center text-sm font-extrabold uppercase text-white"
          >
            {column}
          </div>
        ))}

        {category.rows.map(
          (row: { day: Key; cells: ScheduleCell[] }, rowIndex: number) => (
            <div key={String(row.day)} className="contents">
              <div
                className={`border-t border-zinc-200 px-5 py-5 font-extrabold ${
                  rowIndex % 2 === 0 ? "bg-zinc-100" : "bg-red-50"
                }`}
              >
                {row.day}
              </div>

              {category.columns.map((_, index) => {
                const cell = row.cells[index] || {};

                return (
                  <div
                    key={`${String(row.day)}-${index}`}
                    className={`border-l border-t border-zinc-200 px-5 py-5 text-center ${
                      rowIndex % 2 === 0 ? "bg-zinc-100" : "bg-red-50"
                    }`}
                  >
                    {cell.time ? (
                      <>
                        <p className="text-lg font-extrabold text-black">
                          {cell.time}
                        </p>
                        <p className="mt-1 text-sm italic text-zinc-700">
                          {cell.location}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-zinc-400">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function MobileScheduleCards({ category }: { category: PracticeCategory }) {
  return (
    <div className="space-y-4 lg:hidden">
      {category.rows.map((row) => {
        const sessions = category.columns
          .map((column, index) => ({
            ...(row.cells[index] || {}),
            group: column,
          }))
          .filter((cell) => cell.time);

        if (sessions.length === 0) {
          return null;
        }

        return (
          <div
            key={row.day}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-lg font-extrabold text-red-600">{row.day}</p>

            <div className="mt-4 space-y-3">
              {sessions.map((session) => (
                <div
                  key={`${row.day}-${session.group}`}
                  className="rounded-xl bg-zinc-100 p-4"
                >
                  <p className="text-sm font-bold uppercase text-zinc-600">
                    {session.group}
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-black">
                    {session.time}
                  </p>
                  <p className="mt-1 text-sm italic text-zinc-700">
                    {session.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrainingCategorySection({
  category,
}: {
  category: PracticeCategory;
}) {
  return (
    <section className="border-t border-zinc-200 px-6 py-14 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 hidden lg:block">
          <h2 className="text-4xl font-extrabold text-zinc-900">
            {category.title}
            {category.birthYearsLabel && (
              <span className="text-zinc-500">
                {" "}
                ({category.birthYearsLabel})
              </span>
            )}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
          <CategoryLogo category={category} />

          <div>
            <DesktopScheduleTable category={category} />
            <MobileScheduleCards category={category} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticalInfoPage() {
  const [categories, setCategories] = useState<PracticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/practice-categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Erreur récupération informations pratiques :", err);
        setError("Impossible de charger les informations pratiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Le club
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            Informations pratiques
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
            Retrouvez les catégories du club, les horaires d’entraînement et les
            salles utilisées pendant la saison.
          </p>
        </div>
      </section>

      <section className="bg-zinc-950 px-8 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Saison 2026
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Horaires par catégorie
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-gray-400">
            Les horaires peuvent évoluer selon les disponibilités des gymnases,
            les matchs, les stages ou les décisions du club.
          </p>
        </div>
      </section>

      {loading && (
        <section className="px-8 py-16">
          <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="font-semibold text-zinc-600">
              Chargement des informations pratiques...
            </p>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="px-8 py-16">
          <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>
          </div>
        </section>
      )}

      {!loading && !error && categories.length === 0 && (
        <section className="px-8 py-16">
          <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="font-semibold text-zinc-600">
              Aucune catégorie n’a encore été renseignée.
            </p>
          </div>
        </section>
      )}

      {!loading &&
        !error &&
        categories.map((category) => (
          <TrainingCategorySection key={category._id} category={category} />
        ))}

      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            À savoir
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            Informations utiles
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-extrabold text-white">Essai</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Les nouveaux joueurs peuvent généralement participer à trois
                séances d’essai avant l’inscription définitive.
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-white">Salles</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Vérifiez bien le lieu indiqué pour chaque créneau, car certaines
                catégories s’entraînent dans plusieurs gymnases.
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-white">Contact</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Pour toute question, contactez le club via l’adresse officielle
                ou la page de contact.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PracticalInfoPage;