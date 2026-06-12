import { Link } from "react-router";

type HeroMediaType = "none" | "image" | "video";

type ClubInfo = {
  heroText?: string;
  heroMediaType?: HeroMediaType;
  heroMediaUrl?: string;
};

type HeroSectionProps = {
  clubInfo?: ClubInfo | null;
};

const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

const DEFAULT_HERO_IMAGE = "/images/hero-handball.jpg";

const DEFAULT_HERO_TEXT = "Un club, une équipe, une famille.";

function getMediaUrl(media?: string) {
  if (!media) return "";

  if (media.startsWith("http://") || media.startsWith("https://")) {
    return media;
  }

  if (media.startsWith("/")) {
    return `${BACKEND_URL}${media}`;
  }

  return `${BACKEND_URL}/${media}`;
}

function HeroSection({ clubInfo }: HeroSectionProps) {
  const heroMediaType = clubInfo?.heroMediaType || "none";
  const heroMediaUrl = getMediaUrl(clubInfo?.heroMediaUrl);

  const useCustomImage = heroMediaType === "image" && Boolean(heroMediaUrl);
  const useCustomVideo = heroMediaType === "video" && Boolean(heroMediaUrl);

  const hasCustomMedia = useCustomImage || useCustomVideo;

  const heroTextFromAdmin = clubInfo?.heroText?.trim() || "";

  // Si l'admin a écrit un texte, on l'affiche.
  // Si l'admin laisse le texte vide MAIS qu'il y a une image ou vidéo, on n'affiche rien.
  // Si l'admin laisse le texte vide ET qu'il n'y a aucune image/vidéo, on affiche le texte par défaut.
  const heroText =
    heroTextFromAdmin || (!hasCustomMedia ? DEFAULT_HERO_TEXT : "");

  return (
    <section
      className="relative z-0 min-h-screen overflow-hidden bg-black"
      style={
        !useCustomVideo
          ? {
              backgroundImage: `url('${
                useCustomImage ? heroMediaUrl : DEFAULT_HERO_IMAGE
              }')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {useCustomVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroMediaUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6">

          {/* 
            EMPLACEMENT DU TEXTE + DES BOUTONS

            Pour DESCENDRE le bloc : augmente translate-y-[120px]
            Exemple : translate-y-[150px] ou translate-y-[180px]

            Pour REMONTER le bloc : diminue translate-y-[120px]
            Exemple : translate-y-[80px] ou translate-y-[60px]

            Sur grand écran, tu peux aussi modifier md:translate-y-[140px]
          */}
          <div className="relative z-20 mx-auto flex max-w-3xl translate-y-[120px] flex-col items-center text-center md:translate-y-[140px]">
            {heroText && (
              <p className="max-w-3xl text-lg leading-7 section-font text-white md:text-xl">
                {heroText}
              </p>
            )}

            {/* 
              ESPACE ENTRE LE TEXTE ET LES BOUTONS

              Pour descendre les boutons par rapport au texte : augmente mt-16
              Exemple : mt-20 ou mt-24

              Pour rapprocher les boutons du texte : diminue mt-16
              Exemple : mt-10 ou mt-8
            */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-7 sm:flex-row">
              <Link
                to="/billetterie"
                className="rounded-md bg-red-600 px-7 py-4 font-bold text-white transition hover:bg-red-700"
              >
                Billetterie
              </Link>

              <Link
                to="/club/histoire"
                className="rounded-md border border-white/30 bg-black/40 px-7 py-4 font-bold text-white backdrop-blur transition hover:border-red-500 hover:text-red-500"
              >
                Découvrir le club
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;