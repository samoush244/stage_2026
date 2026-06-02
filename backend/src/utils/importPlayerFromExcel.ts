import XLSX from "xlsx";
import Player from "../models/Player";
import Team from "../models/Team";

/* =========================================================
   PARSER UNE DATE EXCEL
========================================================= */

const parseExcelDate = (value: any): Date | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value;
  }

  // Date Excel sous forme de nombre
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
  }

  const stringValue = String(value).trim();

  if (!stringValue) {
    return undefined;
  }

  // Format français : 12/04/2003
  const frenchDateMatch = stringValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (frenchDateMatch) {
    const day = Number(frenchDateMatch[1]);
    const month = Number(frenchDateMatch[2]) - 1;
    const year = Number(frenchDateMatch[3]);

    return new Date(year, month, day);
  }

  // Format classique : 2003-04-12
  const parsedDate = new Date(stringValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
};

/* =========================================================
   NORMALISER UN TEXTE
   Exemple :
   "Nationale 3 féminine" devient "nationale 3 feminine"
========================================================= */

const normalizeText = (value: any): string => {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/* =========================================================
   LIRE UNE VALEUR DANS UNE LIGNE EXCEL AVEC PLUSIEURS NOMS POSSIBLES
========================================================= */

const getCellValue = (row: any, possibleKeys: string[]): string => {
  for (const key of possibleKeys) {
    const value = row[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
};

/* =========================================================
   TROUVER UNE ÉQUIPE À PARTIR DU NOM DANS EXCEL
========================================================= */

const findTeamByExcelName = async (excelTeamName: string) => {
  const cleanExcelTeamName = normalizeText(excelTeamName);

  if (!cleanExcelTeamName) {
    return null;
  }

  const teams = await Team.find().lean();

  // 1. Recherche exacte
  const exactMatch = teams.find((team: any) => {
    const teamName = normalizeText(team.name);
    const teamSlug = normalizeText(team.slug);
    const teamLevel = normalizeText(team.level);
    const teamGroup = normalizeText(team.group);
    const teamGender = normalizeText(team.gender);

    return (
      teamName === cleanExcelTeamName ||
      teamSlug === cleanExcelTeamName ||
      teamLevel === cleanExcelTeamName ||
      `${teamLevel} ${teamGender}`.trim() === cleanExcelTeamName ||
      `${teamName} ${teamGender}`.trim() === cleanExcelTeamName ||
      `${teamLevel} ${teamGroup}`.trim() === cleanExcelTeamName
    );
  });

  if (exactMatch) {
    return exactMatch;
  }

  // 2. Recherche souple
  const flexibleMatch = teams.find((team: any) => {
    const teamName = normalizeText(team.name);
    const teamSlug = normalizeText(team.slug);
    const teamLevel = normalizeText(team.level);

    return (
      teamName.includes(cleanExcelTeamName) ||
      cleanExcelTeamName.includes(teamName) ||
      teamSlug.includes(cleanExcelTeamName) ||
      cleanExcelTeamName.includes(teamSlug) ||
      teamLevel.includes(cleanExcelTeamName) ||
      cleanExcelTeamName.includes(teamLevel)
    );
  });

  return flexibleMatch || null;
};

/* =========================================================
   IMPORT DES JOUEURS DEPUIS EXCEL
========================================================= */

export const importPlayersFromExcel = async (fileBuffer: Buffer) => {
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
  });

  if (workbook.SheetNames.length === 0) {
    throw new Error("Le fichier Excel ne contient aucune feuille.");
  }

  const allRows: any[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<any>(worksheet, {
      defval: "",
    });

    const rowsWithSheetName = rows.map((row) => ({
      ...row,
      sheetTeamName: sheetName,
    }));

    allRows.push(...rowsWithSheetName);
  }

  console.log("Nombre total de lignes Excel :", allRows.length);

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  const errors: string[] = [];

  for (const row of allRows) {
    const licenseNumber = getCellValue(row, [
      "licenseNumber",
      "Licence",
      "licence",
      "Numéro de licence",
      "Numero de licence",
      "N° licence",
      "N° Licence",
      "FALSE",
    ]);

    const firstName = getCellValue(row, [
      "firstName",
      "Prénom",
      "Prenom",
      "prenom",
      "PRÉNOM",
      "PRENOM",
    ]);

    const lastName = getCellValue(row, [
      "lastName",
      "Nom",
      "nom",
      "NOM",
    ]);

    const teamNameFromExcel = getCellValue(row, [
      "team",
      "Team",
      "Equipe",
      "equipe",
      "Équipe",
      "Catégorie",
      "Categorie",
      "teamName",
      "sheetTeamName",
    ]);

    const birthDate = parseExcelDate(
      row.birthDate ||
        row.dateNaissance ||
        row["date de naissance"] ||
        row["Date de naissance"] ||
        row["DATE DE NAISSANCE"] ||
        row["Date naissance"] ||
        row["date naissance"] ||
        ""
    );

    if (!licenseNumber || !firstName || !lastName) {
      skipped++;

      console.log("LIGNE IGNORÉE (données manquantes) :", {
        licenseNumber,
        firstName,
        lastName,
      });

      continue;
    }

    let teamId: any = null;

    if (teamNameFromExcel) {
      const team = await findTeamByExcelName(teamNameFromExcel);

      if (!team) {
        const message = `Licence ${licenseNumber} (${firstName} ${lastName}) : équipe introuvable "${teamNameFromExcel}"`;

        errors.push(message);
        console.error("ERREUR LIGNE :", message);

        continue;
      }

      teamId = team._id;
    }

    try {
      const existingPlayer = await Player.findOne({
        licenseNumber,
      });

      const playerData: any = {
        licenseNumber,
        firstName,
        lastName,
        team: teamId,
        roles: ["joueur"],
        isActive: true,
        isDisplayed: true,
      };

      if (birthDate) {
        playerData.birthDate = birthDate;
      }

      if (existingPlayer) {
        await Player.updateOne(
          {
            licenseNumber,
          },
          {
            $set: playerData,

            // Nettoyage de l'ancien champ qui nous a bien pourri la journée.
            $unset: {
              teamName: "",
            },
          },
          {
            runValidators: true,
          }
        );

        updated++;

        console.log("JOUEUR MIS À JOUR :", licenseNumber, "| équipe :", teamNameFromExcel);
      } else {
        await Player.create({
          ...playerData,
          isFeaturedTeamPlayer: false,
        });

        imported++;

        console.log("JOUEUR CRÉÉ :", licenseNumber, "| équipe :", teamNameFromExcel);
      }
    } catch (err: any) {
      const message = `Licence ${licenseNumber} (${firstName} ${lastName}) : ${err.message}`;

      errors.push(message);
      console.error("ERREUR LIGNE :", message);
    }
  }

  console.log("RÉSULTAT IMPORT :", {
    imported,
    updated,
    skipped,
    total: allRows.length,
    errors,
  });

  return {
    imported,
    updated,
    skipped,
    total: allRows.length,
    errors,
  };
};