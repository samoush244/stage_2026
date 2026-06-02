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
  ffhandballUrl?: string;
  scorencoUrl?: string;
  order: number;
  isActive: boolean;
}