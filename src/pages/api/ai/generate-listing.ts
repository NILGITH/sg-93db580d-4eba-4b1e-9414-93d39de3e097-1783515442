import type { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
  prompt: string;
  propertyContext?: {
    type?: string;
    surface?: number;
    rooms?: number;
    price?: number;
    location?: string;
    features?: string[];
  };
  tone?: "professional" | "warm" | "premium" | "commercial";
  action?: "generate" | "improve" | "title";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file." 
    });
  }

  try {
    const { prompt, propertyContext, tone = "professional", action = "generate" } = req.body as RequestBody;

    const systemPrompts = {
      professional: "Tu es un expert en rédaction d'annonces immobilières professionnelles. Tu crées des descriptions claires, précises et attractives qui mettent en valeur les biens tout en restant factuelles.",
      warm: "Tu es un expert en rédaction d'annonces immobilières avec un ton chaleureux et accueillant. Tu crées des descriptions qui font rêver tout en restant honnêtes et authentiques.",
      premium: "Tu es un expert en rédaction d'annonces pour l'immobilier de prestige. Tu crées des descriptions sophistiquées et élégantes qui reflètent le standing exceptionnel des biens.",
      commercial: "Tu es un expert en rédaction d'annonces immobilières persuasives. Tu crées des descriptions dynamiques et convaincantes qui incitent à l'action."
    };

    const actionPrompts = {
      generate: "Génère une description complète et attractive pour cette annonce immobilière.",
      improve: "Améliore et réécris ce texte d'annonce immobilière pour le rendre plus professionnel et attractif.",
      title: "Suggère 3 titres accrocheurs et professionnels pour cette annonce immobilière."
    };

    let contextString = "";
    if (propertyContext) {
      const { type, surface, rooms, price, location, features } = propertyContext;
      contextString = "\n\nContexte du bien :\n";
      if (type) contextString += `- Type : ${type}\n`;
      if (surface) contextString += `- Surface : ${surface} m²\n`;
      if (rooms) contextString += `- Nombre de pièces : ${rooms}\n`;
      if (price) contextString += `- Prix : ${price.toLocaleString()} €\n`;
      if (location) contextString += `- Localisation : ${location}\n`;
      if (features && features.length > 0) contextString += `- Équipements : ${features.join(", ")}\n`;
    }

    const fullPrompt = `${actionPrompts[action]}\n\n${prompt}${contextString}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompts[tone] },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "";

    return res.status(200).json({ text: generatedText });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to generate text" 
    });
  }
}