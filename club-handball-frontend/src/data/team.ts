export type SimpleTeam = {
  id: number;
  slug: string;
  name: string;
  category: string;
  imageUrl?: string;
  ffhandballUrl: string;
};

export const maleTeams: SimpleTeam[] = [
  {
    id: 1,
    slug: "honneur-regional-masculin",
    name: "Honneur régional",
    category: "Seniors masculins",
    imageUrl: "/images/equipes/smb.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/regional/honneur-masculin-regional-28606/",
  },
  {
    id: 2,
    slug: "u18-masculins-region",
    name: "U18 masculins Region",
    category: "Jeunes masculins",
    imageUrl: "/images/equipes/u18gr.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/regional/championnat-u18-masculin-29037/poule-180318/",
  },
  {
    id: 3,
    slug: "u15-masculins-region",
    name: "U15 masculins Region",
    category: "Jeunes masculins",
    imageUrl: "/images/equipes/u15GR.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/regional/championnat-u15-masculin-29039/poule-180316/",
  },
  {
    id: 4,
    slug: "u15-masculins-depart",
    name: "U15 masculins Depart",
    category: "Jeunes masculins",
    imageUrl: "/images/equipes/u15-masculins.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/departemental/c59-moins-de-15-ans-mas-dept-28304/",
  },
  {
    id: 5,
    slug: "u13-masculins",
    name: "U13 masculins",
    category: "Jeunes masculins",
    imageUrl: "/images/equipes/u13.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/departemental/c59-moins-de-13-ans-mas-dept-28308/poule-184716/",
  },
  {
    id: 6,
    slug: "u11-mixte",
    name: "Nos swannies",
    category: "Jeunes masculins",
    imageUrl: "/images/equipes/u11.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/departemental/c59-moins-de-11-ans-mixte-dept-28314/poule-181415/",
  },
];

export const femaleTeams: SimpleTeam[] = [
    {
    id: 1,
    slug: "departementale-feminin",
    name: "1ère division départementale",
    category: "Seniors féminines",
    imageUrl: "/images/equipes/departementale-feminin.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/departemental/c59-1ere-division-nord-fem-28287/",
  },
  {
    id: 2,
    slug: "u18-feminines-depart",
    name: "U18 féminines Depart",
    category: "Jeunes féminines",
    imageUrl: "/images/equipes/u18f.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/departemental/c59-moins-de-18-ans-fem-dept-28298/",
  },
  {
    id: 3,
    slug: "u15-feminines",
    name: "U15 féminines",
    category: "Jeunes féminines",
    imageUrl: "/images/equipes/u15-feminines.jpg",
    ffhandballUrl: "https://www.ffhandball.fr/competitions/saison-2025-2026-21/departemental/c59-moins-de-15-ans-fem-dept-28301/",
  },
];

export const leisureTeams: SimpleTeam[] = [
  {
    id: 1,
    slug: "loisirs",
    name: "Loisirs",
    category: "Handball loisirs",
    imageUrl: "/images/equipes/loisirs.jpg",
    ffhandballUrl: "",
  },
];

export const allTeams: SimpleTeam[] = [
  ...maleTeams,
  ...femaleTeams,
  ...leisureTeams,
];