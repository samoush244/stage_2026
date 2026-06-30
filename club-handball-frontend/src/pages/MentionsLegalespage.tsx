import { Link } from "react-router";
import type { ReactNode } from "react";

const LEGAL_INFO = {
  clubName: "Valenciennes Handball Club",
  legalForm: "Association sportive régie par la loi du 1er juillet 1901",

  // À REMPLIR AVEC LES VRAIES INFORMATIONS DU CLUB
  address: "SALLE DES TERTIALES CHEMIN DES ALLIES",
  postalCode: "59300",
  city: "Valenciennes",
  email: "secretariat@valencienneshandball.fr",
  rna: "W596005914", // Exemple : W59XXXXXXXX
  siret: "82146524200013",

  // Généralement : président(e) du club ou représentant légal
  publicationDirector: "SYRAN BEN SEDDIK - sbenseddik@valencienneshandball.f",

  // Toi ou la personne qui maintient techniquement le site
  webmaster: "SAMIA KETCHEMEN - samiarosyketchemen@gmail.com",

  // Ne renseigner que si le club a officiellement désigné un DPO
  dpo: "",

  // À modifier lorsque le vrai domaine sera acheté
  siteUrl: "https://stage-2026.vercel.app/",

  // Ces durées doivent correspondre à ce que le club applique réellement
  contactRetention: "12 mois après le dernier échange",
  newsletterRetention:
    "jusqu’au désabonnement ou selon la durée définie par le club",

  lastUpdate: "30 juin 2026",
};

type LegalSectionProps = {
  number?: string;
  title: string;
  children: ReactNode;
  id?: string;
};

function LegalSection({
  number,
  title,
  children,
  id,
}: LegalSectionProps) {
  return (
    <section id={id} className="border-b border-zinc-200 py-8 last:border-b-0">
      <div className="flex items-start gap-4">
        {number && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">
            {number}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-zinc-950 sm:text-2xl">
            {title}
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-700 sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  children: ReactNode;
};

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <p>
      <strong className="text-zinc-950">{label} :</strong> {children}
    </p>
  );
}

