import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
// Simple in-memory rate limiter (sliding window)
const ipRateLimits = new Map<string, { timestamps: number[] }>();

function isRateLimited(ip: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip) || { timestamps: [] };
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);
  if (record.timestamps.length >= maxRequests) {
    ipRateLimits.set(ip, record);
    return true;
  }
  record.timestamps.push(now);
  ipRateLimits.set(ip, record);
  return false;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Strip characters that could break out of the prompt context */
function sanitizeQuery(input: string): string {
  return input
    .slice(0, 100) // max 100 characters
    .replace(/[<>"'`{}\\]/g, '') // remove injection chars
    .trim() || 'culinary inspiration';
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  // Max 5 AI requests per minute per IP to prevent quota drain
  if (isRateLimited(ip, 60_000, 5)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.', suggestions: [] },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get('q') || 'culinary inspiration';
  const query = sanitizeQuery(rawQuery);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      error: 'AI suggestions are not configured.',
      code: 'GEMINI_API_KEY_MISSING',
      suggestions: []
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a gourmet culinary consultant and recipe engineer.
A user searched for: "${query}" on a recipe site but found no matches.
Propose 3 creative, specific recipe ideas that match or elevate the searched terms.
Return ONLY a valid JSON array of 3 objects, each with exactly these keys:
- "title": a descriptive recipe name
- "description": a professional culinary outline (max 2 sentences)
- "prepTime": a realistic time (e.g., "30 mins")
- "difficulty": "Easy", "Medium", or "Hard"
Start with [ and end with ]. No markdown, no code blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '[]';
    const trimmed = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const suggestions = JSON.parse(trimmed);

    return NextResponse.json({ success: true, suggestions });
  } catch (error: any) {
    console.error('Gemini suggest-recipes error:', error?.message || error);
    return NextResponse.json({
      error: 'Unable to generate suggestions at this time.',
      code: 'SUGGEST_RECIPES_API_EXCEPTION',
      suggestions: []
    }, { status: 500 });
  }
}

