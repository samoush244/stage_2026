import { useEffect, useRef, useState } from "react";
import API from "../../services/api";
import type { ChangeEvent, FormEvent } from "react";

type TeamOption = {
  _id: string;
  name: string;
};

type MemberType = "player" | "staff";
type PlayerStatus = "Visible" | "Masqué";

type PlayerItem = {
  _id?: string;
  id?: number;
  licenseNumber?: string;
  memberType: MemberType;
  firstName: string;
  lastName: string;
  birthDate: string;
  teamName: string;
  teamId?: string;
  position: string;
  number: string;
  displayOrder: string;
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

const playerPositions = [
  "Gardien",
  "Gardienne",
  "Ailier gauche",
  "Ailière gauche",
  "Ailier droit",
  "Ailière droite",
  "Arrière gauche",
  "Arrière droite",
  "Arrière droit",
  "Demi-centre",
  "Pivot",
];

const staffPositions = [
  "Entraîneur principal",
  "Entraîneur adjoint",
  "Préparateur physique",
  "Accompagnateur",
  "Responsable d'équipe",
  "Kinésithérapeute",
  "Médecin",
  "Autre",
];

function formatDate(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return "";
}

function getPlayerId(player: PlayerItem) {
  return player._id || String(player.id || "");
}

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

function buildImageUrl(imagePath: string) {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/\\/g, "/");

  if (cleanPath.startsWith("/")) {
    return `${API_URL}${cleanPath}`;
  }

  return `${API_URL}/${cleanPath}`;
}

function formatPlayerFromApi(player: any): PlayerItem {
  const memberType: MemberType =
    player.memberType === "staff" ? "staff" : "player";

  return {
    _id: player._id,
    id: player.id,
    licenseNumber: player.licenseNumber || "",
    memberType,
    firstName: player.firstName || "",
    lastName: player.lastName || "",
    birthDate: formatDate(
      player.birthDate || player.dateOfBirth || player.dateNaissance
    ),
    teamName: player.team?.name || player.teamName || "—",
    teamId: player.team?._id || player.team || undefined,
    position: player.position || "",
    number:
      player.number !== undefined && player.number !== null
        ? String(player.number)
        : "",
    displayOrder:
      player.displayOrder !== undefined && player.displayOrder !== null
        ? String(player.displayOrder)
        : "0",
    image: buildImageUrl(player.photo || player.image || player.imageUrl || ""),
    status:
      player.isDisplayed === false || player.status === "Masqué"
        ? "Masqué"
        : "Visible",
  };
}

