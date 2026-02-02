import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/server-auth';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const suppliers = await prisma.supplier.findMany({
      where: { userId: session.user.id }
    });

    const data = suppliers.map(s => ({
      ...s,
      rating: Number(s.rating)
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Suppliers GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    // Check Subscription Limit
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const isPro = user?.subscription === 'Pro';

    if (!isPro) {
      const count = await prisma.supplier.count({ where: { userId: session.user.id } });
      if (count >= 5) {
        return NextResponse.json({
          success: false,
          error: 'LIMIT_REACHED',
          message: 'Free plan limit reached (5 suppliers). Upgrade to Pro to add more.'
        }, { status: 403 });
      }
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        userId: session.user.id,
        name: body.name,
        type: body.type,
        rating: Number(body.rating || 5.0),
        status: body.status || 'Active'
      }
    });
    return NextResponse.json({
      success: true,
      data: {
        ...newSupplier,
        rating: Number(newSupplier.rating)
      }
    });
  } catch (error) {
    console.error('Supplier POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, ...data } = body;
    await prisma.supplier.update({
      where: { id: parseInt(id), userId: session.user.id },
      data
    });
    return NextResponse.json({ success: true, message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.supplier.delete({
      where: { id: parseInt(id), userId: session.user.id }
    });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
