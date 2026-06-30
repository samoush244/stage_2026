import { useEffect, useState } from "react";
import { getPublicOrganizationMembers } from "../services/organizationMemberService";
import type { OrganizationMember } from "../services/organizationMemberService";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

function optimizeCloudinaryImage(url: string, width = 700, height = 760) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,c_fill,g_auto,w_${width},h_${height}/`
  );
}

function getImageUrl(photo?: string) {
  if (!photo) {
    return "";
  }

  let finalUrl = photo;

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    finalUrl = photo;
  } else if (photo.startsWith("/")) {
    finalUrl = `${SERVER_URL}${photo}`;
  } else {
    finalUrl = `${SERVER_URL}/${photo}`;
  }

  return optimizeCloudinaryImage(finalUrl);
}

function getInitials(member: OrganizationMember) {
  const firstInitial = member.firstName?.charAt(0) || "";
  const lastInitial = member.lastName?.charAt(0) || "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

function OrganigrammePage() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getPublicOrganizationMembers();
        setMembers(data);
      } catch (error) {
        console.error("Erreur récupération organigramme :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const bureauMembers = members.filter((member) => member.group === "bureau");
  const caMembers = members.filter((member) => member.group === "ca");

  if (loading) {
    return (
      <main className="bg-white px-6 py-24 text-black">
        <p>Chargement de l'organigramme...</p>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">

      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Le Club
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">Organigramme</h1>

          <p className="mt-6 max-w-3xl text-lg text-zinc-300">
            Découvrez les membres qui participent à la gestion et au
            développement du club.
          </p>
          
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl space-y-16">
          <MemberSection title="Bureau" members={bureauMembers} />
          <MemberSection title="Conseil d'administration" members={caMembers} />
        </div>
      </section>
    </main>
  );
}

type MemberSectionProps = {
  title: string;
  members: OrganizationMember[];
};

function MemberSection({ title, members }: MemberSectionProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-8 text-3xl font-extrabold uppercase text-black">
        {title}
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <article
            key={member._id}
            className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="h-[300px] w-full overflow-hidden bg-zinc-100 sm:h-[330px] lg:h-[350px]">
              {member.photo ? (
                <img
                  src={getImageUrl(member.photo)}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-200 text-5xl font-black text-zinc-500">
                  {getInitials(member)}
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-extrabold uppercase">
                {member.firstName} {member.lastName}
              </h3>

              <p className="mt-2 font-semibold text-red-600">{member.role}</p>

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="mt-4 inline-block break-all text-sm text-zinc-600 hover:text-red-600"
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