export default function AdminPlayers() {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [memberType, setMemberType] = useState<MemberType>("player");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [teamId, setTeamId] = useState("");
  const [position, setPosition] = useState("");
  const [number, setNumber] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("Visible");

  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [savingPlayer, setSavingPlayer] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);

  function scrollToForm() {
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  async function fetchPlayers() {
    try {
      setLoadingPlayers(true);
      setPageError("");

      const res = await API.get("/players/admin/all");

      const rawPlayers = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.players)
          ? res.data.players
          : [];

      setPlayers(rawPlayers.map(formatPlayerFromApi));
    } catch (error: any) {
      setPageError(
        error.response?.data?.message ||
          "Erreur lors de la récupération des membres."
      );
    } finally {
      setLoadingPlayers(false);
    }
  }

  async function fetchTeams() {
    try {
      const res = await API.get("/teams");

      setTeams(
        (res.data as any[]).map((team: any) => ({
          _id: team._id,
          name: team.name,
        }))
      );
    } catch (error) {
      console.error("Impossible de charger les équipes :", error);
    }
  }

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  function resetForm(nextMemberType: MemberType = "player") {
    setMemberType(nextMemberType);
    setLicenseNumber("");
    setFirstName("");
    setLastName("");
    setBirthDate("");
    setTeamId("");
    setPosition("");
    setNumber("");
    setDisplayOrder("0");
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

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

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

      if (!firstName.trim() || !lastName.trim()) {
        setFormError("Le nom et le prénom sont obligatoires.");
        return;
      }

      if (!teamId) {
        setFormError("Veuillez sélectionner une équipe.");
        return;
      }

      if (memberType === "player" && !licenseNumber.trim()) {
        setFormError("Le numéro de licence est obligatoire pour un joueur.");
        return;
      }

      if (!position.trim()) {
        setFormError(
          memberType === "staff"
            ? "La fonction du staff est obligatoire."
            : "Le poste du joueur est obligatoire."
        );
        return;
      }

      const formData = new FormData();

      formData.append("memberType", memberType);
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("team", teamId);
      formData.append("position", position);
      formData.append("displayOrder", displayOrder || "0");
      formData.append("isDisplayed", String(status === "Visible"));

      if (memberType === "player") {
        formData.append("licenseNumber", licenseNumber.trim());

        if (birthDate) {
          formData.append("birthDate", birthDate);
        }

        if (number.trim() !== "") {
          formData.append("number", number);
        }
      }

      if (selectedPhoto) {
        formData.append("photo", selectedPhoto);
      }

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
      setFormError(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement du membre."
      );
    } finally {
      setSavingPlayer(false);
    }
  }

  function handleEdit(player: PlayerItem) {
    const id = getPlayerId(player);

    if (!id) {
      setPageError("Identifiant manquant.");
      return;
    }

    setEditingId(id);
    setMemberType(player.memberType);
    setLicenseNumber(player.licenseNumber || "");
    setFirstName(player.firstName);
    setLastName(player.lastName);
    setBirthDate(player.birthDate);
    setTeamId(player.teamId || "");
    setPosition(player.position);
    setNumber(player.number);
    setDisplayOrder(player.displayOrder || "0");
    setImagePreview(player.image);
    setSelectedPhoto(null);
    setStatus(player.status);
    setFormError("");
    setShowForm(true);

    scrollToForm();
  }

  async function handleDelete(player: PlayerItem) {
    const id = getPlayerId(player);

    if (!id) {
      setPageError("Identifiant manquant.");
      return;
    }

    const label =
      player.memberType === "staff" ? "ce membre du staff" : "ce joueur";

    if (
      !window.confirm(
        `Supprimer ${label} : ${player.firstName} ${player.lastName} ?`
      )
    ) {
      return;
    }

    try {
      await API.delete(`/players/${id}`);
      await fetchPlayers();
    } catch (error: any) {
      setPageError(
        error.response?.data?.message || "Erreur lors de la suppression."
      );
    }
  }

  async function handleToggleDisplay(player: PlayerItem) {
    const id = getPlayerId(player);

    if (!id) {
      setPageError("Identifiant manquant.");
      return;
    }

    try {
      await API.patch(`/players/${id}/toggle-display`);
      await fetchPlayers();
    } catch (error: any) {
      setPageError(
        error.response?.data?.message ||
          "Erreur lors du changement d'affichage."
      );
    }
  }

  function handleExcelFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    setImportError("");
    setImportMessage("");
    setImportSummary(null);

    if (!selectedFile) {
      setExcelFile(null);
      return;
    }

    const fileName = selectedFile.name.toLowerCase();

    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      setExcelFile(null);
      setImportError("Veuillez sélectionner un fichier Excel au format .xlsx ou .xls.");
      return;
    }

    setExcelFile(selectedFile);
  }

  async function handleExcelImport() {
    if (!excelFile) {
      setImportError("Veuillez sélectionner un fichier Excel.");
      return;
    }

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
      setImportError(
        error.response?.data?.message || "Erreur lors de l'importation."
      );
    } finally {
      setImportLoading(false);
      setExcelFile(null);
      setFileInputKey((prev) => prev + 1);
    }
  }

  const currentPositions =
    memberType === "staff" ? staffPositions : playerPositions;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Gestion des effectifs
          </h1>

          <p className="mt-2 text-zinc-600">
            Gérer les joueurs importés par Excel et ajouter le staff manuellement.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              resetForm("player");
              setShowForm(true);
              scrollToForm();
            }}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
          >
            Nouveau joueur
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm("staff");
              setShowForm(true);
              scrollToForm();
            }}
            className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-zinc-800"
          >
            Ajouter staff
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              Importer les joueurs par Excel
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              L'import Excel reste réservé aux joueurs. Le staff se crée manuellement.
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
                {typeof importSummary.total === "number" && (
                  <p>Total : {importSummary.total}</p>
                )}
                {typeof importSummary.imported === "number" && (
                  <p>Créés : {importSummary.imported}</p>
                )}
                {typeof importSummary.updated === "number" && (
                  <p>Mis à jour : {importSummary.updated}</p>
                )}
                {typeof importSummary.skipped === "number" && (
                  <p>Ignorés : {importSummary.skipped}</p>
                )}
              </div>
            )}

            {importSummary?.errors && importSummary.errors.length > 0 && (
              <div className="mt-3 text-red-700">
                <p className="font-semibold">Erreurs :</p>
                <ul className="mt-1 list-disc pl-5">
                  {importSummary.errors.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
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

      {showForm && (
        <div
          ref={formRef}
          className="mb-8 scroll-mt-28 rounded-2xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {editingId
              ? memberType === "staff"
                ? "Modifier un membre du staff"
                : "Modifier un joueur"
              : memberType === "staff"
                ? "Ajouter un membre du staff"
                : "Ajouter un joueur"}
          </h2>

          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <select
              value={memberType}
              onChange={(e) => {
                const nextType = e.target.value as MemberType;
                setMemberType(nextType);
                setPosition("");
                setNumber("");
                setBirthDate("");
              }}
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="player">Joueur</option>
              <option value="staff">Staff</option>
            </select>

            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="rounded-lg border border-zinc-300 px-4 py-3"
              required
            >
              <option value="">— Équipe —</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>

            {memberType === "player" && (
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
                placeholder="Numéro de licence"
                className="rounded-lg border border-zinc-300 px-4 py-3"
              />
            )}

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Nom"
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Prénom"
              className="rounded-lg border border-zinc-300 px-4 py-3"
            />

            {memberType === "player" && (
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="rounded-lg border border-zinc-300 px-4 py-3"
              />
            )}

            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-4 py-3"
            >
              <option value="">
                {memberType === "staff" ? "Fonction" : "Poste"}
              </option>

              {currentPositions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {memberType === "player" && (
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Numéro de maillot"
                className="rounded-lg border border-zinc-300 px-4 py-3"
              />
            )}

            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="Ordre d'affichage"
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

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-700">
                {memberType === "staff" ? "Photo du staff" : "Photo du joueur"}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="rounded-lg border border-zinc-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="mt-2 h-40 w-32 rounded-xl object-cover"
                />
              )}
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={savingPlayer}
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {savingPlayer
                  ? "Enregistrement..."
                  : editingId
                    ? "Mettre à jour"
                    : "Enregistrer"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
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

      {loadingPlayers && (
        <p className="mb-4 text-sm text-zinc-500">
          Chargement des effectifs...
        </p>
      )}

      <div className="w-full max-w-full overflow-hidden rounded-2xl bg-white shadow">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[8%]" />
              <col className="w-[9%]" />
              <col className="w-[14%]" />
              <col className="w-[7%]" />
              <col className="w-[13%]" />
              <col className="w-[14%]" />
              <col className="w-[8%]" />
              <col className="w-[7%]" />
              <col className="w-[9%]" />
              <col className="w-[11%]" />
            </colgroup>

            <thead className="bg-zinc-100">
              <tr className="text-left text-sm text-zinc-600">
                <th className="px-4 py-4">Photo</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Nom</th>
                <th className="px-4 py-4">Âge</th>
                <th className="px-4 py-4">Équipe</th>
                <th className="px-4 py-4">Poste / Fonction</th>
                <th className="px-4 py-4">Numéro</th>
                <th className="px-4 py-4">Ordre</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loadingPlayers && players.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="break-words px-4 py-4 text-center text-sm text-zinc-500"
                  >
                    Aucun membre trouvé.
                  </td>
                </tr>
              )}

              {players.map((player) => {
                const age = calculateAge(player.birthDate);

                return (
                  <tr
                    key={getPlayerId(player)}
                    className="border-t border-zinc-200"
                  >
                    <td className="px-6 py-4">
                      {player.image ? (
                        <img
                          src={player.image}
                          alt={`${player.firstName} ${player.lastName}`}
                          className="h-16 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-zinc-200 text-xs text-zinc-500">
                          —
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                          player.memberType === "staff"
                            ? "bg-black text-white"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {player.memberType === "staff" ? "Staff" : "Joueur"}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-zinc-800">
                      {player.lastName} {player.firstName}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {player.memberType === "player" && age
                        ? `${age} ans`
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {player.teamName}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {player.position || "—"}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {player.memberType === "player" && player.number
                        ? `#${player.number}`
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {player.displayOrder || "0"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          player.status === "Visible"
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {player.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(player)}
                          className="text-blue-600 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleDisplay(player)}
                          className="text-zinc-700 hover:underline"
                        >
                          {player.status === "Visible" ? "Masquer" : "Afficher"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(player)}
                          className="text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}