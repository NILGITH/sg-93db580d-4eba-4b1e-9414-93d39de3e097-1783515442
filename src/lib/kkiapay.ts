/**
 * Service Kkiapay pour les paiements en ligne
 * Mode Sandbox pour développement
 */

export interface KkiapayPaymentData {
  amount: number;
  reason: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface KkiapayPaymentResult {
  transactionId: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount: number;
  fees: number;
}

/**
 * Initialiser le widget Kkiapay
 */
export function initKkiapay(callback: (response: KkiapayPaymentResult) => void) {
  if (typeof window === "undefined") return;

  // Charger le script Kkiapay si pas déjà chargé
  if (!window.kkiapay) {
    const script = document.createElement("script");
    script.src = "https://cdn.kkiapay.me/k.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      setupKkiapay(callback);
    };
  } else {
    setupKkiapay(callback);
  }
}

function setupKkiapay(callback: (response: KkiapayPaymentResult) => void) {
  if (!window.kkiapay) return;

  window.kkiapay.on("success", (data: any) => {
    callback({
      transactionId: data.transactionId,
      status: "SUCCESS",
      amount: data.amount,
      fees: data.fees || 0,
    });
  });

  window.kkiapay.on("failed", (data: any) => {
    callback({
      transactionId: data.transactionId || "",
      status: "FAILED",
      amount: data.amount || 0,
      fees: 0,
    });
  });
}

/**
 * Ouvrir le widget de paiement Kkiapay
 */
export function openKkiapayWidget(paymentData: KkiapayPaymentData) {
  if (typeof window === "undefined" || !window.kkiapay) {
    console.error("Kkiapay not loaded");
    return;
  }

  window.kkiapay.open({
    amount: paymentData.amount,
    position: "center",
    theme: "#0F1A2B",
    sandbox: true, // Mode sandbox
    key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
    reason: paymentData.reason,
    name: paymentData.name || "",
    phone: paymentData.phone || "",
    email: paymentData.email || "",
  });
}

/**
 * Vérifier le statut d'une transaction (côté serveur uniquement)
 */
export async function verifyKkiapayTransaction(transactionId: string): Promise<{
  status: string;
  amount: number;
} | null> {
  try {
    const response = await fetch(`/api/payments/verify-kkiapay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId }),
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return null;
  }
}

// Type definitions pour le widget Kkiapay global
declare global {
  interface Window {
    kkiapay: {
      open: (config: any) => void;
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}