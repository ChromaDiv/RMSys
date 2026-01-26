import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('name', { ascending: true });

  if (error) return NextResponse.json({ success: false, error: error.message });

  // Define category sequence to match "how it was"
  const categoryOrder = [
    'Exciting Deals',
    'Pizza, Sandwiches, & More',
    'Signature Cold Coffee',
    'Signature Hot Coffee',
    'Ice Cream Shakes & Mojito',
    'Hot Coffee',
    'Cold Coffee',
    'Teas & Desserts',
    'Raw Coffee (Beans)'
  ];

  // Transform flat list to hierarchical structure
  const groupedMenu = data.reduce((acc, item) => {
    let category = acc.find(c => c.name === item.category);
    if (!category) {
      category = { id: `cat_${item.category.toLowerCase().replace(/\s+/g, '_')}`, name: item.category, items: [] };
      acc.push(category);
    }
    category.items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      available: item.available
    });
    return acc;
  }, []);

  // Sort groups by the defined sequence
  groupedMenu.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.name);
    const indexB = categoryOrder.indexOf(b.name);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return NextResponse.json({ success: true, data: groupedMenu });
}

export async function POST(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  try {
    const body = await request.json();
    const { type, data } = body; // type: 'category' or 'item'

    if (type === 'item') {
      const { data: newItem, error } = await supabase
        .from('menu')
        .insert([{
          name: data.name,
          price: Number(data.price),
          description: data.description || '',
          category: data.categoryName || 'General' // We'll expect the category name from frontend
        }])
        .select();

      if (error) return NextResponse.json({ success: false, error: error.message });
      return NextResponse.json({ success: true, message: 'Item added', data: newItem[0] });
    }

    // For 'category' type in a flat table, we don't necessarily need a POST unless we strictly want to manage empty categories.
    // However, the frontend might expect a refresh.
    return NextResponse.json({ success: true, message: 'Category structure handled via items' });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'item') {
      const { error } = await supabase
        .from('menu')
        .update({
          name: data.name,
          price: Number(data.price),
          description: data.description || '',
          available: data.available
        })
        .eq('id', data.id);

      if (error) return NextResponse.json({ success: false, error: error.message });
      return NextResponse.json({ success: true, message: 'Item updated' });
    }

    if (type === 'category') {
      const { error } = await supabase
        .from('menu')
        .update({ category: data.newName })
        .eq('category', data.oldName);

      if (error) return NextResponse.json({ success: false, error: error.message });
      return NextResponse.json({ success: true, message: 'Category renamed' });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!supabase) return NextResponse.json({ success: false, error: 'Supabase not configured' });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const categoryName = searchParams.get('categoryName');

  if (type === 'category') {
    const { error } = await supabase
      .from('menu')
      .delete()
      .eq('category', categoryName);

    if (error) return NextResponse.json({ success: false, error: error.message });
  } else if (type === 'item') {
    const { error } = await supabase
      .from('menu')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true, message: 'Deleted successfully' });
}
