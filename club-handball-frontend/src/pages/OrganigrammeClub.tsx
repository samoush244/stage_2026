import {
    boardMembers,
    bureauMembers,
    type OrganizationMember,
} from "../data/OrganigrammeMembers";

type MemberSectionProps = {
  title: string;
  description: string;
  members: OrganizationMember[];
};

function MemberCard({ member }: { member: OrganizationMember }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-72 bg-zinc-900 text-white">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={`${member.firstName} ${member.lastName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-3xl font-extrabold">
              {member.firstName.charAt(0)}
              {member.lastName.charAt(0)}
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-sm font-bold uppercase text-red-600">
          {member.role}
        </p>

        <h3 className="mt-2 text-2xl font-extrabold">
          {member.firstName} {member.lastName}
        </h3>

        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className="mt-4 block text-sm font-medium text-gray-600 hover:text-red-600"
          >
            {member.email}
          </a>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            Adresse email non affichée
          </p>
        )}
      </div>
    </article>
  );
}

function MemberSection({ title, description, members }: MemberSectionProps) {
  return (
    <section className="px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-600">
            Organigramme
          </p>

          <h2 className="mt-3 text-4xl font-extrabold">
            {title}
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            {description}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OrganizationChartPage() {
  return (
    <main className="bg-white text-black">
      <section className="bg-black px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Le club
          </p>

          <h1 className="mt-4 text-5xl font-extrabold">
            Organigramme
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
            Retrouvez les personnes qui participent à la gestion, à
            l’organisation et au développement du club.
          </p>
        </div>
      </section>

      <MemberSection
        title="Le bureau"
        description="Le bureau assure la gestion quotidienne du club, le suivi administratif, financier et associatif."
        members={bureauMembers}
      />

      <section className="bg-zinc-950 text-white">
        <div className="px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                Organigramme
              </p>

              <h2 className="mt-3 text-4xl font-extrabold">
                Conseil d’administration
              </h2>

              <p className="mt-4 max-w-2xl text-gray-400">
                Le conseil d’administration accompagne les décisions importantes
                du club et participe à son développement.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {boardMembers.map((member) => (
                <article
                  key={member.id}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-72 bg-zinc-900 text-white">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-700 via-black to-black">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-3xl font-extrabold">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-sm font-bold uppercase text-red-500">
                      {member.role}
                    </p>

                    <h3 className="mt-2 text-2xl font-extrabold">
                      {member.firstName} {member.lastName}
                    </h3>

                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-4 block text-sm font-medium text-gray-400 hover:text-red-500"
                      >
                        {member.email}
                      </a>
                    ) : (
                      <p className="mt-4 text-sm text-gray-500">
                        Adresse email non affichée
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrganizationChartPage;