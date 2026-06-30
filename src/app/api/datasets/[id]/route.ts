import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { datasets, activityLogs, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dataset = await db.select().from(datasets).where(eq(datasets.id, parseInt(id)));
    
    if (dataset.length === 0) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    // Increment view count
    await db.update(datasets)
      .set({ viewCount: (dataset[0].viewCount || 0) + 1 })
      .where(eq(datasets.id, parseInt(id)));

    return NextResponse.json({ dataset: dataset[0] });
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return NextResponse.json({ error: 'Failed to fetch dataset' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const currentUserId = body.userId || 1;
    
    const updated = await db.update(datasets)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(datasets.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    // Log activity
    await db.insert(activityLogs).values({
      userId: currentUserId,
      action: 'update_dataset',
      description: `Memperbarui dataset: ${updated[0].title}`,
      datasetId: parseInt(id),
      metadata: body,
    });

    return NextResponse.json({ dataset: updated[0] });
  } catch (error) {
    console.error('Error updating dataset:', error);
    return NextResponse.json({ error: 'Failed to update dataset' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(datasets).where(eq(datasets.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dataset:', error);
    return NextResponse.json({ error: 'Failed to delete dataset' }, { status: 500 });
  }
}
