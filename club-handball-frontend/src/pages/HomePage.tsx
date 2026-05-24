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
                <div className="grid grid-cols-2 items-center gap-x-12 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {partners.slice(0, 5).map((partner) => (
                    <a
                      key={partner.name}
                      href={partner.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Voir le site de ${partner.name}`}
                      className="group flex min-h-28 items-center justify-center"
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-24 max-w-[170px] object-contain grayscale transition duration-300 group-hover:scale-110 group-hover:grayscale-0"
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