function MentionsLegalesPage() {
  const fullAddress = `${LEGAL_INFO.address}, ${LEGAL_INFO.postalCode} ${LEGAL_INFO.city}`;

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-sm">
        <header className="border-b-4 border-red-700 bg-zinc-950 px-6 py-10 text-white sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            Valenciennes Handball Club
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Mentions légales et confidentialité
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
            Informations relatives à l’éditeur, à l’utilisation du site, aux
            données personnelles et aux cookies.
          </p>
        </header>

        <div className="px-6 py-2 sm:px-10">
          <LegalSection title="Définitions">
            <p>
              <strong>Utilisateur :</strong> toute personne naviguant sur le
              site du Valenciennes Handball Club.
            </p>

            <p>
              <strong>Contenu :</strong> ensemble des textes, photographies,
              vidéos, logos, documents, graphismes et informations publiés sur
              le site.
            </p>

            <p>
              <strong>Données personnelles :</strong> toute information
              permettant d’identifier directement ou indirectement une personne
              physique.
            </p>
          </LegalSection>

          <LegalSection number="1" title="Présentation du site internet">
            <p>
              Conformément à la réglementation applicable, les utilisateurs du
              site sont informés de l’identité des différents intervenants dans
              sa réalisation et son suivi.
            </p>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <InfoRow label="Propriétaire du site">
                {LEGAL_INFO.clubName} – {LEGAL_INFO.legalForm}
              </InfoRow>

              <InfoRow label="Siège social">{fullAddress}</InfoRow>

              <InfoRow label="Email">
                <a
                  href={`mailto:${LEGAL_INFO.email}`}
                  className="font-medium text-red-700 underline underline-offset-4"
                >
                  {LEGAL_INFO.email}
                </a>
              </InfoRow>


              {LEGAL_INFO.rna && (
                <InfoRow label="Numéro RNA">{LEGAL_INFO.rna}</InfoRow>
              )}

              {LEGAL_INFO.siret && (
                <InfoRow label="Numéro SIRET">{LEGAL_INFO.siret}</InfoRow>
              )}

              <InfoRow label="Responsable de la publication">
                {LEGAL_INFO.publicationDirector}
              </InfoRow>

              <InfoRow label="Webmaster">
                {LEGAL_INFO.webmaster}
              </InfoRow>

              {LEGAL_INFO.dpo && (
                <InfoRow label="Délégué à la protection des données">
                  {LEGAL_INFO.dpo}
                </InfoRow>
              )}
            </div>

            <p>
              Le responsable de la publication peut être contacté à l’adresse
              email indiquée ci-dessus.
            </p>
          </LegalSection>

          <LegalSection number="2" title="Conditions générales d’utilisation">
            <p>
              L’utilisation du site implique l’acceptation pleine et entière
              des présentes conditions générales d’utilisation.
            </p>

            <p>
              Le Valenciennes Handball Club peut modifier ou compléter ces
              mentions à tout moment. Les utilisateurs sont invités à les
              consulter régulièrement.
            </p>

            <p>
              Le site est normalement accessible à tout moment. Une interruption
              temporaire peut toutefois avoir lieu pour des raisons de
              maintenance, de mise à jour ou de problème technique.
            </p>
          </LegalSection>

          <LegalSection number="3" title="Description des services fournis">
            <p>
              Le site a pour objectif de présenter les activités du Valenciennes
              Handball Club et de centraliser les informations utiles aux
              licenciés, familles, partenaires et visiteurs.
            </p>

            <ul className="list-disc space-y-1 pl-5">
              <li>actualités du club ;</li>
              <li>présentation des équipes et effectifs ;</li>
              <li>calendriers et résultats ;</li>
              <li>événements et informations pratiques ;</li>
              <li>partenaires du club ;</li>
              <li>formulaire de contact et inscription à la newsletter.</li>
            </ul>

            <p>
              Les informations publiées sont fournies à titre indicatif. Le club
              s’efforce de les maintenir à jour, mais ne peut garantir
              l’absence totale d’erreurs, d’oublis ou de retards de mise à jour.
            </p>
          </LegalSection>

          <LegalSection number="4" title="Limitations techniques">
            <p>
              Le site utilise notamment les technologies React, TypeScript,
              JavaScript et des services web externes nécessaires à son
              fonctionnement.
            </p>

            <p>
              L’utilisateur s’engage à accéder au site avec un matériel récent,
              protégé contre les virus et équipé d’un navigateur à jour.
            </p>

            <p>
              Le Valenciennes Handball Club ne pourra être tenu responsable
              d’un dysfonctionnement lié au réseau Internet, à l’équipement de
              l’utilisateur, à une incompatibilité technique ou à une
              indisponibilité temporaire d’un service tiers.
            </p>
          </LegalSection>

          <LegalSection number="5" title="Propriété intellectuelle">
            <p>
              Le site, ses textes, graphismes, photographies, vidéos, logos,
              documents et éléments de mise en page sont protégés par les règles
              applicables en matière de propriété intellectuelle.
            </p>

            <p>
              Toute reproduction, représentation, modification, publication ou
              adaptation de tout ou partie du contenu du site est interdite sans
              autorisation écrite préalable du Valenciennes Handball Club ou du
              titulaire concerné.
            </p>

            <p>
              Les marques et logos des partenaires restent la propriété de leurs
              titulaires respectifs.
            </p>
          </LegalSection>

          <LegalSection number="6" title="Limitations de responsabilité">
            <p>
              Le Valenciennes Handball Club agit en qualité d’éditeur du site et
              s’efforce de publier des contenus fiables et actualisés.
            </p>

            <p>
              Le club ne pourra être tenu responsable des dommages directs ou
              indirects liés à l’utilisation du site, à l’impossibilité d’y
              accéder, à une incompatibilité technique ou à l’utilisation d’un
              service externe accessible depuis le site.
            </p>

            <p>
              Les messages envoyés via le formulaire de contact doivent respecter
              la législation française. Le club peut supprimer tout message
              injurieux, diffamatoire, discriminatoire, violent ou contraire à
              la loi.
            </p>
          </LegalSection>

          <LegalSection
            number="7"
            title="Gestion des données personnelles"
            id="donnees-personnelles"
          >
            <h3 className="font-bold text-zinc-950">
              7.1 Responsable du traitement
            </h3>

            <p>
              Le responsable du traitement des données personnelles collectées
              via le site est le Valenciennes Handball Club, représenté par{" "}
              <strong>{LEGAL_INFO.publicationDirector}</strong>.
            </p>

            <h3 className="font-bold text-zinc-950">
              7.2 Données collectées et finalités
            </h3>

            <p>
              Le site peut collecter certaines données personnelles dans les cas
              suivants :
            </p>

            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Formulaire de contact :</strong> nom, prénom, adresse
                email, téléphone éventuel, objet et contenu du message.
              </li>

              <li>
                <strong>Newsletter :</strong> adresse email, date du
                consentement et informations nécessaires à la gestion du
                désabonnement.
              </li>

              <li>
                <strong>Sécurité technique :</strong> données techniques
                nécessaires au fonctionnement et à la sécurité du site, comme
                les journaux techniques ou l’adresse IP.
              </li>
            </ul>

            <p>Ces données sont utilisées uniquement pour :</p>

            <ul className="list-disc space-y-1 pl-5">
              <li>répondre aux demandes envoyées au club ;</li>
              <li>envoyer la newsletter aux personnes inscrites ;</li>
              <li>gérer les désinscriptions ;</li>
              <li>assurer la sécurité et le bon fonctionnement du site.</li>
            </ul>

            <p>
              Le Valenciennes Handball Club ne vend pas et ne loue pas les
              données personnelles des utilisateurs.
            </p>

            <h3 className="font-bold text-zinc-950">
              7.3 Destinataires des données
            </h3>

            <p>
              Les données sont accessibles uniquement aux personnes autorisées
              du club et aux prestataires techniques nécessaires au
              fonctionnement du site, notamment Vercel, Render, MongoDB Atlas
              et Cloudinary.
            </p>

            <p>
              Certains prestataires techniques peuvent traiter des données en
              dehors de l’Union européenne. Le club doit vérifier les garanties
              prévues par ces prestataires avant la mise en ligne définitive.
            </p>

            <h3 className="font-bold text-zinc-950">
              7.4 Durée de conservation
            </h3>

            <ul className="list-disc space-y-1 pl-5">
              <li>
                Messages envoyés via le formulaire de contact :{" "}
                {LEGAL_INFO.contactRetention}.
              </li>

              <li>
                Données liées à la newsletter :{" "}
                {LEGAL_INFO.newsletterRetention}.
              </li>
            </ul>

            <h3 className="font-bold text-zinc-950">
              7.5 Vos droits
            </h3>

            <p>
              Conformément au RGPD, vous disposez d’un droit d’accès, de
              rectification, d’effacement, d’opposition, de limitation du
              traitement et, lorsque cela est applicable, de portabilité de vos
              données.
            </p>

            <p>
              Pour exercer vos droits, écrivez à{" "}
              <a
                href={`mailto:${LEGAL_INFO.email}`}
                className="font-medium text-red-700 underline underline-offset-4"
              >
                {LEGAL_INFO.email}
              </a>
              .
            </p>

            <p>
              Vous pouvez également introduire une réclamation auprès de la{" "}
              <a
                href="https://www.cnil.fr/fr/plaintes"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-red-700 underline underline-offset-4"
              >
                CNIL
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection number="8" title="Sécurité des données">
            <p>
              Le Valenciennes Handball Club met en œuvre des mesures techniques
              et organisationnelles raisonnables afin de protéger les données
              personnelles contre la perte, l’accès non autorisé, l’altération
              ou la divulgation.
            </p>

            <p>
              Malgré les précautions mises en place, aucune transmission ou
              conservation de données sur Internet ne peut être garantie comme
              totalement sécurisée.
            </p>

            <p>
              En cas d’incident de sécurité présentant un risque pour les droits
              et libertés des personnes, le club prendra les mesures nécessaires
              conformément à la réglementation applicable.
            </p>
          </LegalSection>

          <LegalSection number="9" title="Liens hypertextes et cookies">
            <p>
              Le site peut contenir des liens vers des sites externes, notamment
              ceux des partenaires, fédérations, réseaux sociaux ou plateformes
              de résultats sportifs.
            </p>

            <p>
              Le Valenciennes Handball Club ne peut pas contrôler le contenu,
              la disponibilité ou la politique de confidentialité de ces sites
              externes.
            </p>

            <p>
              Le site peut utiliser des cookies ou stockages techniques
              strictement nécessaires à son fonctionnement. Les cookies non
              essentiels, comme ceux liés à la mesure d’audience, aux réseaux
              sociaux ou à des services externes, doivent faire l’objet d’un
              consentement préalable lorsqu’ils sont activés.
            </p>
          </LegalSection>

          <LegalSection number="10" title="Droit applicable">
            <p>
              Tout litige relatif à l’utilisation du site est soumis au droit
              français.
            </p>

            <p>
              En cas de litige, et sauf disposition légale contraire, les
              juridictions françaises compétentes seront seules compétentes.
            </p>
          </LegalSection>

          <LegalSection title="Hébergement">
            <div className="rounded-2xl bg-zinc-50 p-5">
              <InfoRow label="Hébergement du site public">
                Vercel Inc. – 440 N Barranca Ave #4133, Covina, CA 91723,
                États-Unis.
              </InfoRow>

              <InfoRow label="Hébergement de l’API">
                Render Services, Inc. – 525 Brannan Street, Suite 300, San
                Francisco, CA 94107, États-Unis.
              </InfoRow>
            </div>

            <p>
              Pour toute question concernant le site, utilisez la{" "}
              <Link
                to="/contact"
                className="font-semibold text-red-700 underline underline-offset-4"
              >
                page de contact
              </Link>{" "}
              ou écrivez à{" "}
              <a
                href={`mailto:${LEGAL_INFO.email}`}
                className="font-semibold text-red-700 underline underline-offset-4"
              >
                {LEGAL_INFO.email}
              </a>
              .
            </p>
          </LegalSection>
        </div>

        <footer className="border-t border-zinc-200 bg-zinc-50 px-6 py-5 text-sm text-zinc-500 sm:px-10">
          Dernière mise à jour : {LEGAL_INFO.lastUpdate}
        </footer>
      </div>
    </main>
  );
}

export default MentionsLegalesPage;