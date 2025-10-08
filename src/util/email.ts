import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendNewMessageEmailParams {
  to: string;
  senderName: string;
  messageText: string;
  chatUrl: string;
}

export async function sendNewMessageEmail({
  to,
  senderName,
  messageText,
  chatUrl,
}: SendNewMessageEmailParams) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@tuodominio.com",
    to,
    subject: `Nuovo messaggio da ${senderName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #232323;
              border-radius: 8px;
              padding: 30px;
            }
            .header {
              color: #c8a36a;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .message {
              background-color: #2a2a2a;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              border-left: 4px solid #c8a36a;
            }
            .button {
              display: inline-block;
              background-color: #c8a36a;
              color: #0a0a0a;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Hai ricevuto un nuovo messaggio</div>
            <p>Ciao! <strong>${senderName}</strong> ti ha inviato un messaggio:</p>
            <div class="message">
              "${messageText.length > 200 ? messageText.substring(0, 200) + "..." : messageText}"
            </div>
            <a href="${chatUrl}" class="button">Rispondi al messaggio</a>
            <div class="footer">
              <p>Questa è una notifica automatica. Non rispondere a questa email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hai ricevuto un nuovo messaggio da ${senderName}: ${messageText}. Rispondi qui: ${chatUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email inviata con successo");
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
    throw error;
  }
}
