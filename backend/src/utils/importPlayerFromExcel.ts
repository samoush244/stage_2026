import fs from "fs";
import xlsx from "xlsx";
import Player from "../models/Player";
import Team from "../models/Team";

type ExcelRow = Record<string, any>;

type ImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

const normalizeKey = (key: string) => {
  return key
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
};

const getValue = (row: ExcelRow, possibleKeys: string[]) => {
  const normalizedRow: Record<string, any> = {};

  Object.keys(row).forEach((key) => {
    normalizedRow[normalizeKey(key)] = row[key];
  });

  for (const key of possibleKeys) {
    const normalizedKey = normalizeKey(key);

    if (
      normalizedRow[normalizedKey] !== undefined &&
      normalizedRow[normalizedKey] !== null &&
      normalizedRow[normalizedKey] !== ""
    ) {
      return normalizedRow[normalizedKey];
    }
  }

  return "";
};

const cleanString = (value: any) => {
  if (value === undefined || value === null) return "";
  return value.toString().trim();
};

const parseExcelDate = (value: any): Date | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value;
  }

  // Cas fréquent : Excel stocke les dates comme des nombres
  if (typeof value === "number") {
    const parsed = xlsx.SSF.parse_date_code(value);

    if (!parsed) return undefined;

    return new Date(parsed.y, parsed.m - 1, parsed.d);
  }

  if (typeof value === "string") {
    const cleaned = value.trim();

    // Format français : 24/05/2002
    const frenchDateMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (frenchDateMatch) {
      const day = Number(frenchDateMatch[1]);
      const month = Number(frenchDateMatch[2]) - 1;
      const year = Number(frenchDateMatch[3]);

      return new Date(year, month, day);
    }

    // Format standard : 2002-05-24
    const standardDate = new Date(cleaned);

    if (!isNaN(standardDate.getTime())) {
      return standardDate;
    }
  }

  return undefined;
};

export const importPlayersFromExcel = async (
  filePath: string
): Promise<ImportResult> => {
  const result: ImportResult = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rows = xlsx.utils.sheet_to_json<ExcelRow>(worksheet, {
    defval: "",
  });

  if (rows.length === 0) {
    result.errors.push("Le fichier Excel est vide.");
    return result;
  }

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const lineNumber = index + 2;

    const licenseNumber = cleanString(
      getValue(row, [
        "licenseNumber",
        "numéro de licence",
        "numero de licence",
        "licence",
        "n licence",
        "n° licence",
      ])
    );

    const firstName = cleanString(
      getValue(row, ["firstName", "prenom", "prénom"])
    );

    const lastName = cleanString(
      getValue(row, ["lastName", "nom", "name"])
    );

    const birthDateValue = getValue(row, [
      "birthDate",
      "date de naissance",
      "naissance",
    ]);

    const teamName = cleanString(
      getValue(row, ["team", "teamName", "équipe", "equipe", "categorie"])
    );

    const gender = cleanString(
      getValue(row, ["gender", "sexe", "genre"])
    ).toLowerCase();

    const category = cleanString(
      getValue(row, ["category", "catégorie", "categorie"])
    );

    if (!licenseNumber || !firstName || !lastName) {
      result.skipped++;
      result.errors.push(
        `Ligne ${lineNumber} ignorée : numéro de licence, prénom ou nom manquant.`
      );
      continue;
    }

    if (!teamName) {
      result.skipped++;
      result.errors.push(
        `Ligne ${lineNumber} ignorée : équipe manquante.`
      );
      continue;
    }

    const team = await Team.findOne({
      name: { $regex: new RegExp(`^${teamName}$`, "i") },
    });

    if (!team) {
      result.skipped++;
      result.errors.push(
        `Ligne ${lineNumber} ignorée : équipe "${teamName}" introuvable.`
      );
      continue;
    }

    const birthDate = parseExcelDate(birthDateValue);

    const existingPlayer = await Player.findOne({ licenseNumber });

    if (existingPlayer) {
      existingPlayer.firstName = firstName;
      existingPlayer.lastName = lastName;
      existingPlayer.team = team._id;
      
      

      if (birthDate) {
        existingPlayer.birthDate = birthDate;
      }

      // Important :
      // On ne touche pas à photo, position, number, isVisible, displayOrder.
      // Ces champs sont complétés manuellement par l'admin.

      await existingPlayer.save();
      result.updated++;
    } else {
      await Player.create({
        licenseNumber,
        firstName,
        lastName,
        birthDate,
        team: team._id,
       
        // Le joueur vient de l'import, mais il ne doit pas forcément
        // apparaître directement sur le site.
        isFeaturedTeamPlayer: true,
        isActive: false,
      });

      result.created++;
    }
  }

  // On supprime le fichier après import pour éviter d'empiler des fichiers inutiles
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return result;
};