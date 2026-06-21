import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
});

export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
  }

  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message, code: 'INVALID_EMAIL_ADDRESS' },
        { status: 400 }
      );
    }

    const { email } = result.data;

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        // If it's a conflict/duplicate, return success to avoid email enumeration
        if (error.code === '23505') {
          return NextResponse.json({
            success: true,
            message: 'You are already subscribed to PebblePlate!',
          });
        }
        // Log error server-side only, return generic message to client
        console.error('[Newsletter] Supabase insert error:', error.code);
        return NextResponse.json(
          { error: 'Subscription failed. Please try again.', code: 'SUBSCRIPTION_FAILED' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to PebblePlate!',
    });
  } catch {
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.', code: 'SUBSCRIPTION_FAILED' },
      { status: 500 }
    );
  }
}
