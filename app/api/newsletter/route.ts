import { NextRequest, NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address', code: 'INVALID_EMAIL_ADDRESS' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        // If it's a conflict/duplicate, just return success to maintain safe UX
        if (error.code === '23505') {
          return NextResponse.json({
            success: true,
            message: 'You are already subscribed to Savory Kitchen!',
          });
        }
        throw new Error(error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription logged in global editorial pool!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Newsletter subscription failed', code: 'NEWSLETTER_SUBSCRIPTION_FAILED' }, { status: 500 });
  }
}
