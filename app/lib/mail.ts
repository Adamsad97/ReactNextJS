import { Resend } from "resend";

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not defined");
    return { success: false, error: "Missing API key" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email", error);
    return { success: false, error };
  }
}
