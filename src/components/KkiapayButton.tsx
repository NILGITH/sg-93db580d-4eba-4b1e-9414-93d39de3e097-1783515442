import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { initKkiapay, openKkiapayWidget, type KkiapayPaymentResult } from "@/lib/kkiapay";

export interface KkiapayButtonProps {
  amount: number;
  reason: string;
  onSuccess: (result: KkiapayPaymentResult) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function KkiapayButton({ 
  amount, 
  reason, 
  onSuccess, 
  children,
  disabled = false,
  className = "",
}: KkiapayButtonProps) {
  useEffect(() => {
    initKkiapay();
  }, []);

  function handleClick() {
    openKkiapayWidget({
      amount,
      reason,
      callback: onSuccess,
      theme: "#0F1A2B",
    });
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      <CreditCard className="w-4 h-4 mr-2" />
      {children || `Payer ${amount.toLocaleString()} FCFA`}
    </Button>
  );
}