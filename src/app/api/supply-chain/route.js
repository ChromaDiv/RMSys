import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const data = await prisma.inventory.findMany({
      where: { userId: session.user.id }
    });
    // Add critical/low status dynamically based on quantity
    const enrichedData = data.map(item => ({
      ...item,
      status: Number(item.quantity) < 10 ? 'Critical' : (Number(item.quantity) < 20 ? 'Low' : 'Good'),
      quantity: Number(item.quantity)
    }));
    return NextResponse.json({ success: true, data: enrichedData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const newItem = await prisma.inventory.create({
      data: {
        userId: session.user.id,
        item: body.item,
        quantity: Number(body.quantity),
        unit: body.unit,
        supplier: body.supplier || 'Unknown',
        status: body.status || 'Good'
      }
    });
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, ...data } = body;

    // Handle numeric conversion
    const updateData = {};
    if (data.quantity !== undefined) updateData.quantity = Number(data.quantity);
    if (data.item !== undefined) updateData.item = data.item;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.supplier !== undefined) updateData.supplier = data.supplier;
    if (data.status !== undefined) updateData.status = data.status;

    await prisma.inventory.update({
      where: { id: parseInt(id), userId: session.user.id },
      data: updateData
    });
    return NextResponse.json({ success: true, message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.inventory.delete({
      where: { id: parseInt(id), userId: session.user.id }
    });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
