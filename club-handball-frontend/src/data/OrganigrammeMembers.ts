export type OrganizationMember = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  photoUrl?: string;
};

export const bureauMembers: OrganizationMember[] = [
  {
    id: 1,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Président",
    email: "president@club-handball.fr",
    photoUrl: "/images/organigramme/president.jpg",
  },
  {
    id: 2,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Vice-président",
  },
  {
    id: 3,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Trésorier",
    email: "tresorier@club-handball.fr",
  },
  {
    id: 4,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Secrétaire",
  },
];

export const boardMembers: OrganizationMember[] = [
  {
    id: 1,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Membre du conseil d’administration",
  },
  {
    id: 2,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Membre du conseil d’administration",
  },
  {
    id: 3,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Membre du conseil d’administration",
  },
  {
    id: 4,
    firstName: "Prénom",
    lastName: "Nom",
    role: "Membre du conseil d’administration",
  },
];