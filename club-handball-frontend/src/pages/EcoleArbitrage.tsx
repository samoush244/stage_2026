import type { ReactElement } from "react";
import {
  FaBookOpen,
  FaChalkboardTeacher,
} from "react-icons/fa";

import {GiWhistle} from "react-icons/gi";
import { MdAssessment } from "react-icons/md";

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
    title: "Formation aux fondamentaux des règles du jeu",
    description:
      "Mettre en place des sessions de formation destinées aux jeunes arbitres afin de renforcer leur connaissance des règles de handball.Harmoniser les contenus pédagogiques pour garantir une compréhension commune des fondamentaux.",
     icon: <FaBookOpen />,
  },
  {
    title: "Formation aux fondamentaux de l'arbitrage",
    description:
      "Développer des modules spécifiques sur les techniques et principes de l’arbitrage. Accompagner les jeunes arbitres dans l’acquisition des compétences nécessaires à la gestion des rencontres.",
    icon: <GiWhistle />,
  },
  {
    title: "Formation des accompagnateurs ",
    description:
      "Mettre en place des formations à destination des accompagnateurs d’écoles d’arbitrage et des accompagnateurs de club. Sensibiliser ces acteurs aux règles et aux principes de l’arbitrage afin d’assurer un accompagnement cohérent et constructif des jeunes arbitres.",
    icon: <FaChalkboardTeacher/>,
  },
  {
    title: "Suivi et évaluation des jeunes arbitres",
    description:
      "Élaborer des fiches de suivi par catégorie, en cohérence avec les objectifs de la filière jeune et en lien avec la CTJA.Assurer un suivi régulier sur l’ensemble des rencontres jeunes, des catégories moins de 11 ans à moins de 15 ans.Identifier les axes de progression et accompagner le développement des compétences arbitrales tout au long de la saison",
    icon: <MdAssessment />,
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
              de structurer, accompagner et valoriser la formation des jeunes arbitres en développant un dispositif complet de formation,
              d’accompagnement Club et d’alimenter la filière CTJA
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
              de l’organisation, de la formation et du suivi des jeunes arbitres.
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Niveau 1 */}
            <div className="w-full max-w-md">
              <OrgCard
                title="Animateur Ecole d'Arbitrage"
                name="Fabrice Millet"
                role="Organisation générale, suivi de l’école d’arbitrage et coordination avec le club."
                variant="red"
              />
            </div>

            <div className="h-10 w-1 bg-red-600" />

            {/* Ligne horizontale niveau 2 */}
            <div className="hidden w-full max-w-4xl items-center md:flex">
              <div className="h-1 flex-1 bg-red-600" />
              <div className="h-1 flex-1 bg-red-600" />
            </div>
            {/* Niveau 2 */}
            <div className="grid w-full gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title="Accompagnateur Territorial"
                  name="David Bardin"
                  role=""
                  variant="dark"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title="Accompagnateur Club"
                  name="Florian Millet"
                  role=""
                  variant="dark"
                />
              </div>
            </div>

            <div className="h-10 w-1 bg-red-600" />

            {/* Ligne horizontale niveau 3 */}
            <div className="hidden w-full max-w-4xl items-center md:flex">
              <div className="h-1 flex-1 bg-red-600" />
              <div className="h-1 flex-1 bg-red-600" />
            </div>

            {/* Niveau 3 */}
            <div className="grid w-full gap-6 md:grid-cols-4">
              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title=""
                  name="Yanis HADJADJ AOUL"
                  role=""
                  variant="light"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title=""
                  name="Guilhem DEMKIW"
                  role=""
                  variant="light"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title=""
                  name="Géral OVERSTEYNS"
                  role=""
                  variant="light"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title=""
                  name="Arnaud WALESSA"
                  role=""
                  variant="light"
                />
              </div>
            </div>

            <div className="h-10 w-1 bg-red-600" />

            {/* Ligne horizontale niveau 4 */}
            <div className="hidden w-full max-w-4xl items-center md:flex">
              <div className="h-1 flex-1 bg-red-600" />
              <div className="h-1 flex-1 bg-red-600" />
            </div>
            {/* Niveau 4 */}
            <div className="grid w-full gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title=""
                  name="Grégory LAGNEAU"
                  role=""
                  variant="dark"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-1 bg-red-600" />
                <OrgCard
                  title=""
                  name="JaJ Club CTJA"
                  role=""
                  variant="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EcoleArbitragePage;