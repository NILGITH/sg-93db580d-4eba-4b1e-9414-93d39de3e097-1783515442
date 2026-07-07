/**
 * Service d'envoi d'emails via Resend
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
}

/**
 * Envoie un email via l'API route
 */
export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    const response = await fetch("/api/emails/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Template email: Demande de visite (pour l'agent)
 */
export function getVisitRequestEmailHTML(data: {
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  propertyRef: string;
  propertyTitle: string;
  preferredDate: string;
  message?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0F1A2B; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; margin-top: 20px; }
    .property { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #E4B850; }
    .visitor-info { background: white; padding: 15px; margin: 15px 0; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>IMMO360</h1>
      <p>Nouvelle demande de visite</p>
    </div>
    <div class="content">
      <h2>Demande de visite reçue</h2>
      
      <div class="property">
        <h3>Bien concerné</h3>
        <p><strong>${data.propertyRef}</strong> - ${data.propertyTitle}</p>
      </div>

      <div class="visitor-info">
        <h3>Informations du visiteur</h3>
        <p><strong>Nom:</strong> ${data.visitorName}</p>
        <p><strong>Email:</strong> ${data.visitorEmail}</p>
        <p><strong>Téléphone:</strong> ${data.visitorPhone}</p>
        <p><strong>Date souhaitée:</strong> ${data.preferredDate}</p>
        ${data.message ? `<p><strong>Message:</strong><br>${data.message}</p>` : ""}
      </div>

      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/visits" 
           style="background: #E4B850; color: #0F1A2B; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 4px;">
          Gérer cette demande
        </a>
      </p>
    </div>
    <div class="footer">
      <p>IMMO360 - Gestion immobilière professionnelle</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template email: Confirmation de réservation (pour le client)
 */
export function getBookingConfirmationEmailHTML(data: {
  clientName: string;
  propertyRef: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  depositPaid: number;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0F1A2B; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; margin-top: 20px; }
    .booking-details { background: white; padding: 20px; margin: 15px 0; }
    .highlight { background: #E4B850; color: #0F1A2B; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Réservation confirmée</h1>
      <p>IMMO360</p>
    </div>
    <div class="content">
      <p>Bonjour ${data.clientName},</p>
      <p>Votre réservation a été confirmée avec succès !</p>

      <div class="booking-details">
        <h3>${data.propertyRef} - ${data.propertyTitle}</h3>
        <p><strong>Arrivée:</strong> ${data.checkIn}</p>
        <p><strong>Départ:</strong> ${data.checkOut}</p>
        <p><strong>Montant total:</strong> ${data.totalAmount.toLocaleString()} FCFA</p>
        <p><strong>Acompte payé:</strong> ${data.depositPaid.toLocaleString()} FCFA</p>
      </div>

      <div class="highlight">
        Réservation confirmée
      </div>

      <p style="margin-top: 20px;">
        Nous avons hâte de vous accueillir. Si vous avez des questions, n'hésitez pas à nous contacter.
      </p>
    </div>
    <div class="footer">
      <p>IMMO360 - Tél: +228 XX XX XX XX - Email: contact@immo360.tg</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template email: Rapport disponible (pour le propriétaire)
 */
export function getReportAvailableEmailHTML(data: {
  ownerName: string;
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0F1A2B; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; margin-top: 20px; }
    .summary { background: white; padding: 20px; margin: 15px 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Rapport de gestion disponible</h1>
      <p>IMMO360</p>
    </div>
    <div class="content">
      <p>Bonjour ${data.ownerName},</p>
      <p>Votre rapport de gestion pour la période <strong>${data.period}</strong> est maintenant disponible.</p>

      <div class="summary">
        <h3>Résumé</h3>
        <div class="summary-row">
          <span>Revenus:</span>
          <span style="color: green; font-weight: bold;">+${data.totalRevenue.toLocaleString()} FCFA</span>
        </div>
        <div class="summary-row">
          <span>Dépenses:</span>
          <span style="color: red; font-weight: bold;">-${data.totalExpenses.toLocaleString()} FCFA</span>
        </div>
        <div class="summary-row">
          <span><strong>Revenu net:</strong></span>
          <span style="font-weight: bold; font-size: 18px;">${data.netIncome.toLocaleString()} FCFA</span>
        </div>
      </div>

      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/owner" 
           style="background: #E4B850; color: #0F1A2B; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 4px;">
          Consulter mon rapport
        </a>
      </p>
    </div>
    <div class="footer">
      <p>IMMO360 - Gestion immobilière professionnelle</p>
    </div>
  </div>
</body>
</html>
  `;
}