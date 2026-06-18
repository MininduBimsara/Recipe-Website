import { NextRequest, NextResponse } from 'next/server';
import { ratingsStore } from '@/lib/ratings';

// --- Simple in-memory rate limiter (sliding window) ---
// For production, replace with Upstash Redis + @upstash/ratelimit
const ipRateLimits = new Map<string, { timestamps: number[] }>();

function isRateLimited(ip: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now();
  const key = ip;
  const record = ipRateLimits.get(key) || { timestamps: [] };

  // Remove timestamps outside the window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    ipRateLimits.set(key, record);
    return true;
  }

  record.timestamps.push(now);
  ipRateLimits.set(key, record);
  return false;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

const SLUG_MAX_LEN = 120;

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  // 10 GET requests per minute per IP
  if (isRateLimited(`get:${ip}`, 60_000, 10)) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  try {
    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug || slug.length > SLUG_MAX_LEN || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({
        error: 'Missing or invalid recipe slug',
        code: 'INVALID_SLUG',
      }, { status: 400 });
    }

    const recipeRating = ratingsStore[slug] || null;
    if (!recipeRating) {
      return NextResponse.json({ success: true, average: 0, count: 0 });
    }

    const average = recipeRating.count > 0
      ? Number((recipeRating.sum / recipeRating.count).toFixed(1))
      : 0;

    return NextResponse.json({ success: true, average, count: recipeRating.count });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch rating.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
  }

  const ip = getClientIp(req);
  // 3 ratings per minute per IP — prevents spam voting
  if (isRateLimited(`post:${ip}`, 60_000, 3)) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { slug, rating } = body;

    if (
      !slug ||
      typeof slug !== 'string' ||
      slug.length > SLUG_MAX_LEN ||
      !/^[a-z0-9-]+$/.test(slug) ||
      typeof rating !== 'number' ||
      rating < 1 ||
      rating > 5 ||
      !Number.isInteger(rating)
    ) {
      return NextResponse.json({
        error: 'Invalid rating parameters',
        code: 'INVALID_RATING_PARAMETERS',
      }, { status: 400 });
    }

    if (!ratingsStore[slug]) {
      ratingsStore[slug] = { count: 0, sum: 0 };
    }

    ratingsStore[slug].count += 1;
    ratingsStore[slug].sum += rating;

    const average = Number((ratingsStore[slug].sum / ratingsStore[slug].count).toFixed(1));

    return NextResponse.json({
      success: true,
      average,
      count: ratingsStore[slug].count,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to submit rating.' }, { status: 500 });
  }
}
