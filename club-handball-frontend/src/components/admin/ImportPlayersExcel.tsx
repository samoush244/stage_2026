import { useState } from "react";
import API from "../../services/api";

type ImportResult = {
  message?: string;
  total?: number;
  created?: number;
  updated?: number;
  skipped?: number;
  errors?: string[];
};

export default function ImportPlayersExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedExtensions = [".xlsx", ".xls"];
    const fileName = selectedFile.name.toLowerCase();

    const isExcelFile = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!isExcelFile) {
      setError("Veuillez sélectionner un fichier Excel valide (.xlsx ou .xls).");
      setFile(null);
      return;
    }

    setError("");
    setResult(null);
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier Excel.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/players/import", formData);

      setResult(res.data);
      setFile(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de l'import du fichier Excel."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-zinc-900">
        Importer les joueurs
      </h2>

      <p className="mt-2 text-sm text-zinc-600">
        Importez un fichier Excel contenant les licenciés ou joueurs du club.
      </p>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
        />

        <button
          type="button"
          onClick={handleImport}
          disabled={loading || !file}
          className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {loading ? "Import en cours..." : "Importer"}
        </button>
      </div>

      {file && (
        <p className="mt-3 text-sm text-zinc-600">
          Fichier sélectionné :{" "}
          <span className="font-semibold text-zinc-900">{file.name}</span>
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <p className="font-semibold">
            {result.message || "Import terminé avec succès."}
          </p>

          <div className="mt-2 space-y-1">
            {typeof result.total === "number" && <p>Total : {result.total}</p>}
            {typeof result.created === "number" && (
              <p>Créés : {result.created}</p>
            )}
            {typeof result.updated === "number" && (
              <p>Mis à jour : {result.updated}</p>
            )}
            {typeof result.skipped === "number" && (
              <p>Ignorés : {result.skipped}</p>
            )}
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold text-red-700">
                Lignes avec erreurs :
              </p>
              <ul className="mt-1 list-disc pl-5 text-red-700">
                {result.errors.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}