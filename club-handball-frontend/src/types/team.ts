export type TeamType = "premiere" | "autre";
export type Gender = "masculin" | "feminin" | "mixte";

export interface Team {
  _id: string;
  name: string;
  slug: string;
  teamType: TeamType;
  gender: Gender;
  category?: string;
  level?: string;
  image?: string;
  description?: string;
  ffhandballUrl?: string;
  scorencoUrl?: string;
  hasRosterPage?:boolean;
  hasResultsPage?:boolean;
  order: number;
  isActive: boolean;
}