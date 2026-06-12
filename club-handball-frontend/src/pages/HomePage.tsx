import { useEffect, useState } from "react";
import { Link } from "react-router";
import HeroSection from "../components/HeroSection";
import API from "../services/api";

type Partner = {
  _id: string;
  name: string;
  logo: string;
  url: string;
  order?: number;
  isActive?: boolean;
  showOnHome?: boolean;
};

type ClubInfo = {
  address: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  heroText: string;
  heroMediaType: "none" | "image" | "video";
  heroMediaUrl: string;
};

const defaultClubInfo: ClubInfo = {
  address: "",
  email: "",
  phone: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  heroText:
    "Un club, une équipe, une famille. Retrouvez les matchs, les équipes, les actualités et toute la vie du club.",
  heroMediaType: "none",
  heroMediaUrl: "",
};

const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

function getLogoUrl(logo?: string) {
  if (!logo) return "";

  if (logo.startsWith("http://") || logo.startsWith("https://")) {
    return logo;
  }

  if (logo.startsWith("/")) {
    return `${BACKEND_URL}${logo}`;
  }

  return `${BACKEND_URL}/${logo}`;
}

function HomePage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [clubInfo, setClubInfo] = useState<ClubInfo>(defaultClubInfo);
  const [loadingPartners, setLoadingPartners] = useState(true);

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const res = await API.get("/club-info");

        setClubInfo({
          ...defaultClubInfo,
          ...res.data,
        });
      } catch (error) {
        console.error("Erreur récupération infos club accueil :", error);
      }
    };

    fetchClubInfo();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await API.get("/partners");
        setPartners(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Erreur récupération partenaires accueil :", error);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchPartners();
  }, []);

  const homePartners = partners
    .filter((partner) => partner.isActive !== false && partner.showOnHome === true)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, 5);

  return (
    <>
      <HeroSection clubInfo={clubInfo} />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-600">
              Nos partenaires
            </p>

            <h2 className="mt-4 text-4xl font-black text-zinc-950">
              Ils soutiennent le club
            </h2>
          </div>

          {loadingPartners && (
            <p className="text-center text-zinc-500">
              Chargement des partenaires...
            </p>
          )}

          {!loadingPartners && homePartners.length === 0 && (
            <p className="text-center text-zinc-500">
              Aucun partenaire sélectionné pour l’accueil pour le moment.
            </p>
          )}

          {!loadingPartners && homePartners.length > 0 && (
            <div className="grid grid-cols-2 items-center gap-x-12 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {homePartners.map((partner) => (
                <a
                  key={partner._id}
                  href={partner.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Voir le site de ${partner.name}`}
                  className="group flex min-h-28 items-center justify-center"
                >
                  <img
                    src={getLogoUrl(partner.logo)}
                    alt={partner.name}
                    className="max-h-24 max-w-[170px] object-contain grayscale transition duration-300 group-hover:scale-110 group-hover:grayscale-0"
                  />
                </a>
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              to="/partenaires"
              className="rounded-md bg-red-600 px-8 py-4 font-bold text-white transition hover:bg-red-700"
            >
              Voir tous les partenaires
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;