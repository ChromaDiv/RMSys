import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // 1. Fetch Categories
    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' }
    });

    // 2. Fetch Menu Items
    const items = await prisma.menu.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' },
    });

    // 3. Define category sequence (Global defaults if category name matches)
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

    // 4. Build hierarchical structure starting from Categories
    const groupedMenu = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      items: items
        .filter(item => item.category === cat.name)
        .map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          description: item.description,
          available: item.available
        }))
    }));

    // 5. Add any "unclaimed" categories (items that have a category name not in our Categories table)
    // This handles legacy data or items added before we had the Categories table
    const categoryNames = categories.map(c => c.name);
    items.forEach(item => {
      if (!categoryNames.includes(item.category)) {
        let existing = groupedMenu.find(c => c.name === item.category);
        if (!existing) {
          existing = {
            id: `cat_legacy_${item.category.toLowerCase().replace(/\s+/g, '_')}`,
            name: item.category,
            items: []
          };
          groupedMenu.push(existing);
          categoryNames.push(item.category);
        }
        existing.items.push({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          description: item.description,
          available: item.available
        });
      }
    });

    // 6. Sort groups
    groupedMenu.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.name);
      const indexB = categoryOrder.indexOf(b.name);
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return NextResponse.json({ success: true, data: groupedMenu });
  } catch (error) {
    console.error('Menu GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('--- MENU POST REQUEST ---');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in POST:', JSON.stringify(session, null, 2));

    if (!session) {
      console.log('Menu POST: Unauthorized - No Session');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Menu POST Body:', body);
    const { type, data } = body;

    if (type === 'item') {
      console.log('Creating Item with userId:', session.user.id);
      const newItem = await prisma.menu.create({
        data: {
          userId: session.user.id,
          name: data.name,
          price: Number(data.price),
          description: data.description || '',
          category: data.categoryName || 'General',
        }
      });
      console.log('Item created:', newItem);
      return NextResponse.json({ success: true, message: 'Item added', data: newItem });
    }

    if (type === 'category') {
      console.log('Creating Category:', data.newName, 'for user:', session.user.id);

      // Validation
      if (!data.newName || data.newName.trim() === '') {
        console.log('Category name missing');
        return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
      }

      const newCategory = await prisma.category.create({
        data: {
          userId: session.user.id,
          name: data.newName,
        }
      });
      console.log('Category created:', newCategory);
      return NextResponse.json({ success: true, message: 'Category added', data: newCategory });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('MENU POST ERROR DETAILS:', error);
    return NextResponse.json({ success: false, message: error.message, details: error.toString() }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { type, data } = body;

    if (type === 'item') {
      await prisma.menu.update({
        where: { id: data.id, userId: session.user.id },
        data: {
          name: data.name,
          price: Number(data.price),
          description: data.description || '',
          available: data.available
        }
      });

      return NextResponse.json({ success: true, message: 'Item updated' });
    }

    if (type === 'category') {
      // 1. Update the Category record
      await prisma.category.update({
        where: { id: data.id, userId: session.user.id },
        data: { name: data.newName }
      });

      // 2. Transitionally update items that were in this category
      await prisma.menu.updateMany({
        where: { category: data.oldName, userId: session.user.id },
        data: { category: data.newName }
      });

      return NextResponse.json({ success: true, message: 'Category renamed' });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const categoryName = searchParams.get('categoryName');

    if (type === 'category') {
      // 1. Delete items in this category
      await prisma.menu.deleteMany({
        where: { category: categoryName, userId: session.user.id }
      });
      // 2. Delete the category record itself
      await prisma.category.deleteMany({
        where: { name: categoryName, userId: session.user.id }
      });
    } else if (type === 'item') {
      await prisma.menu.delete({
        where: { id: parseInt(id), userId: session.user.id }
      });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


