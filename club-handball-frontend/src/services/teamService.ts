import API from "./api";

export type PublicTeam = {
  _id: string;
  name: string;
  slug: string;
  teamType: string;
  gender: string;
  category?: string;
  level?: string;
  image?: string;
  ffhandballUrl?: string;
  scorencoUrl?: string;
  order?: number;
  isActive: boolean;
};

export const getPublicTeamBySlug = async (slug: string) => {
  const response = await API.get<PublicTeam>(`/teams/${slug}`);
  return response.data;
};