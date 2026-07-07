import jsPDF from "jspdf";

/**
 * Service de génération de PDF
 */

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const COMPANY_INFO: CompanyInfo = {
  name: "IMMO360",
  address: "Lomé, Togo",
  phone: "+228 XX XX XX XX",
  email: "contact@immo360.tg",
};

/**
 * Génère un PDF de reçu de paiement
 */
export function generateReceiptPDF(data: {
  receiptNumber: string;
  date: string;
  propertyRef: string;
  propertyTitle: string;
  payerName: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
}): jsPDF {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_INFO.name, 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_INFO.address, 105, 28, { align: "center" });
  doc.text(`Tél: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email}`, 105, 34, { align: "center" });

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // Titre
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("REÇU DE PAIEMENT", 105, 52, { align: "center" });

  // Informations du reçu
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  let yPos = 70;
  const leftCol = 25;
  const rightCol = 120;

  doc.text(`N° Reçu:`, leftCol, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(data.receiptNumber, rightCol, yPos);

  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.text(`Date:`, leftCol, yPos);
  doc.text(data.date, rightCol, yPos);

  yPos += 8;
  doc.text(`Type de paiement:`, leftCol, yPos);
  doc.text(data.paymentType, rightCol, yPos);

  yPos += 8;
  doc.text(`Mode de paiement:`, leftCol, yPos);
  doc.text(data.paymentMethod, rightCol, yPos);

  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.text(`Bien concerné:`, leftCol, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 6;
  doc.text(`${data.propertyRef} - ${data.propertyTitle}`, leftCol, yPos);

  yPos += 12;
  doc.setFont("helvetica", "bold");
  doc.text(`Payé par:`, leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.payerName, rightCol, yPos);

  // Montant (mis en évidence)
  yPos += 20;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 8, 170, 20, "F");

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`MONTANT PAYÉ:`, leftCol, yPos);
  doc.text(`${data.amount.toLocaleString()} FCFA`, rightCol, yPos);

  // Pied de page
  yPos = 250;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Merci pour votre paiement", 105, yPos, { align: "center" });

  yPos += 6;
  doc.setFontSize(8);
  doc.text(`Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`, 105, yPos, { align: "center" });

  return doc;
}

/**
 * Génère un PDF de rapport de gestion
 */
export function generateReportPDF(data: {
  reportNumber: string;
  period: string;
  ownerName: string;
  propertyRef: string;
  propertyTitle: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  payments: Array<{ date: string; type: string; amount: number }>;
  interventions: Array<{ date: string; type: string; cost: number }>;
}): jsPDF {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_INFO.name, 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_INFO.address, 105, 28, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Titre
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("RAPPORT DE GESTION", 105, 45, { align: "center" });

  // Informations du rapport
  let yPos = 60;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`N° Rapport: ${data.reportNumber}`, 20, yPos);
  yPos += 8;
  doc.text(`Période: ${data.period}`, 20, yPos);
  yPos += 8;
  doc.text(`Propriétaire: ${data.ownerName}`, 20, yPos);
  yPos += 8;
  doc.text(`Bien: ${data.propertyRef} - ${data.propertyTitle}`, 20, yPos);

  // Résumé financier
  yPos += 15;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("RÉSUMÉ FINANCIER", 20, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Revenus totaux:`, 25, yPos);
  doc.setTextColor(0, 128, 0);
  doc.text(`+${data.totalRevenue.toLocaleString()} FCFA`, 120, yPos);

  yPos += 8;
  doc.setTextColor(0, 0, 0);
  doc.text(`Dépenses totales:`, 25, yPos);
  doc.setTextColor(255, 0, 0);
  doc.text(`-${data.totalExpenses.toLocaleString()} FCFA`, 120, yPos);

  yPos += 8;
  doc.setLineWidth(0.3);
  doc.line(25, yPos, 170, yPos);

  yPos += 8;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Revenu net:`, 25, yPos);
  doc.text(`${data.netIncome.toLocaleString()} FCFA`, 120, yPos);

  // Détails des paiements
  yPos += 15;
  doc.setFontSize(12);
  doc.text("PAIEMENTS REÇUS", 20, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  data.payments.slice(0, 8).forEach((payment) => {
    doc.text(payment.date, 25, yPos);
    doc.text(payment.type, 60, yPos);
    doc.text(`${payment.amount.toLocaleString()} FCFA`, 120, yPos);
    yPos += 6;
  });

  // Détails des interventions
  if (data.interventions.length > 0) {
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INTERVENTIONS", 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    data.interventions.slice(0, 8).forEach((intervention) => {
      doc.text(intervention.date, 25, yPos);
      doc.text(intervention.type, 60, yPos);
      doc.text(`${intervention.cost.toLocaleString()} FCFA`, 120, yPos);
      yPos += 6;
    });
  }

  // Pied de page
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(`Rapport généré le ${new Date().toLocaleDateString("fr-FR")}`, 105, 280, { align: "center" });

  return doc;
}

/**
 * Génère un PDF de contrat
 */
export function generateContractPDF(data: {
  contractNumber: string;
  contractType: string;
  date: string;
  propertyRef: string;
  propertyTitle: string;
  ownerName: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  terms: string;
}): jsPDF {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_INFO.name, 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_INFO.address, 105, 28, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Titre
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`CONTRAT DE ${data.contractType.toUpperCase()}`, 105, 45, { align: "center" });

  // Contenu du contrat
  let yPos = 60;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`N° Contrat: ${data.contractNumber}`, 20, yPos);
  yPos += 8;
  doc.text(`Date: ${data.date}`, 20, yPos);

  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.text("ENTRE LES SOUSSIGNÉS:", 20, yPos);

  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.text(`Le propriétaire: ${data.ownerName}`, 25, yPos);
  yPos += 8;
  doc.text(`Le locataire: ${data.tenantName}`, 25, yPos);

  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.text("OBJET DU CONTRAT:", 20, yPos);

  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.text(`Bien: ${data.propertyRef} - ${data.propertyTitle}`, 25, yPos);
  yPos += 8;
  doc.text(`Période: Du ${data.startDate} au ${data.endDate}`, 25, yPos);
  yPos += 8;
  doc.text(`Loyer mensuel: ${data.monthlyRent.toLocaleString()} FCFA`, 25, yPos);
  yPos += 8;
  doc.text(`Caution: ${data.deposit.toLocaleString()} FCFA`, 25, yPos);

  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.text("CONDITIONS:", 20, yPos);

  yPos += 10;
  doc.setFont("helvetica", "normal");
  const terms = doc.splitTextToSize(data.terms, 170);
  doc.text(terms, 25, yPos);

  // Signatures
  yPos = 240;
  doc.setFont("helvetica", "bold");
  doc.text("Le propriétaire", 30, yPos);
  doc.text("Le locataire", 130, yPos);

  yPos += 20;
  doc.setLineWidth(0.3);
  doc.line(25, yPos, 80, yPos);
  doc.line(125, yPos, 180, yPos);

  return doc;
}