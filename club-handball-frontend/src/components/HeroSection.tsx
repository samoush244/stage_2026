import { Link } from 'react-router';

function HeroSection() {
  return (
  <section
  className="relative z-0 min-h-screen overflow-hidden bg-black"
  style={{
    backgroundImage: "url('/images/hero-handball.jpg')"/* --- Image de fond à changer --- */,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
  <div className="absolute inset-0 bg-black/25" />

  <div className="relative z-10 flex min-h-[620px] items-center">
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
          Un club, une équipe, une famille. Retrouvez les matchs,
          les équipes, les actualités et toute la vie du club.
        </p>

        <div className="mt-40 flex flex-wrap gap-7 items-center justify-center sm:flex-row ">
          <Link
            to="/billetterie"
            className="rounded-md bg-red-600 px-7 py-4 font-bold text-white transition hover:bg-red-700"
          >
            Billeterie
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