import { useEffect, useState } from "react";

import { getPublicOrganizationMembers } from "../services/organizationMemberService";

import type { OrganizationMember } from "../services/organizationMemberService";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

/* =========================================================
   OPTIMISATION CLOUDINARY
========================================================= */

function optimizeCloudinaryImage(
  url: string,
  width = 700,
  height = 760
) {
  if (
    !url.includes("res.cloudinary.com") ||
    !url.includes("/upload/")
  ) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,c_fill,g_auto,w_${width},h_${height}/`
  );
}

/* =========================================================
   CONSTRUCTION DE L'URL DE L'IMAGE
========================================================= */

function getImageUrl(photo?: string | null) {
  if (!photo || photo.trim() === "") {
    return null;
  }

  let finalUrl = photo;

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://")
  ) {
    finalUrl = photo;
  } else if (photo.startsWith("/")) {
    finalUrl = `${SERVER_URL}${photo}`;
  } else {
    finalUrl = `${SERVER_URL}/${photo}`;
  }

  return optimizeCloudinaryImage(finalUrl);
}

/* =========================================================
   PHOTO D'UN MEMBRE

   Photo disponible :
   → affichage normal

   Pas de photo :
   → pictogramme

   URL cassée / 404 / Cloudinary inaccessible :
   → pictogramme
========================================================= */

function OrganizationMemberPhoto({
  member,
}: {
  member: OrganizationMember;
}) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(member.photo);

  const fullName =
    `${member.firstName || ""} ${member.lastName || ""}`.trim();

  if (!imageUrl || imageError) {
    return (
      <div
        className="flex h-full w-full items-center justify-center bg-zinc-100"
        role="img"
        aria-label={fullName}
      >
        <svg
          viewBox="0 0 120 120"
          className="h-[38%] w-[38%] max-h-36 max-w-36 text-zinc-400"
          fill="currentColor"
          aria-hidden="true"
        >
          {/* Tête */}
          <circle cx="60" cy="36" r="24" />

          {/* Corps / épaules */}
          <path
            d="
              M22 77
              C22 68 29 62 38 62
              H82
              C91 62 98 68 98 77
              V82
              C98 100 82 108 60 108
              C38 108 22 100 22 82
              Z
            "
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={fullName}
      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
      loading="lazy"
      decoding="async"
      onError={() => setImageError(true)}
    />
  );
}

/* =========================================================
   PAGE ORGANIGRAMME
========================================================= */

function OrganigrammePage() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getPublicOrganizationMembers();

        setMembers(data);
      } catch (error) {
        console.error(
          "Erreur récupération organigramme :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* =======================================================
     SÉPARATION BUREAU / CA
  ======================================================= */

  const bureauMembers = members.filter(
    (member) => member.group === "bureau"
  );

  const caMembers = members.filter(
    (member) => member.group === "ca"
  );

  /* =======================================================
     CHARGEMENT
  ======================================================= */

  if (loading) {
    return (
      <main className="bg-white px-6 py-24 text-black">
        <p>Chargement de l'organigramme...</p>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="bg-black px-8 py-16 text-white">

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Le Club
          </p>

          <h1 className="text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">
            Organigramme
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-zinc-300">
            Découvrez les membres qui participent à la gestion et au
            développement du club.
          </p>

        </div>

      </section>

      {/* ===================================================
          MEMBRES
      =================================================== */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl space-y-16">

          <MemberSection
            title="Bureau"
            members={bureauMembers}
          />

          <MemberSection
            title="Conseil d'administration"
            members={caMembers}
          />

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   SECTION DE MEMBRES
========================================================= */

type MemberSectionProps = {
  title: string;
  members: OrganizationMember[];
};

function MemberSection({
  title,
  members,
}: MemberSectionProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <section>

      {/* TITRE */}

      <div className="mb-8 flex items-center gap-4">

        <div className="h-10 w-2 bg-red-600" />

        <h2 className="text-3xl font-extrabold uppercase text-black">
          {title}
        </h2>

      </div>

      {/* CARTES */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {members.map((member) => (

          <article
            key={member._id}
            className="group mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            {/* =============================================
                PHOTO / PICTOGRAMME
            ============================================= */}

            <div className="h-[300px] w-full overflow-hidden bg-zinc-100 sm:h-[330px] lg:h-[350px]">

              <OrganizationMemberPhoto
                member={member}
              />

            </div>

            {/* =============================================
                INFORMATIONS
            ============================================= */}

            <div className="p-6">

              <h3 className="text-xl font-extrabold uppercase">
                {member.firstName} {member.lastName}
              </h3>

              <p className="mt-2 font-semibold text-red-600">
                {member.role}
              </p>

              {member.email && (

                <a
                  href={`mailto:${member.email}`}
                  className="mt-4 inline-block break-all text-sm text-zinc-600 transition hover:text-red-600"
                >
                  {member.email}
                </a>

              )}

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}

export default OrganigrammePage;