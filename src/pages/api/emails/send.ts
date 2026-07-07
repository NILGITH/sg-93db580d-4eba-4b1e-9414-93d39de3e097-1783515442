import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, html, attachments } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const data = await resend.emails.send({
      from: "IMMO360 <noreply@immo360.tg>",
      to: [to],
      subject,
      html,
      attachments,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}