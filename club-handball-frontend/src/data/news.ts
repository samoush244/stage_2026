export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  date: string;
  summary: string;
  imageUrl?: string;
  type: "club" | "external";
  content?: string[];
  sourceName?: string;
  externalUrl?: string;
};

export const newsItems: NewsItem[] = [
  {
    id: 1,
    slug: "Championne de Natoinale 3 féminine",
    title: "𝐍𝐎𝐒 𝐑𝐄𝐃 𝐆𝐈𝐑𝐋𝐒 𝐄𝐍 𝐍𝐀𝐓𝐈𝐎𝐍𝐀𝐋𝐄 𝟐 ! ",
    date: "12 mai 2026",
    summary:
      "𝑯𝑰𝑺𝑻𝑶𝑹𝑰𝑸𝑼𝑬𝑬𝑬𝑬𝑬𝑬𝑬𝑬 𝑵𝑶𝑺 #𝑺𝑭𝑨 𝑨𝑪𝑪𝑬̀𝑫𝑬𝑵𝑻 𝑨̀ 𝑳𝑨 𝑵𝑨𝑻𝑰𝑶𝑵𝑨𝑳𝑬 𝟐 ! 🤩",
    imageUrl: "/images/actualités/n3_championne.jpg",
    type: "club",
    content: [
      "Dans une Antre des Tertiales pleine à craquer, nos handballeuses valenciennoises se sont imposées face au Tourcoing HB sur le score de 2️⃣8️⃣ à 2️⃣3️⃣.",
    ],
  },
  {
    id: 1,
    slug: "article-presse",
    title: " 𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐬𝐮𝐫 𝐧𝐨𝐬 #𝐒𝐌𝐀 & #𝐒𝐅𝐀 !",
    date: "15 mai 2026",
    summary:"𝑷𝒆𝒏𝒅𝒂𝒏𝒕 𝒒𝒖𝒆 𝒍𝒆𝒔 𝒉𝒂𝒏𝒅𝒃𝒂𝒍𝒍𝒆𝒖𝒓𝒔 𝒗𝒂𝒍𝒆𝒏𝒄𝒊𝒆𝒏𝒏𝒐𝒊𝒔 𝒗𝒂𝒍𝒊𝒅𝒂𝒊𝒆𝒏𝒕 𝒍𝒆𝒖𝒓 𝒐𝒃𝒋𝒆𝒄𝒕𝒊𝒇, 𝒕𝒐𝒖𝒕𝒆 𝒍’𝒂𝒕𝒕𝒆𝒏𝒕𝒊𝒐𝒏 𝒅𝒖 𝒄𝒍𝒖𝒃 𝒔’𝒆𝒔𝒕 𝒅𝒆́𝒔𝒐𝒓𝒎𝒂𝒊𝒔 𝒕𝒐𝒖𝒓𝒏𝒆́𝒆 𝒗𝒆𝒓𝒔 𝒖𝒏 𝒓𝒆𝒏𝒅𝒆𝒛-𝒗𝒐𝒖𝒔 𝒅’𝒖𝒏𝒆 𝒕𝒐𝒖𝒕𝒆 𝒂𝒖𝒕𝒓𝒆 𝒅𝒊𝒎𝒆𝒏𝒔𝒊𝒐𝒏, 𝒄𝒆 𝒔𝒂𝒎𝒆𝒅𝒊 𝒔𝒐𝒊𝒓, 𝒂𝒖𝒙 𝑻𝒆𝒓𝒕𝒊𝒂𝒍𝒆𝒔, 𝒍𝒆𝒔 𝑹𝒆𝒅 𝑮𝒊𝒓𝒍𝒔 𝒐𝒏𝒕 𝒓𝒆𝒏𝒅𝒆𝒛-𝒗𝒐𝒖𝒔 𝒂𝒗𝒆𝒄 𝒍’𝒉𝒊𝒔𝒕𝒐𝒊𝒓𝒆. ",
    imageUrl: "/images/actualités/article2.jpg",
    type: "external",
    sourceName: "Tous les valenciennois",
    externalUrl: "https://www.scaldis.fr/2026/05/15/handball-mission-accomplie-pour-les-red-swans-de-lautre-cote-les-red-girls-ont-desormais-rendez-vous-avec-lhistoire/?fbclid=IwY2xjawR0IMRleHRuA2FlbQIxMQBzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEe7UJMspmwxsfsDjLO6XHzgHfoZOYPH99_KyrohC0klSDogzpYwBtB0MqHchA_aem_6KjqqlKKd__7weG4kpT1yg",
  },
  {
    id: 1,
    slug: "maintien-nationale-3-masculine",
    title: "Maintien en Nationale 3 Masculine",
    date: "12 mai 2026",
    summary:
      "Nos Red Swans sont officiellement maintenus en Nationale 3.",
    imageUrl: "/images/actualités/maintien.jpg",
    type: "club",
    content: [
      "En déplacement ce dimanche après-midi au 𝐇𝐁𝐂 𝐑𝐨𝐮𝐦𝐨𝐢𝐬, nos handballeurs valenciennois sont revenus avec un match nul frustrant sur le score de 3️⃣3️⃣ à 3️⃣3️⃣, mais suffisant afin d’assurer définitivement leur maintien en 𝐍𝐚𝐭𝐢𝐨𝐧𝐚𝐥𝐞 𝟑.",
      "Le public a répondu présent et la Red Army a une nouvelle fois donné de la voix pour pousser les joueurs jusqu’au coup de sifflet final.",
      "𝑹𝒆𝒏𝒅𝒆𝒛-𝒗𝒐𝒖𝒔 𝒂𝒖𝒙 𝑻𝒆𝒓𝒕𝒊𝒂𝒍𝒆𝒔, 𝒍𝒆 𝑺𝒂𝒎𝒆𝒅𝒊 𝟑𝟎 𝑴𝒂𝒊 𝒂̀ 𝟐𝟎𝒉𝟎𝟎 𝒑𝒐𝒖𝒓 𝒍𝒆 𝒅𝒆𝒓𝒏𝒊𝒆𝒓 𝒎𝒂𝒕𝒄𝒉 𝒅𝒆 𝒄𝒆𝒕𝒕𝒆 𝒔𝒂𝒊𝒔𝒐𝒏 𝒂𝒗𝒆𝒄 𝒍𝒂 𝒔𝒐𝒊𝒓𝒆́𝒆 𝒆́𝒗𝒆̀𝒏𝒆𝒎𝒆𝒏𝒕 : 𝐍𝐈𝐆𝐇𝐓 𝐎𝐅 𝐆𝐎𝐋𝐃 !",
    ],
  },
  {
    id: 2,
    slug: "horaires-entrainements-saison",
    title: "⚔️👑 𝐋𝐀 𝐁𝐀𝐓𝐀𝐈𝐋𝐋𝐄 𝐃𝐔 𝐒𝐀𝐂𝐑𝐄. 👑⚔️",
    date: "8 mai 2026",
    summary:
      "𝑼𝒏 𝒄𝒉𝒐𝒄 𝒅𝒆 𝒇𝒆𝒖, 𝒖𝒏 𝒄𝒐𝒎𝒃𝒂𝒕 𝒔𝒂𝒏𝒔 𝒑𝒊𝒕𝒊𝒆́, 𝒖𝒏𝒆 𝒔𝒂𝒍𝒍𝒆 𝒒𝒖𝒊 𝒗𝒂 𝒃𝒂𝒔𝒄𝒖𝒍𝒆𝒓…🦢",
    imageUrl: "/images/actualités/n3f_match.jpg",
    type: "club",
    content: [
      "Nos #SFA (1ères – 55 pts) reçoivent le Tourcoing HB (3èmes – 51 pts) pour la 21ᵉ journée de Nationale 3.",
      "💥 Avant-dernier match de championnat.",
      "💥 Un choc brutal au sommet.",
      "💥 Une soirée qui peut marquer l’histoire.",
      "🔥 En cas de match nul ou de victoire, nos Red Girls seraient championnes de Nationale 3 à l’issue de la rencontre.",
      "⚔️ Deux équipes qui se connaissent, deux équipes qui s’attendent, deux équipes prêtes à se livrer un combat total.",
      "🔥 𝐋’𝐎𝐁𝐉𝐄𝐂𝐓𝐈𝐅 𝐄𝐒𝐓 𝐂𝐋𝐀𝐈𝐑 :",
      "Frapper fort, imposer le rythme, et aller chercher le titre dans l’intensité, ensemble.,"
    ],
  },
  {
    id: 3,
    slug: "article-presse-locale",
    title: "𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐬𝐮𝐫 𝐧𝐨𝐬 #𝐒𝐌𝐀 & #𝐒𝐅𝐀 !",
    date: "2 mai 2026",
    summary:
      "𝑫𝒆𝒖𝒙 𝒓𝒆́𝒔𝒖𝒍𝒕𝒂𝒕𝒔 𝒐𝒑𝒑𝒐𝒔𝒆́𝒔, 𝒅𝒆𝒖𝒙 𝒆́𝒎𝒐𝒕𝒊𝒐𝒏𝒔 𝒅𝒊𝒇𝒇𝒆́𝒓𝒆𝒏𝒕𝒆𝒔, 𝒎𝒂𝒊𝒔 𝒖𝒏 𝒎𝒆̂𝒎𝒆 𝒄𝒐𝒏𝒔𝒕𝒂𝒕 : 𝒓𝒊𝒆𝒏 𝒏’𝒆𝒔𝒕 𝒆𝒏𝒄𝒐𝒓𝒆 𝒐𝒇𝒇𝒊𝒄𝒊𝒆𝒍𝒍𝒆𝒎𝒆𝒏𝒕 𝒗𝒂𝒍𝒊𝒅𝒆́. 𝑵𝒊 𝒍𝒆 𝒎𝒂𝒊𝒏𝒕𝒊𝒆𝒏 𝒅𝒆𝒔 #𝑺𝑴𝑨, 𝒏𝒊 𝒍𝒂 𝒎𝒐𝒏𝒕𝒆́𝒆 𝒅𝒆𝒔 #𝑺𝑭𝑨. 𝑨̀ 𝒍’𝒂𝒑𝒑𝒓𝒐𝒄𝒉𝒆 𝒅𝒖 𝒔𝒑𝒓𝒊𝒏𝒕 𝒇𝒊𝒏𝒂𝒍, 𝒍𝒆𝒔 𝒄𝒂𝒍𝒄𝒖𝒍𝒂𝒕𝒓𝒊𝒄𝒆𝒔 𝒔𝒐𝒏𝒕 𝒐𝒇𝒇𝒊𝒄𝒊𝒆𝒍𝒍𝒆𝒎𝒆𝒏𝒕 𝒔𝒐𝒓𝒕𝒊𝒆𝒔 𝒅𝒖 𝒄𝒐̂𝒕𝒆́ 𝒅𝒆𝒔 𝑻𝒆𝒓𝒕𝒊𝒂𝒍𝒆𝒔. .",
    imageUrl: "/images/actualités/article.jpg",
    type: "external",
    sourceName: "Tous les valenciennois",
    externalUrl: "https://www.scaldis.fr/2026/05/08/handball-objectif-rempli-pour-valenciennes-pas-encore-sortez-les-calculettes/?fbclid=IwY2xjawRz5TJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEefuImPzGU1WLpuDTkNj7Gd5SEeJp-BcJjr8ut-c5MMEmH4gGpObjEm4yvcKo_aem_2fOBsktU9NErTdiL4i-xfw",
  },
];