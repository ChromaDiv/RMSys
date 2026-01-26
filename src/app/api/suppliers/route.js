import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const body = await request.json();
  const { data, error } = await supabase
    .from('suppliers')
    .insert([{
      name: body.name,
      type: body.type,
      rating: body.rating,
      status: body.status || 'Active'
    }])
    .select();

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: 'Supplier added', data: data[0] });
}

export async function PUT(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ success: false, error: 'Supplier ID required' });

    const { data, error } = await supabase
      .from('suppliers')
      .update({
        ...updates
      })
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ success: false, error: error.message });
    return NextResponse.json({ success: true, message: 'Supplier updated', data: data[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: 'Supplier deleted' });
}
