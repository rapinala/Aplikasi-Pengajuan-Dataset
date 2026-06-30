import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { datasets, activityLogs, notifications } from '@/db/schema';
import { eq, desc, and, or, ilike, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const instansiId = searchParams.get('instansiId');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    let query = db.select().from(datasets);
    
    const conditions = [];
    if (status) conditions.push(eq(datasets.status, status as any));
    if (instansiId) conditions.push(eq(datasets.instansiId, parseInt(instansiId)));
    if (categoryId) conditions.push(eq(datasets.categoryId, parseInt(categoryId)));
    if (search) {
      conditions.push(
        or(
          ilike(datasets.title, `%${search}%`),
          ilike(datasets.description, `%${search}%`)
        )!
      );
    }

    const results = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(desc(datasets.createdAt))
      : await query.orderBy(desc(datasets.createdAt));

    return NextResponse.json({ datasets: results });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json({ error: 'Failed to fetch datasets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate user authentication - in real app, get from session/JWT
    const currentUserId = body.userId || 1;
    const instansiId = body.instansiId || 1;
    
    const newDataset = await db.insert(datasets).values({
      title: body.title,
      description: body.description,
      concept: body.concept,
      definition: body.definition,
      interpretasi: body.interpretasi,
      metodologi: body.metodologi,
      unitData: body.unitData,
      periodStart: body.periodStart,
      periodEnd: body.periodEnd,
      updateFrequency: body.updateFrequency,
      categoryId: body.categoryId,
      classification: body.classification || 'publik',
      tags: body.tags || [],
      fileName: body.fileName,
      fileSize: body.fileSize,
      fileType: body.fileType,
      fileUrl: body.fileUrl,
      status: body.status || 'draft',
      submittedBy: currentUserId,
      instansiId: instansiId,
      dataDictionary: body.dataDictionary || [],
    }).returning();

    // Log activity
    await db.insert(activityLogs).values({
      userId: currentUserId,
      action: 'create_dataset',
      description: `Membuat dataset baru: ${body.title}`,
      datasetId: newDataset[0].id,
      metadata: { status: body.status || 'draft' },
    });

    return NextResponse.json({ dataset: newDataset[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating dataset:', error);
    return NextResponse.json({ error: 'Failed to create dataset' }, { status: 500 });
  }
}
