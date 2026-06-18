import type { ReactElement } from "react";
import {
  FaBookOpen,
  FaClipboardCheck,
  FaHandsHelping,
  FaUsers,
  FaGavel,
} from "react-icons/fa";

type WorkAxis = {
  title: string;
  description: string;
  icon: ReactElement;
};

type OrgMember = {
  title: string;
  name: string;
  role: string;
  variant?: "red" | "dark" | "light";
};

const workAxes: WorkAxis[] = [
  {
    title: "Formation aux règles du jeu",
    description:
      "Accompagner les jeunes arbitres dans l’apprentissage des règles, des gestes officiels, des fautes, des sanctions et de la gestion d’un match.",
    icon: <FaBookOpen />,
  },
  {
    title: "Mise en situation sur le terrain",
    description:
      "Permettre aux jeunes arbitres de pratiquer lors de rencontres adaptées, afin de gagner en expérience et en confiance.",
    icon: <FaGavel />,
  },
  {
    title: "Accompagnement des jeunes arbitres",
    description:
      "Suivre les arbitres en formation avant, pendant et après les matchs pour les aider à progresser étape par étape.",
    icon: <FaHandsHelping />,
  },
  {
    title: "Développement de la confiance",
    description:
      "Aider les jeunes à prendre des décisions, à communiquer clairement et à gérer les situations de match avec calme.",
    icon: <FaUsers />,
  },
  {
    title: "Respect et esprit sportif",
    description:
      "Sensibiliser les joueurs, entraîneurs et supporters au respect de l’arbitre, des adversaires et des valeurs du handball.",
    icon: <FaClipboardCheck />,
  },
];

function OrgCard({ title, name, role, variant = "light" }: OrgMember) {
  const styles = {
    red: "border-red-600 bg-red-600 text-white",
    dark: "border-gray-900 bg-gray-900 text-white",
    light: "border-gray-200 bg-white text-gray-900",
  };

  return (
    <div
      className={`w-full rounded-2xl border px-5 py-4 text-center shadow-md ${styles[variant]}`}
    >
      <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-bold">{name}</h3>

      <p
        className={`mt-2 text-sm leading-relaxed ${
          variant === "light" ? "text-gray-600" : "text-white/90"
        }`}
      >
        {role}
      </p>
    </div>
  );
}

function EcoleArbitragePage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
            Le club
          </p>

          <h1 className="text-4xl font-extrabold uppercase tracking-tight md:text-6xl">
            École d’arbitrage
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            L’école d’arbitrage du club accompagne les jeunes arbitres dans leur
            formation, leur progression et leur prise de confiance sur le
            terrain. Elle participe au développement d’une culture du respect,
            de la responsabilité et de l’esprit sportif.
          </p>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Présentation
            </p>

            <h2 className="text-3xl font-extrabold text-gray-950 md:text-4xl">
              Former, accompagner et valoriser les jeunes arbitres
            </h2>

            <p className="mt-5 leading-relaxed text-gray-700">
              L’arbitrage est une partie essentielle de la vie du club. À
              travers cette école, les jeunes licenciés peuvent découvrir les
              règles du handball autrement, apprendre à prendre des décisions et
              participer activement au bon déroulement des rencontres.
            </p>

            <p className="mt-4 leading-relaxed text-gray-700">
              Le club souhaite proposer un cadre simple, progressif et
              bienveillant, permettant à chaque jeune arbitre d’évoluer à son
              rythme, avec l’aide des encadrants et des référents du club.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-950">
              Objectifs de l’école
            </h3>

            <ul className="mt-5 space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-600" />
                Découvrir et comprendre les règles du handball.
              </li>

              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-600" />
                Accompagner les jeunes arbitres sur les rencontres.
              </li>

              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-600" />
                Développer la confiance, la communication et la prise de
                décision.
              </li>

              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-600" />
                Valoriser l’arbitrage au sein du club.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* AXES DE TRAVAIL */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Formation
            </p>

            <h2 className="text-3xl font-extrabold text-gray-950 md:text-4xl">
              Les axes de travail
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
              L’école d’arbitrage repose sur plusieurs axes permettant
              d’accompagner les jeunes dans leur progression, à la fois sur le
              plan théorique, pratique et humain.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workAxes.map((axis) => (
              <article
                key={axis.title}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl text-white">
                  {axis.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-950">
                  {axis.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {axis.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANIGRAMME */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Organisation
            </p>

            <h2 className="text-3xl font-extrabold text-gray-950 md:text-4xl">
              Organigramme de l’école d’arbitrage
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
              L’école d’arbitrage est encadrée par une équipe référente chargée
              de l’organisation, de la formation et du suivi des jeunes
              arbitres.
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Niveau 1 */}
            <div className="w-full max-w-md">
              <OrgCard
                title="Responsable école d’arbitrage"
                name="Nom Prénom"
                role="Organisation générale, suivi de l’école d’arbitrage et coordination avec le club."
                variant="red"
              />
            </div>

            <div className="h-10 w-1 bg-red-600" />

            {/* Niveau 2 */}
            <div className="w-full max-w-md">
              <OrgCard
                title="Coordinateur arbitrage"
                name="Nom Prénom"
                role="Lien entre les arbitres, les encadrants, les équipes et les instances."
                variant="dark"
              />
            </div>

            <div className="h-10 w-1 bg-red-600" />

            {/* Ligne horizontale desktop */}
            <div className="hidden w-full max-w-4xl items-center md:flex">
              <div className="h-1 flex-1 bg-red-600" />
              <div className="h-1 flex-1 bg-red-600" />
            </div>

            {/* Niveau 3 */}
            <div className="grid w-full gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title="Référent formation"
                  name="Nom Prénom"
                  role="Apprentissage des règles, séances théoriques et accompagnement pédagogique."
                  variant="light"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title="Référent terrain"
                  name="Nom Prénom"
                  role="Suivi des jeunes arbitres pendant les matchs et retours après les rencontres."
                  variant="light"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title="Référent administratif"
                  name="Nom Prénom"
                  role="Gestion des plannings, informations, convocations et communication."
                  variant="light"
                />
              </div>
            </div>

            <div className="h-10 w-1 bg-red-600" />

            {/* Niveau 4 */}
            <div className="w-full max-w-lg">
              <OrgCard
                title="Jeunes arbitres accompagnés"
                name="Groupe des jeunes arbitres"
                role="Licenciés du club engagés dans la découverte, la formation et la pratique de l’arbitrage."
                variant="dark"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EcoleArbitragePage;