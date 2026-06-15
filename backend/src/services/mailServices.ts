import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("Configuration SMTP manquante.");
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendWelcomeEmail = async (
  email: string,
  unsubscribeUrl: string
) => {
  const transporter = getTransporter();

  const result = await transporter.sendMail({
    from: process.env.MAIL_FROM || `"Red Swans" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Bienvenue dans la newsletter des Red Swans",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Bienvenue dans la famille Red Swans !</h2>

        <p>Merci pour votre inscription à la newsletter du club.</p>

        <p>
          Vous recevrez désormais nos actualités, annonces importantes,
          prochains matchs, événements et informations du club.
        </p>

        <p>
          Pas de spam : uniquement les informations utiles liées à la vie du club.
        </p>

        <hr />

        <p style="font-size: 12px; color: #666;">
          Vous recevez cet email car vous avez accepté de recevoir les actualités
          du club via notre formulaire newsletter.
        </p>

        <p style="font-size: 12px;">
          <a href="${unsubscribeUrl}">
            Se désinscrire de la newsletter
          </a>
        </p>
      </div>
    `,
    text: `
Bienvenue dans la famille Red Swans !

Merci pour votre inscription à la newsletter du club.
Vous recevrez désormais nos actualités, annonces importantes, prochains matchs, événements et informations du club.

Se désinscrire : ${unsubscribeUrl}
    `,
  });

  console.log("Email de bienvenue envoyé :", result.messageId);
};