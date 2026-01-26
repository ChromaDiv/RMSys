import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message });

  // Add human-readable time from created_at
  const formattedData = data.map(order => {
    const date = new Date(order.created_at);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);

    let timeLabel = 'Just now';
    if (diffMin > 0 && diffMin < 60) timeLabel = `${diffMin} mins ago`;
    else if (diffMin >= 60) timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      ...order,
      time: timeLabel
    };
  });

  return NextResponse.json({ success: true, data: formattedData });
}

export async function POST(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const body = await request.json();
  // Supabase expects an object or array. id is auto-generated.
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer: body.customer,
      phone: body.phone,
      items: body.items, // JSONB
      total: body.total,
      status: body.status || 'Preparing'
    }])
    .select();

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: 'Order added', data: data[0] });
}

export async function PUT(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const body = await request.json();
  const { error } = await supabase
    .from('orders')
    .update({ status: body.status, updated_at: new Date() })
    .eq('id', body.id);

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: 'Order updated' });
}

export async function DELETE(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: 'Order deleted' });
}
