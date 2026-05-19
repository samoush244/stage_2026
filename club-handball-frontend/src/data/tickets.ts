export type TicketEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  ticketUrl: string;
};

export const ticketEvents: TicketEvent[] = [
    {
    id: 1,
    title: "Nationale 3 féminine - Match à domicile",
    date: "Dimanche 19 mai 2026",
    time: "16h00",
    location: "salle des tertiales",
    description:
      "L’équipe première féminine vous attend pour un rendez-vous important de la saison.",
    imageUrl: "/images/billeterie/n3f_match.jpg",
    ticketUrl: "https://www.helloasso.com/",
  },
  {
    id: 2,
    title: "Nationale 3 masculine - Match à domicile",
    date: "Samedi 18 mai 2026",
    time: "20h30",
    location: "Gymnase principal",
    description:
      "Venez soutenir l’équipe première masculine lors de son prochain match à domicile.",
    imageUrl: "/images/billetterie/n3-masculine.jpg",
    ticketUrl: "https://www.helloasso.com/",
  },
  
  {
    id: 3,
    title: "Soirée du club",
    date: "Samedi 8 juin 2026",
    time: "19h00",
    location: "Salle municipale",
    description:
      "Un événement convivial pour rassembler licenciés, familles, bénévoles et supporters.",
    imageUrl: "/images/billetterie/soiree-club.jpg",
    ticketUrl: "https://www.helloasso.com/",
  },
];