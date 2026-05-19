import HeroSection from "../components/HeroSection";
import partners from "../data/partners";
import { Link } from "react-router";
function HomePage() {
  return (
    <>
      <HeroSection />
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

    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
      {partners.map((partner) => (
        <a
          key={partner.name}
          href={partner.url}
          target="_blank"
          rel="noreferrer"
          className="flex h-32 items-center justify-center rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <img
            src={partner.logo}
            alt={partner.name}
            className="max-h-16 max-w-full object-contain"
          />
        </a>
      ))}
    </div>

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