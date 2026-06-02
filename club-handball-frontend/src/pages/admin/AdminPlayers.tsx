import { useEffect, useState } from "react";
import API from "../../services/api";
import type { ChangeEvent, FormEvent } from "react";

// Les équipes sont chargées dynamiquement depuis l'API — plus de liste hardcodée
type TeamOption = { _id: string; name: string };

type PlayerStatus = "Visible" | "Masqué";
type PlayerItem = {
  _id?: string;
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  teamName: string;       // nom brut affiché (team.name ou teamName selon ce qui est rempli)
  teamId?: string;        // ObjectId si le joueur est lié à une vraie équipe
  position: string;
  number: string;
  image: string;
  status: PlayerStatus;
};

type ImportSummary = {
  message?: string;
  total?: number;
  imported?: number;
  updated?: number;
  skipped?: number;
  errors?: string[];
};

const Positions = [
  "Gardien",
  "Ailier gauche",
  "Ailier droit",
  "Arrière gauche",
  "Arrière droit",
  "Demi-centre",
  "Pivot",
];

function formatDate(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return "";
}

function getPlayerId(player: PlayerItem) {
  return player._id || String(player.id || "");
}

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

function buildImageUrl(imagePath: string) {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/\\/g, "/");

  return `${API_ORIGIN}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}
function formatPlayerFromApi(player: any): PlayerItem {
  return {
    _id: player._id,
    id: player.id,
    firstName: player.firstName || "",
    lastName: player.lastName || "",
    birthDate: formatDate(player.birthDate || player.dateOfBirth || player.dateNaissance),
    // Affiche le nom de l'équipe liée (populate) sinon le teamName stocké à l'import
    teamName: player.team?.name || player.teamName || "—",
    teamId: player.team?._id || player.team || undefined,
    position: player.position || "",
    number:
      player.number !== undefined && player.number !== null
        ? String(player.number)
        : "",
    image: buildImageUrl(player.photo || player.image || player.imageUrl || ""),
    status:
      player.isDisplayed === false || player.status === "Masqué"
        ? "Masqué"
        : "Visible",
  };
}

export default function AdminPlayers() {
  const [players, setPlayers]     = useState<PlayerItem[]>([]);
  const [teams, setTeams]         = useState<TeamOption[]>([]);   // chargé depuis l'API
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Champs du formulaire
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [birthDate, setBirthDate]     = useState("");
  const [teamId, setTeamId]           = useState("");   // ObjectId de l'équipe sélectionnée
  const [position, setPosition]       = useState("");
  const [number, setNumber]           = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [status, setStatus]           = useState<PlayerStatus>("Visible");

  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [savingPlayer, setSavingPlayer]     = useState(false);
  const [pageError, setPageError]           = useState("");
  const [formError, setFormError]           = useState("");

  const [excelFile, setExcelFile]       = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [importLoading, setImportLoading]   = useState(false);
  const [importMessage, setImportMessage]   = useState("");
  const [importError, setImportError]       = useState("");
  const [importSummary, setImportSummary]   = useState<ImportSummary | null>(null);

  // ─── Chargement initial ───────────────────────────────────────────────────

  async function fetchPlayers() {
    try {
      setLoadingPlayers(true);
      setPageError("");
      const res = await API.get("/players/admin/all");
      setPlayers((res.data as any[]).map(formatPlayerFromApi));
    } catch (error: any) {
      setPageError(error.response?.data?.message || "Erreur lors de la récupération des joueurs.");
    } finally {
      setLoadingPlayers(false);
    }
  }

  async function fetchTeams() {
    try {
      // Adapte l'URL à ta route équipes admin
      const res = await API.get("/teams");
      setTeams(
        (res.data as any[]).map((t: any) => ({ _id: t._id, name: t.name }))
      );
    } catch (error) {
      console.error("Impossible de charger les équipes :", error);
    }
  }

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  // ─── Formulaire ──────────────────────────────────────────────────────────

  function resetForm() {
    setFirstName("");
    setLastName("");
    setBirthDate("");
    setTeamId(teams[0]?._id || "");
    setPosition("");
    setNumber("");
    setImagePreview("");
    setSelectedPhoto(null);
    setStatus("Visible");
    setEditingId(null);
    setFormError("");
  }

  function calculateAge(birthDate: string) {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return "";
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedPhoto(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setSavingPlayer(true);
      setFormError("");

      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("birthDate", birthDate);
      if (teamId) formData.append("team", teamId);
      formData.append("position", position);
      if (number.trim() !== "") formData.append("number", number);
      formData.append("isDisplayed", String(status === "Visible"));
      if (selectedPhoto) formData.append("photo", selectedPhoto);

      if (editingId) {
        await API.put(`/players/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/players", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchPlayers();
      resetForm();
      setShowForm(false);
    } catch (error: any) {
      setFormError(error.response?.data?.message || "Erreur lors de l'enregistrement du joueur.");
    } finally {
      setSavingPlayer(false);
    }
  }

  function handleEdit(player: PlayerItem) {
    const id = getPlayerId(player);
    if (!id) { setPageError("Identifiant manquant."); return; }
    setEditingId(id);
    setFirstName(player.firstName);
    setLastName(player.lastName);
    setBirthDate(player.birthDate);
    setTeamId(player.teamId || "");
    setPosition(player.position);
    setNumber(player.number);
    setImagePreview(player.image);
    setSelectedPhoto(null);
    setStatus(player.status);
    setFormError("");
    setShowForm(true);
  }

  async function handleDelete(player: PlayerItem) {
    const id = getPlayerId(player);
    if (!id) { setPageError("Identifiant manquant."); return; }
    if (!window.confirm(`Supprimer ${player.firstName} ${player.lastName} ?`)) return;
    try {
      await API.delete(`/players/${id}`);
      await fetchPlayers();
    } catch (error: any) {
      setPageError(error.response?.data?.message || "Erreur lors de la suppression.");
    }
  }

  async function handleToggleDisplay(player: PlayerItem) {
    const id = getPlayerId(player);
    if (!id) { setPageError("Identifiant manquant."); return; }
    try {
      await API.patch(`/players/${id}/toggle-display`);
      await fetchPlayers();
    } catch (error: any) {
      setPageError(error.response?.data?.message || "Erreur lors du changement d'affichage.");
    }
  }

  // ─── Import Excel ─────────────────────────────────────────────────────────

  function handleExcelFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    setImportError("");
    setImportMessage("");
    setImportSummary(null);
    if (!selectedFile) { setExcelFile(null); return; }
    const fileName = selectedFile.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      setExcelFile(null);
      setImportError("Veuillez sélectionner un fichier Excel au format .xlsx ou .xls.");
      return;
    }
    setExcelFile(selectedFile);
  }

  async function handleExcelImport() {
    if (!excelFile) { setImportError("Veuillez sélectionner un fichier Excel."); return; }
    try {
      setImportLoading(true);
      setImportError("");
      const formData = new FormData();
      formData.append("file", excelFile);
      const res = await API.post("/players/import", formData);
      setImportMessage(res.data.message || "Importation réussie.");
      setImportSummary(res.data);
      await fetchPlayers();
    } catch (error: any) {
      setImportError(error.response?.data?.message || "Erreur lors de l'importation.");
    } finally {
      setImportLoading(false);
      setExcelFile(null);
      setFileInputKey((prev) => prev + 1);
    }
  }

  // ─── Rendu ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Gestion des joueurs</h1>
          <p className="mt-2 text-zinc-600">
            Gérer uniquement les effectifs publics des équipes premières.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Nouveau joueur
        </button>
      </div>

      {/* Import Excel */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Importer un fichier Excel</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Les noms d'onglets ou la colonne Équipe du fichier seront utilisés tels quels.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              key={fileInputKey}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelFileChange}
              className="rounded-lg border border-zinc-300 px-4 py-3 text-sm"
            />
            <button
              type="button"
              onClick={handleExcelImport}
              disabled={importLoading || !excelFile}
              className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {importLoading ? "Import en cours..." : "Importer"}
            </button>
          </div>
        </div>

        {excelFile && (
          <p className="mt-4 text-sm text-zinc-600">
            Fichier sélectionné :{" "}
            <span className="font-semibold text-zinc-900">{excelFile.name}</span>
          </p>
        )}
        {importMessage && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <p className="font-semibold">{importMessage}</p>
            {importSummary && (
              <div className="mt-2 grid gap-1 md:grid-cols-4">
                {typeof importSummary.total    === "number" && <p>Total : {importSummary.total}</p>}
                {typeof importSummary.imported === "number" && <p>Créés : {importSummary.imported}</p>}
                {typeof importSummary.updated  === "number" && <p>Mis à jour : {importSummary.updated}</p>}
                {typeof importSummary.skipped  === "number" && <p>Ignorés : {importSummary.skipped}</p>}
              </div>
            )}
            {importSummary?.errors && importSummary.errors.length > 0 && (
              <div className="mt-3 text-red-700">
                <p className="font-semibold">Erreurs :</p>
                <ul className="mt-1 list-disc pl-5">
                  {importSummary.errors.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        {importError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {importError}
          </div>
        )}
      </div>

      {/* Formulaire ajout / modification */}
      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId ? "Modifier un joueur" : "Ajouter un joueur"}
          </h2>
          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text" value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required placeholder="Nom"
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />
            <input
              type="text" value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required placeholder="Prénom"
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />
            <input
              type="date" value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            {/* Sélecteur d'équipe dynamique */}
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="">— Équipe —</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>

            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="">Poste</option>
              {Positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              type="number" value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Numéro"
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PlayerStatus)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="Visible">Visible</option>
              <option value="Masqué">Masqué</option>
            </select>

            {/* Upload photo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">Photo du joueur</label>
              <input
                type="file" accept="image/*"
                onChange={handlePhotoChange}
                className="rounded-lg border border-zinc-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Aperçu" className="mt-2 h-40 w-32 rounded-xl object-cover" />
              )}
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit" disabled={savingPlayer}
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {savingPlayer ? "Enregistrement..." : editingId ? "Mettre à jour" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="rounded-lg border border-zinc-300 px-5 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {pageError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      )}
      {loadingPlayers && <p className="mb-4 text-sm text-zinc-500">Chargement des joueurs...</p>}

      {/* Tableau */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full min-w-[900px]">
          <thead className="bg-zinc-100">
            <tr className="text-left text-sm text-zinc-600">
              <th className="px-6 py-4">Photo</th>
              <th className="px-6 py-4">Joueur</th>
              <th className="px-6 py-4">Âge</th>
              <th className="px-6 py-4">Équipe</th>
              <th className="px-6 py-4">Poste</th>
              <th className="px-6 py-4">Numéro</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loadingPlayers && players.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-zinc-500">
                  Aucun joueur trouvé.
                </td>
              </tr>
            )}
            {players.map((player) => (
              <tr key={getPlayerId(player)} className="border-t border-zinc-200">
                <td className="px-6 py-4">
                  {player.image ? (
                    <img
                      src={player.image}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="h-16 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-zinc-200 text-xs text-zinc-500">—</div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-zinc-800">{player.lastName} {player.firstName}</td>
                <td className="px-6 py-4 text-zinc-600">
                  {calculateAge(player.birthDate) ? `${calculateAge(player.birthDate)} ans` : "—"}
                </td>
                <td className="px-6 py-4 text-zinc-600">{player.teamName}</td>
                <td className="px-6 py-4 text-zinc-600">{player.position || "—"}</td>
                <td className="px-6 py-4 text-zinc-600">{player.number ? `#${player.number}` : "—"}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    player.status === "Visible" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {player.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => handleEdit(player)} className="text-blue-600 hover:underline">Modifier</button>
                    <button type="button" onClick={() => handleToggleDisplay(player)} className="text-zinc-700 hover:underline">
                      {player.status === "Visible" ? "Masquer" : "Afficher"}
                    </button>
                    <button type="button" onClick={() => handleDelete(player)} className="text-red-600 hover:underline">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}