/**
 * Service Kkiapay pour les paiements en ligne
 * Mode Sandbox pour développement
 */

export interface KkiapayPaymentResult {
  transactionId: string;
  status: string;
}

export function initKkiapay(): void {
  if (typeof window === "undefined") return;

  const script = document.createElement("script");
  script.src = "https://cdn.kkiapay.me/k.js";
  script.async = true;
  document.body.appendChild(script);
}

export function openKkiapayWidget(config: {
  amount: number;
  reason: string;
  callback: (response: KkiapayPaymentResult) => void;
  theme?: string;
  key?: string;
}): void {
  if (typeof window === "undefined" || !(window as any).openKkiapayWidget) {
    console.error("Kkiapay SDK not loaded");
    return;
  }

  (window as any).openKkiapayWidget({
    amount: config.amount,
    position: "center",
    callback: config.callback,
    data: config.reason,
    theme: config.theme || "#0F1A2B",
    key: config.key || process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
    sandbox: true,
  });
}

export async function verifyKkiapayTransaction(transactionId: string): Promise<boolean> {
  try {
    const response = await fetch("/api/payments/verify-kkiapay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Error verifying Kkiapay transaction:", error);
    return false;
  }
}

declare global {
  interface Window {
    openKkiapayWidget: (config: any) => void;
    addKkiapayListener: (event: string, callback: (data: any) => void) => void;
    removeKkiapayListener: (event: string) => void;
    kkiapay: {
      open: (config: any) => void;
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}