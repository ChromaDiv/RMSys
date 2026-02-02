import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/server-auth';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const data = orders.map(order => ({
      ...order,
      id: order.id.toString(),
      total: Number(order.total)
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('--- ORDER POST REQUEST ---');
  try {
    const session = await getAuthSession();
    if (!session) {
      console.log('Order POST: Unauthorized');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Order POST Body:', body);

    // Check Subscription Limit
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const isPro = user?.subscription === 'Pro';

    if (!isPro) {
      const count = await prisma.order.count({ where: { userId: session.user.id } });
      if (count >= 5) {
        return NextResponse.json({
          success: false,
          error: 'LIMIT_REACHED',
          message: 'Free plan limit reached (5 orders). Upgrade to Pro to add more.'
        }, { status: 403 });
      }
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        customer: body.customer,
        phone: body.phone || '',
        items: body.items,
        total: Number(body.total),
        status: body.status || "Preparing",
      }
    });
    return NextResponse.json({
      success: true,
      data: {
        ...newOrder,
        id: newOrder.id.toString(),
        total: Number(newOrder.total)
      }
    });
  } catch (error) {
    console.error('Order POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, status } = body;
    await prisma.order.update({
      where: { id: BigInt(id), userId: session.user.id },
      data: { status }
    });
    return NextResponse.json({ success: true, message: 'Status updated' });
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
    await prisma.order.delete({
      where: { id: BigInt(id), userId: session.user.id }
    });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
