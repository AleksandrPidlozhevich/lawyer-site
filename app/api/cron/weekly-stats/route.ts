import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {

    const { count: totalCallbacks, error: countError } = await supabase
      .from('callbacks')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;

    const { count: pendingCallbacks } = await supabase
      .from('callbacks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const now = new Date();

    const { error: insertError } = await supabase
      .from('weekly_stats')
      .insert({
        year: now.getFullYear(),
        week_number: getWeekNumber(now),
        data: {
          total_callbacks: totalCallbacks || 0,
          pending_callbacks: pendingCallbacks || 0,
          timestamp: now.toISOString(),
        }
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, message: 'Stats recorded successfully' });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}