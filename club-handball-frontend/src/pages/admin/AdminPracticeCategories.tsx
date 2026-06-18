import { useEffect, useState, type FormEvent } from "react";
import API from "../../services/api";
import type { PracticeCategory, ScheduleRow } from "../../types/practiceCategory";

const createEmptyCategory = (): PracticeCategory => ({
  title: "",
  birthYearsLabel: "",
  logoUrl: "",
  logoPublicId: "",
  columns: ["Catégorie"],
  rows: [
    {
      day: "Lundi",
      cells: [
        {
          time: "",
          location: "",
        },
      ],
    },
  ],
  order: 0,
  isActive: true,
});

function normalizeRows(rows: ScheduleRow[], columnsLength: number): ScheduleRow[] {
  return rows.map((row) => {
    const cells = [...(row.cells || [])];

    while (cells.length < columnsLength) {
      cells.push({
        time: "",
        location: "",
      });
    }

    if (cells.length > columnsLength) {
      cells.length = columnsLength;
    }

    return {
      day: row.day || "",
      cells,
    };
  });
}

function AdminPracticeCategories() {
  const [categories, setCategories] = useState<PracticeCategory[]>([]);
  const [form, setForm] = useState<PracticeCategory>(createEmptyCategory());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/practice-categories/admin");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Erreur chargement informations pratiques :", err);
      setError("Impossible de charger les informations pratiques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm(createEmptyCategory());
    setEditingId(null);
    setLogoFile(null);
    setMessage("");
    setError("");
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...form.columns];
    newColumns[index] = value;

    const newRows = normalizeRows(form.rows, newColumns.length);

    setForm({
      ...form,
      columns: newColumns,
      rows: newRows,
    });
  };

  const addColumn = () => {
    const newColumns = [...form.columns, "Nouvelle colonne"];

    const newRows = form.rows.map((row) => ({
      ...row,
      cells: [
        ...row.cells,
        {
          time: "",
          location: "",
        },
      ],
    }));

    setForm({
      ...form,
      columns: newColumns,
      rows: newRows,
    });
  };

  const removeColumn = (index: number) => {
    if (form.columns.length <= 1) {
      setError("Il faut garder au moins une colonne.");
      return;
    }

    const newColumns = form.columns.filter(
      (_, columnIndex) => columnIndex !== index
    );

    const newRows = form.rows.map((row) => ({
      ...row,
      cells: row.cells.filter((_, cellIndex) => cellIndex !== index),
    }));

    setForm({
      ...form,
      columns: newColumns,
      rows: newRows,
    });
  };

  const addRow = () => {
    setForm({
      ...form,
      rows: [
        ...form.rows,
        {
          day: "Nouveau jour",
          cells: form.columns.map(() => ({
            time: "",
            location: "",
          })),
        },
      ],
    });
  };

  const removeRow = (index: number) => {
    setForm({
      ...form,
      rows: form.rows.filter((_, rowIndex) => rowIndex !== index),
    });
  };

  const updateRowDay = (rowIndex: number, value: string) => {
    const newRows = [...form.rows];

    newRows[rowIndex] = {
      ...newRows[rowIndex],
      day: value,
    };

    setForm({
      ...form,
      rows: newRows,
    });
  };

  const updateCell = (
    rowIndex: number,
    cellIndex: number,
    field: "time" | "location",
    value: string
  ) => {
    const newRows = [...form.rows];
    const row = newRows[rowIndex];
    const cells = [...row.cells];

    cells[cellIndex] = {
      ...cells[cellIndex],
      [field]: value,
    };

    newRows[rowIndex] = {
      ...row,
      cells,
    };

    setForm({
      ...form,
      rows: newRows,
    });
  };

  const handleEdit = (category: PracticeCategory) => {
    const columns = category.columns?.length ? category.columns : ["Catégorie"];

    setEditingId(category._id || null);
    setLogoFile(null);

    setForm({
      ...category,
      title: category.title || "",
      birthYearsLabel: category.birthYearsLabel || "",
      logoUrl: category.logoUrl || "",
      logoPublicId: category.logoPublicId || "",
      columns,
      rows: category.rows?.length
        ? normalizeRows(category.rows, columns.length)
        : [
            {
              day: "Lundi",
              cells: columns.map(() => ({
                time: "",
                location: "",
              })),
            },
          ],
      order: category.order || 0,
      isActive: category.isActive !== false,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("birthYearsLabel", form.birthYearsLabel || "");
    formData.append("columns", JSON.stringify(form.columns));
    formData.append("rows", JSON.stringify(form.rows));
    formData.append("order", String(form.order || 0));
    formData.append("isActive", String(form.isActive));

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    return formData;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      if (!form.title.trim()) {
        setError("Le nom de la catégorie est obligatoire.");
        return;
      }

      const validColumns = form.columns
        .map((column) => column.trim())
        .filter(Boolean);

      if (validColumns.length === 0) {
        setError("Il faut au moins une colonne.");
        return;
      }

      const formData = buildFormData();

      if (editingId) {
        await API.put(`/practice-categories/${editingId}`, formData);
        setMessage("Catégorie modifiée avec succès.");
      } else {
        await API.post("/practice-categories", formData);
        setMessage("Catégorie ajoutée avec succès.");
      }

      resetForm();
      await fetchCategories();
    } catch (err: any) {
      console.error("Erreur enregistrement catégorie :", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de l’enregistrement de la catégorie."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId?: string) => {
    if (!categoryId) return;

    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette catégorie ?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      setMessage("");
      setError("");

      await API.delete(`/practice-categories/${categoryId}`);

      setMessage("Catégorie supprimée avec succès.");
      await fetchCategories();

      if (editingId === categoryId) {
        resetForm();
      }
    } catch (err: any) {
      console.error("Erreur suppression catégorie :", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la suppression de la catégorie."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mt-3 text-4xl font-extrabold">
            Informations pratiques
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Gérez les catégories du club, les années de naissance, les logos,
            les horaires, les salles et l’ordre d’affichage sur la page publique.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-700 bg-green-950 p-4 text-sm font-semibold text-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-950 p-4 text-sm font-semibold text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <h2 className="text-2xl font-extrabold">
            {editingId ? "Modifier une catégorie" : "Ajouter une catégorie"}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-zinc-300">
                Nom de la catégorie
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Ex : Moins de 13 ans"
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-300">
                Années de naissance affichées
              </label>
              <input
                type="text"
                value={form.birthYearsLabel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    birthYearsLabel: e.target.value,
                  })
                }
                placeholder="Ex : nés en 2013 et 2014"
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-300">
                Logo de la catégorie
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setLogoFile(file);
                }}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-red-600"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Formats acceptés : JPG, PNG, WEBP. Taille maximale : 2 Mo.
              </p>

              {form.logoUrl && !logoFile && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={form.logoUrl}
                    alt={form.title || "Logo actuel"}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-red-600"
                  />
                  <p className="text-xs text-zinc-400">Logo actuel</p>
                </div>
              )}

              {logoFile && (
                <p className="mt-2 text-xs font-semibold text-green-400">
                  Nouveau logo sélectionné : {logoFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-300">
                Ordre d’affichage
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({
                    ...form,
                    order: Number(e.target.value),
                  })
                }
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-red-600"
              />
            </div>

          

          </div>

          <div className="mt-5 flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({
                  ...form,
                  isActive: e.target.checked,
                })
              }
              className="h-5 w-5 accent-red-600"
            />
            <label htmlFor="isActive" className="text-sm font-semibold">
              Afficher cette catégorie sur le site public
            </label>
          </div>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-black p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-extrabold">Colonnes du tableau</h3>

              <button
                type="button"
                onClick={addColumn}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Ajouter une colonne
              </button>
            </div>

            <div className="space-y-3">
              {form.columns.map((column, index) => (
                <div key={index} className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="text"
                    value={column}
                    onChange={(e) => handleColumnChange(index, e.target.value)}
                    placeholder="Ex : Régionale Masculine"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                  />

                  <button
                    type="button"
                    onClick={() => removeColumn(index)}
                    className="rounded-lg border border-red-700 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-950"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-black p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-extrabold">Horaires</h3>

              <button
                type="button"
                onClick={addRow}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Ajouter un jour
              </button>
            </div>

            <div className="space-y-6">
              {form.rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <div className="mb-4 flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      value={row.day}
                      onChange={(e) => updateRowDay(rowIndex, e.target.value)}
                      placeholder="Ex : Lundi"
                      className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-red-600"
                    />

                    <button
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      className="rounded-lg border border-red-700 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-950"
                    >
                      Supprimer le jour
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {form.columns.map((column, cellIndex) => (
                      <div
                        key={`${rowIndex}-${cellIndex}`}
                        className="rounded-lg border border-zinc-800 bg-black p-4"
                      >
                        <p className="mb-3 text-sm font-bold uppercase text-red-500">
                          {column}
                        </p>

                        <input
                          type="text"
                          value={row.cells[cellIndex]?.time || ""}
                          onChange={(e) =>
                            updateCell(
                              rowIndex,
                              cellIndex,
                              "time",
                              e.target.value
                            )
                          }
                          placeholder="Ex : 18h00 - 19h30"
                          className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                        />

                        <input
                          type="text"
                          value={row.cells[cellIndex]?.location || ""}
                          onChange={(e) =>
                            updateCell(
                              rowIndex,
                              cellIndex,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="Ex : Salle des tertiales"
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {editingId
                ? "Enregistrer les modifications"
                : "Ajouter la catégorie"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-zinc-700 px-6 py-3 font-bold text-zinc-300 hover:bg-zinc-800"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-extrabold">Catégories existantes</h2>

          {loading && (
            <p className="mt-4 text-sm text-zinc-400">Chargement...</p>
          )}

          {!loading && categories.length === 0 && (
            <p className="mt-4 text-sm text-zinc-400">
              Aucune catégorie enregistrée.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-black p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  {category.logoUrl ? (
                    <img
                      src={category.logoUrl}
                      alt={category.title}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-red-600"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold uppercase text-zinc-400 ring-2 ring-red-600">
                      Logo
                    </div>
                  )}

                  <div>
                    <p className="text-lg font-extrabold">{category.title}</p>

                    <p className="mt-1 text-sm text-zinc-400">
                      {category.birthYearsLabel || "Aucune année renseignée"}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Ordre : {category.order} —{" "}
                      {category.isActive ? "Visible" : "Masquée"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(category)}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700"
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(category._id)}
                    className="rounded-lg border border-red-700 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-950"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminPracticeCategories;