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

const DEFAULT_HERO_TEXT =
  "Un club, une équipe, une famille. Retrouvez les matchs, les équipes, les actualités et toute la vie du club.";

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
  const heroText = clubInfo?.heroText || DEFAULT_HERO_TEXT;
  const heroMediaType = clubInfo?.heroMediaType || "none";
  const heroMediaUrl = getMediaUrl(clubInfo?.heroMediaUrl);

  const useCustomImage = heroMediaType === "image" && heroMediaUrl;
  const useCustomVideo = heroMediaType === "video" && heroMediaUrl;

  return (
    <section
      className="relative z-0 min-h-screen overflow-hidden bg-black"
      style={
        !useCustomVideo
          ? {
              backgroundImage: `url('${useCustomImage ? heroMediaUrl : DEFAULT_HERO_IMAGE}')`,
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
    {/**changement image , enlever le voile noir au cas ou */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex min-h-[620px] items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="mt-10 max-w-3xl text-lg leading-6 section-font text-white">
              {heroText}
            </p>

            <div className="mt-40 flex flex-wrap items-center justify-center gap-7 sm:flex-row">
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