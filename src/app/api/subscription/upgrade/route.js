import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/server-auth';

export async function POST() {
  try {
    const session = await getAuthSession();
    if (!session) {
      console.log('Upgrade Error: No session found');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Upgrading user:', session.user.id, typeof session.user.id);

    const userId = parseInt(session.user.id);

    // Update user to Pro
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { subscription: 'Pro' }
    });

    console.log('Upgrade Success:', updatedUser.id, updatedUser.subscription);

    return NextResponse.json({
      success: true,
      message: 'Upgraded to Pro successfully',
      subscription: updatedUser.subscription
    });
  } catch (error) {
    console.error('Upgrade Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
