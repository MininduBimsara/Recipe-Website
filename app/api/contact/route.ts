import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Backend validation support
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is a required field", code: "VALIDATION_MISSING_NAME" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address format", code: "VALIDATION_INVALID_EMAIL" },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Subject selection is required", code: "VALIDATION_MISSING_SUBJECT" },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 20) {
      return NextResponse.json(
        { 
          error: "Message must be at least 20 characters in length to avoid spam filtering", 
          code: "VALIDATION_MESSAGE_TOO_SHORT" 
        },
        { status: 400 }
      );
    }

    // Explicitly logger outputs in accordance with architectural plans
    console.log("💌 [Dishcraft Contact Form Submission Received]:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Message logged securely" });
  } catch (err: any) {
    console.error("Contact Form Pipeline Exception:", err);
    return NextResponse.json(
      { 
        error: err.message || "The communication gateway encountered an unexpected exception.", 
        code: "CONTACT_API_PIPELINE_ERROR" 
      },
      { status: 500 }
    );
  }
}
