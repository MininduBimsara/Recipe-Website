import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
});

export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
  }

  try {
    const body = await req.json();
    const result = unsubscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message, code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    const { email } = result.data;

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', email);

      // Return success even if email wasn't found — prevents email enumeration
      if (error) {
        console.error('[Unsubscribe] DB error:', error.code);
      }
    }

    console.info(`[Newsletter] Unsubscribe processed. Timestamp: ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Unsubscribe failed. Please try again.', code: 'UNSUBSCRIBE_FAILED' },
      { status: 500 }
    );
  }
}
