export type ScheduleCell = {
  time?: string;
  location?: string;
};

export type ScheduleRow = {
  day: string;
  cells: ScheduleCell[];
};

export type TrainingCategory = {
  id: number;
  title: string;
  ageRange?: string;
  logoUrl?: string;
  coachName?: string;
  coachEmail?: string;
  columns: string[];
  rows: ScheduleRow[];
};

export const trainingCategories: TrainingCategory[] = [
  {
    id: 1,
    title: "Baby Hand",
    ageRange: "3 à 5 ans",
    logoUrl: "/images/categories/baby.png",
    columns: ["Baby Hand"],
    rows: [
      {
        day: "Samedi",
        cells: [
          {
            time: "10h30 - 11h30",
            location: "Salle des tertiales",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Mini Hand",
    ageRange: "6 à 8 ans",
    logoUrl: "/images/categories/mini.png",
    columns: ["Mini-hand"],
    rows: [
      {
        day: "Mercredi",
        cells: [
          {
            time: "16h00 - 17h00",
            location: "Salle des tertiales",
          },
        ],
      },
      {
        day: "Samedi",
        cells: [
          {
            time: "10h30 - 12h00",
            location: "Salle des tertiales",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Moins de 11 ans",
    ageRange: "9 à 10 ans",
    logoUrl: "/images/categories/ecole de hand.png",
    columns: ["Moins de 11 ans"],
    rows: [
      {
        day: "Lundi",
        cells: [
          {
            time: "18h00 - 19h30",
            location: "Salle des tertiales",
          },
          
        ],
      },
      {
        day: "Mercredi",
        cells: [
          {
            time: "16h00- 17h00",
            location: "Salle des tertiales",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Moins de 13 ans",
    ageRange: "10 à 12 ans",
    logoUrl: "/images/categories/ecole de hand.png",
    columns: ["Moins de 13 ans","Moins de 13 ans Feminine",],
    rows: [
      {
        day: "Mardi",
        cells: [
          {
            time: "18h00 - 19h30",
            location: "Salle des tertiales",
          },
          {
            time: "18h00 - 19h30",
            location: "Salle des tertiales",
          },
        ],
      },
      {
        day: "Mercredi",
        cells: [
          {
            time: "17h00 - 19h30",
            location: "Salle des tertiales",
          },
          {
            time: "17h00 - 19h30",
            location: "Salle des tertiales",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Moins de 15 ans",
    ageRange: "12 à 14 ans",
    columns: [
      "Régionale Masculine",
      "Départementale Féminine",
    ],
    rows: [
      {
        day: "Lundi",
        cells: [
          {
            time: "18h00-19h30",
            location: "Salle des tertiales",
          },
          {},
        ],
      },
      {
        day: "Mardi",
        cells: [
          {},
          {
            time: "18h00 - 19h30",
            location: "Salle des tertiales",
          },
        ],
      },
      {
        day: "Mercredi",
        cells: [
          {
            time: "18h30 - 20h00",
            location: "Salle des tertiales",
          },
          {  time: "17h30 - 19h00",
            location: "Salle des tertiales",
        },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Moins de 18 ans",
    ageRange: "15 à 17 ans",
    columns: [
      "Régionale Masculine",
      "Départementale Féminine",
    ],
    rows: [
           {
        day: "Mardi",
        cells: [
          {},
         {
            time: "18h00 - 19h30",
            location: "Salle des tertiales",
          },
        ],
      },
      {
        day: "Mercredi",
        cells: [
          {
            time: "18h30 - 20h00",
            location: "Salle des tertiales",
          },
          {},
        
        ],
      },
       {
        day: "jeudi",
        cells: [
            {
            time: "19h00 - 20h00",
            location: "Salle des tertiales",
            },
          {
            time: "18h00 - 19h30",
            location: "Salle des tertiales",
          },
        ],
      },
       {
        day: "Vendredi",
        cells: [
          {
            time: "18h30 - 20h00",
            location: "Salle des tertiales",
          },
          {},
        
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Seniors",
    ageRange: "à partir de 17 ans",
    columns: [
    "Seniors Masculins 1",
    "Seniors Masculins 2",
    "Seniors Féminines 1",
    "Seniors Féminines 2",

    ],
    rows: [
        {
        day: "Lundi",
        cells: [
          {
            time: "20h00 - 21h30",
            location: "Salle des tertiales",
          },
        {},
        {},
        {
            time: "19h30 - 21h00",
            location: "Salle des tertiales",
          },
        ],
        },
          {
        day: "Mardi",
        cells: [
          {},
        {},
        {
            time: "19h-30 - 21h30",
            location: "Salle des tertiales",
        },
        {},
        ],
      },
      {
        day: "Mercredi",
        cells: [
          {
            time: "20h00 - 21h30",
            location: "Salle des tertiales",
          },
          {
            time: "20h00 - 21h30",
            location: "Salle des tertiales",
          },
        {},
        {},
        ],
      },
      {
        day: "jeudi",
        cells: [
          {
            time: "20h00 - 21h30",
            location: "Salle des tertiales",
          },
          {},
        {
          time: "19h30 - 21h00",
          location: "Salle des tertiales",
        },
        {
          time: "18h00- 19h30",
          location: "Salle des tertiales",
        },
        ],
      },
       {
        day: "Vendredi",
        cells: [
          {
            time: "20h00 - 21h30",
            location: "Salle des tertiales",
          },
          {
            time: "18h30 - 20h00",
            location: "Salle des tertiales",
          },
        {
            time: "20h00 - 21h30",
            location: "Salle des tertiales",
          },
        {
            time: "18h30 - 20h00",
            location: "Salle des tertiales",
        },
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Loisirs",
    ageRange: "à partir de 16 ans",
    logoUrl: "/images/categories/loisirs.png",
    columns: ["Loisirs"],
    rows: [
      {
        day: "Mardi",
        cells: [
          {
            time: "19h30 - 21h00",
            location: "Salle des tertiales",
          },
        ],
      },
    ],
  },
];