import partners from "../data/partners";

const allPartners = [
  ...partners,
  {
    name: "Partenaire 7",
    logo: "/images/logo/logo7.png",
    url: "#",
  },
  {
    name: "Partenaire 8",
    logo: "/images/logo/logo8.png",
    url: "#",
  },
  {
    name: "Partenaire 9",
    logo: "/images/logo/logo9.png",
    url: "#",
  },
  {
    name: "Partenaire 10",
    logo: "/images/logo/logo10.png",
    url: "#",
  },
];  
export default function PartnersPage() {
  return (
    <main className="bg-white">
      <section className="bg-black py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">
            Le club
          </p>
          <h1 className="mt-4 text-5xl font-black">
            Nos partenaires
          </h1>
          <p className="mt-6 max-w-2xl text-zinc-300">
            Découvrez les entreprises et structures qui accompagnent le club
            dans son développement sportif et associatif.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-3 lg:grid-cols-4">
          {allPartners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-40 items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-20 max-w-full object-contain"
              />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}