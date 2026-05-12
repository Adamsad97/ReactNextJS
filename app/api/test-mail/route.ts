import { NextResponse } from "next/server";
import { sendMail } from "@/app/lib/mail";

export async function GET() {
  const result = await sendMail({
    to: "djechefotsochristarole@gmail.com",
    subject: "Test TaskFlow Email",
    html: "<h1>It works!</h1><p>This email was sent from your own domain <strong>task-flow.pulseverse.shop</strong></p>",
  });

  if (result.success) {
    return NextResponse.json({ message: "Email sent successfully", data: result.data });
  } else {
    return NextResponse.json({ error: "Failed to send email", details: result.error }, { status: 500 });
  }
}
