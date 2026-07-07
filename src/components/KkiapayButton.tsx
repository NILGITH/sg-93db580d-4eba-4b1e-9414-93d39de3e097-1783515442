import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { initKkiapay, openKkiapayWidget, type KkiapayPaymentData, type KkiapayPaymentResult } from "@/lib/kkiapay";

interface KkiapayButtonProps {
  amount: number;
  reason: string;
  name?: string;
  phone?: string;
  email?: string;
  onSuccess: (result: KkiapayPaymentResult) => void;
  onFailed?: (result: KkiapayPaymentResult) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function KkiapayButton({
  amount,
  reason,
  name,
  phone,
  email,
  onSuccess,
  onFailed,
  disabled = false,
  children,
}: KkiapayButtonProps) {
  useEffect(() => {
    initKkiapay((response) => {
      if (response.status === "SUCCESS") {
        onSuccess(response);
      } else if (response.status === "FAILED" && onFailed) {
        onFailed(response);
      }
    });
  }, [onSuccess, onFailed]);

  function handlePayment() {
    const paymentData: KkiapayPaymentData = {
      amount,
      reason,
      name,
      phone,
      email,
    };

    openKkiapayWidget(paymentData);
  }

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={disabled}
      className="bg-accent hover:bg-accent/90"
    >
      <CreditCard className="w-4 h-4 mr-2" />
      {children || `Payer ${amount.toLocaleString()} FCFA`}
    </Button>
  );
}