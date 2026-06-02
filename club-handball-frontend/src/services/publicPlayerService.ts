import API from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type PublicPlayer = {
  _id: string;
  licenseNumber?: string;
  firstName: string;
  lastName: string;
  roles?: string[];
  team?: string;
  birthDate?: string;
  photo?: string;
  photoUrl?: string;
  position?: string;
  number?: number | null;
  jerseyNumber?: number | null;
  age?: number | null;
  isDisplayed?: boolean;
  isFeaturedTeamPlayer?: boolean;
  isActive?: boolean;
};

export type PublicRosterResponse = {
  team: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  players: PublicPlayer[];
};

export const getPublicRosterByTeamSlug = async (teamSlug: string) => {
  if (!teamSlug) {
    throw new Error("teamSlug manquant dans getPublicRosterByTeamSlug");
  }

  console.log("SLUG ENVOYÉ AU BACKEND :", teamSlug);

  const response = await API.get(`/players/public/team/${teamSlug}/roster`);

  return response.data;
};