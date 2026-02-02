import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/server-auth';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: {
        _count: {
          select: { menuItems: true, categories: true, inventory: true, suppliers: true, orders: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      subscription: user.subscription || 'Free',
      usage: {
        menuItems: user._count.menuItems,
        categories: user._count.categories,
        inventory: user._count.inventory,
        suppliers: user._count.suppliers,
        orders: user._count.orders
      }
    });
  } catch (error) {
    console.error('Subscription Status Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
