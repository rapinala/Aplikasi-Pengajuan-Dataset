import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { discussions, notifications, datasets } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const datasetId = searchParams.get('datasetId');

    if (!datasetId) {
      return NextResponse.json({ error: 'datasetId is required' }, { status: 400 });
    }

    const results = await db.select()
      .from(discussions)
      .where(eq(discussions.datasetId, parseInt(datasetId)))
      .orderBy(discussions.createdAt);

    return NextResponse.json({ discussions: results });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentUserId = body.userId || 1;
    
    const newDiscussion = await db.insert(discussions).values({
      datasetId: body.datasetId,
      userId: currentUserId,
      message: body.message,
      isInternal: body.isInternal || false,
      parentId: body.parentId || null,
    }).returning();

    // Get dataset info for notification
    const dataset = await db.select().from(datasets).where(eq(datasets.id, body.datasetId));
    
    if (dataset.length > 0) {
      // Notify dataset owner
      await db.insert(notifications).values({
        userId: dataset[0].submittedBy,
        type: 'comment',
        title: 'Komentar Baru pada Dataset',
        message: `Ada komentar baru pada dataset "${dataset[0].title}"`,
        datasetId: body.datasetId,
      });
    }

    return NextResponse.json({ discussion: newDiscussion[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}
