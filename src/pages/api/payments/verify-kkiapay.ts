import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API route pour vérifier une transaction Kkiapay
 * Utilise la clé privée côté serveur
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: "Transaction ID required" });
  }

  try {
    // Appeler l'API Kkiapay pour vérifier la transaction
    const response = await fetch(
      `https://api.kkiapay.me/api/v1/transactions/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.KKIAPAY_PRIVATE_KEY || "",
        },
        body: JSON.stringify({
          transactionId,
        }),
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Kkiapay API error" });
    }

    const data = await response.json();

    return res.status(200).json({
      status: data.status,
      amount: data.amount,
      fees: data.fees,
    });
  } catch (error) {
    console.error("Error verifying Kkiapay transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}