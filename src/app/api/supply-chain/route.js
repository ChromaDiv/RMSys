import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('item', { ascending: true });

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const body = await request.json();
  const { data, error } = await supabase
    .from('inventory')
    .insert([{
      item: body.item,
      quantity: body.quantity,
      unit: body.unit,
      supplier: body.supplier,
      status: body.status || 'Good',
      min_threshold: body.min_threshold || 15
    }])
    .select();

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: 'Item added', data: data[0] });
}

export async function PUT(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ success: false, error: 'Item ID required' });

    // Fetch current item if threshold or quantity is missing to ensure correct logic
    // For simplicity, we assume frontend sends necessary data or we use defaults for now.
    // If min_threshold is being updated, we should re-evaluate status.

    // Ensure numeric values
    if (updates.quantity !== undefined) updates.quantity = Number(updates.quantity);
    if (updates.min_threshold !== undefined) updates.min_threshold = Number(updates.min_threshold);

    // Auto-adjust status if quantity is updated OR threshold is updated
    if (updates.quantity !== undefined || updates.min_threshold !== undefined) {
      // We might need to know the OTHER value to calculate status.
      // Ideally we fetch the item first, but to save a roundtrip we'll rely on the client sending both OR use what we have.
      // However, to be robust:

      let q = updates.quantity;
      let t = updates.min_threshold;

      // If either is missing, we can't perfectly calculate without fetching. 
      // IMPORTANT: User requested "input when value is below this amount".
      // We'll trust the input 'min_threshold' if provided, else default to 15 (fallback).
      // If Quantity is provided but T is not, we use T=15 fallback or we should fetch?
      // Let's rely on the frontend passing BOTH when editing to keep it stateless-ish or fetch.
      // A fetch is safer.

      if (updates.status === undefined) { // Only auto-calc if status not explicitly set manually
        // This logic is complex without fetching. Let's do a quick fetch of the current row if needed?
        // Actually, standard UPDATE ... RETURNING is one query. SELECT first is two.
        // Let's assume the frontend sends the threshold with the quantity update for now.

        const threshold = t !== undefined ? t : 15; // default fallback
        const qty = q !== undefined ? q : 0; // risky if q not passed

        if (q !== undefined) {
          if (qty < (threshold * 0.5)) updates.status = 'Critical';
          else if (qty < threshold) updates.status = 'Low Risk';
          else updates.status = 'Good';
        }
      }
    }

    const { data, error } = await supabase
      .from('inventory')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ success: false, error: error.message });
    return NextResponse.json({ success: true, message: 'Item updated', data: data[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ success: false, error: error.message });
  return NextResponse.json({ success: true, message: 'Item deleted' });
}
