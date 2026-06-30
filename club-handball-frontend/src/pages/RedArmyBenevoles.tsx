import {Link} from "react-router";
export default function Communaute() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* HERO */}

      <section className="relative h-[420px] overflow-hidden bg-zinc-950">
        <img
          src="/images/supporter.jpg"
          alt="Supporters et bénévoles du club"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        
      
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-red-950/40" />
     
  {/* Contenu centré verticalement et horizontalement */}
 
  <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 sm:px-16">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Le Club
          </p>
        
           <h1 className="text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl text-white">
            Red Army
            <span className="block text-red-500">& Bénévoles</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
            Derrière chaque match, chaque ambiance, chaque événement et chaque moment fort,
            il y a des femmes et des hommes qui donnent de leur temps pour faire vivre le club.
          </p>
          </div>
      </section>

      {/* FIL D'ARIANE + INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* FIL D'ARIANE 
        <div className="mb-10 text-sm font-medium text-zinc-500">
          Accueil <span className="text-red-600">›</span> Vie du club{" "}
          <span className="text-red-600">›</span> Red Army & Bénévoles
        </div>*/}

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Une même énergie
            </p>

            <h2 className="text-4xl font-black uppercase text-zinc-950 md:text-5xl">
              Ceux qui font battre le cœur du club
            </h2>

            <div className="mt-7 space-y-5 text-lg leading-8 text-zinc-700">
              <p>
                Le club ne vit pas seulement grâce aux joueurs et aux coachs. Il avance aussi
                grâce aux supporters, aux bénévoles, aux familles et à toutes les personnes
                qui participent à l’ambiance et à l’organisation.
              </p>

              <p>
                La Red Army pousse les équipes depuis les tribunes. Les bénévoles rendent
                possible l’accueil, la buvette, la logistique et les événements. Deux rôles
                différents, mais un même objectif : faire grandir le club.
              </p>

              <p>
                Sans eux, un soir de match serait juste un gymnase, un ballon et quelques
                regards gênés. Franchement, personne n’a signé pour ça.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full bg-red-600" />
            <img
              src="/images/img.png"
              alt="Vie du club"
              className="relative z-10 h-[420px] w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* DEUX BLOCS RED ARMY / BENEVOLES */}
      <section className="bg-zinc-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Deux piliers
          </p>

          <h2 className="max-w-3xl text-4xl font-black uppercase md:text-5xl">
            Supporter, aider, faire vivre
          </h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* RED ARMY */}
            <article className="group overflow-hidden bg-white text-zinc-950">
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src="/images/kop.jpg"
                  alt="Red Army"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-4xl font-black uppercase text-white">
                  Red Army
                </h3>
              </div>

              <div className="p-8">
                <p className="text-lg leading-8 text-zinc-700">
                  La Red Army rassemble les supporters qui donnent de la voix, portent les
                  couleurs du club et créent une vraie ambiance les soirs de match.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="border-l-4 border-red-600 bg-zinc-100 p-4">
                    Encourager les équipes
                  </div>
                  <div className="border-l-4 border-red-600 bg-zinc-100 p-4">
                    Créer une ambiance forte
                  </div>
                  <div className="border-l-4 border-red-600 bg-zinc-100 p-4">
                    Rassembler les supporters
                  </div>
                </div>
              </div>
            </article>

            {/* BENEVOLES */}
            <article className="group overflow-hidden bg-white text-zinc-950">
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src="/images/benevole.jpg"
                  alt="Bénévoles"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-4xl font-black uppercase text-white">
                  Bénévoles
                </h3>
              </div>

              <div className="p-8">
                <p className="text-lg leading-8 text-zinc-700">
                  Les bénévoles participent à l’organisation des matchs, à l’accueil du public,
                  à la buvette, aux événements et à la vie quotidienne du club.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="border-l-4 border-red-600 bg-zinc-100 p-4">
                    Accueillir le public
                  </div>
                  <div className="border-l-4 border-red-600 bg-zinc-100 p-4">
                    Aider à l’organisation
                  </div>
                  <div className="border-l-4 border-red-600 bg-zinc-100 p-4">
                    Participer aux événements
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/*
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-full w-full bg-red-600" />
            <img
              src="/images/red-army-2.jpg"
              alt="Supporters du club"
              className="relative z-10 h-[430px] w-full object-cover shadow-2xl"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Supporters
            </p>

            <h2 className="text-4xl font-black uppercase text-zinc-950 md:text-5xl">
              La Red Army, notre force en tribune
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-700">
              Être dans la Red Army, c’est soutenir le club avec passion, respect et fierté.
              Les chants, les encouragements et la présence en tribune donnent une énergie
              supplémentaire aux joueurs.
            </p>

            <p className="mt-5 text-lg leading-8 text-zinc-700">
              À domicile, chaque voix compte. Un public qui pousse son équipe peut changer
              l’ambiance d’un match et donner au club une vraie identité.
            </p>
          </div>
        </div>
      </section>
      // bande rouge 
      <section className="bg-red-600 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          <div>
            <p className="text-5xl font-black">01</p>
            <h3 className="mt-3 text-xl font-black uppercase">Encourager</h3>
            <p className="mt-3 text-red-50">
              Soutenir les équipes dans les bons comme dans les moments plus difficiles.
            </p>
          </div>

          <div>
            <p className="text-5xl font-black">02</p>
            <h3 className="mt-3 text-xl font-black uppercase">Rassembler</h3>
            <p className="mt-3 text-red-50">
              Créer un vrai groupe autour du club et de ses couleurs.
            </p>
          </div>

          <div>
            <p className="text-5xl font-black">03</p>
            <h3 className="mt-3 text-xl font-black uppercase">Faire vibrer</h3>
            <p className="mt-3 text-red-50">
              Transformer les matchs en moments forts pour tout le club.
            </p>
          </div>
        </div>
      </section> */}
      {/* SECTION BENEVOLES 
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Engagement
            </p>

            <h2 className="text-4xl font-black uppercase text-zinc-950 md:text-5xl">
              Les bénévoles, indispensables au club
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-700">
              Les bénévoles sont présents avant, pendant et après les matchs. Ils aident à
              installer, accueillir, servir, ranger, organiser et accompagner les événements
              du club.
            </p>

            <p className="mt-5 text-lg leading-8 text-zinc-700">
              Leur aide peut être régulière ou ponctuelle. Chaque présence compte, même une
              petite aide sur un match ou un événement. Le club se construit aussi avec ces
              gestes-là.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full bg-zinc-950" />
            <img
              src="/images/benevoles-2.jpg"
              alt="Bénévoles pendant un événement"
              className="relative z-10 h-[430px] w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>
*/}
      {/* MISSIONS BENEVOLES */}
      <section className="bg-zinc-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
            Participer
          </p>

          <h2 className="max-w-3xl text-4xl font-black uppercase text-zinc-950 md:text-5xl">
            Comment aider le club ?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <div className="bg-white p-6 shadow-md">
              <h3 className="text-xl font-black uppercase text-red-600">
                Accueil
              </h3>
              <p className="mt-4 text-zinc-600">
                Orienter le public, accueillir les équipes et aider les visiteurs.
              </p>
            </div>

            <div className="bg-white p-6 shadow-md">
              <h3 className="text-xl font-black uppercase text-red-600">
                Buvette
              </h3>
              <p className="mt-4 text-zinc-600">
                Participer aux services et à la convivialité pendant les matchs.
              </p>
            </div>

            <div className="bg-white p-6 shadow-md">
              <h3 className="text-xl font-black uppercase text-red-600">
                Logistique
              </h3>
              <p className="mt-4 text-zinc-600">
                Installer, ranger et aider à la préparation des événements.
              </p>
            </div>

            <div className="bg-white p-6 shadow-md">
              <h3 className="text-xl font-black uppercase text-red-600">
                Événements
              </h3>
              <p className="mt-4 text-zinc-600">
                Aider lors des tournois, animations, soirées ou actions du club.
              </p>
            </div>
          </div>
        </div>
      </section>

     {/* CTA CONTACT */}
      <section className="bg-zinc-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Nous rejoindre
          </p>

          <h2 className="text-4xl font-black uppercase md:text-5xl">
            Envie de participer à la vie du club ?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Que ce soit pour rejoindre la Red Army, devenir bénévole ou proposer ton aide
            ponctuellement, tu peux envoyer un message au club via le formulaire de contact.
          </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/contact"
          className="bg-red-600 px-8 py-4 font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-zinc-950">
              Envoyer une demande
          </Link>

          <Link to="/contact"
        className="border-2 border-white px-8 py-4 font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-zinc-950">
          Contacter le club
        </Link>
      </div>
      </div>
  </section>
    </main>
  );
}