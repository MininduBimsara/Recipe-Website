import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(20, "Message must be at least 20 characters").max(5000),
});

export async function POST(req: NextRequest) {
  // Validate Content-Type
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
  }

  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError.message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { subject } = result.data;

    // Log only non-PII metadata for audit purposes — never log name/email/message body
    console.info(`[Contact] New submission. Subject: "${subject}", timestamp: ${new Date().toISOString()}`);

    return NextResponse.json({ success: true, message: "Message received successfully" });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", code: "CONTACT_ERROR" },
      { status: 500 }
    );
  }
}
