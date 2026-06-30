import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { datasets, activityLogs, notifications, dataQualityMetrics } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason, qualityScores, userId } = body;
    const currentUserId = userId || 1;
    
    const dataset = await db.select().from(datasets).where(eq(datasets.id, parseInt(id)));
    
    if (dataset.length === 0) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    let newStatus: 'validated' | 'rejected' = action === 'validate' ? 'validated' : 'rejected';
    
    const updated = await db.update(datasets)
      .set({
        status: newStatus,
        validatedBy: currentUserId,
        validatedAt: new Date(),
        rejectionReason: action === 'reject' ? reason : null,
        updatedAt: new Date(),
      })
      .where(eq(datasets.id, parseInt(id)))
      .returning();

    // Create notification for submitter
    await db.insert(notifications).values({
      userId: dataset[0].submittedBy,
      type: action === 'validate' ? 'validation' : 'rejection',
      title: action === 'validate' ? 'Dataset Divalidasi' : 'Dataset Ditolak',
      message: action === 'validate' 
        ? `Dataset "${dataset[0].title}" telah divalidasi oleh Walidata`
        : `Dataset "${dataset[0].title}" ditolak: ${reason}`,
      datasetId: parseInt(id),
    });

    // Log activity
    await db.insert(activityLogs).values({
      userId: currentUserId,
      action: action === 'validate' ? 'validate_dataset' : 'reject_dataset',
      description: `${action === 'validate' ? 'Memvalidasi' : 'Menolak'} dataset: ${dataset[0].title}`,
      datasetId: parseInt(id),
      metadata: { reason, action },
    });

    // If validated, save quality scores
    if (action === 'validate' && qualityScores) {
      const overall = Math.round(
        (qualityScores.completeness + qualityScores.accuracy + 
         qualityScores.timeliness + qualityScores.consistency) / 4
      );
      
      await db.insert(dataQualityMetrics).values({
        datasetId: parseInt(id),
        completenessScore: qualityScores.completeness,
        accuracyScore: qualityScores.accuracy,
        timelinessScore: qualityScores.timeliness,
        consistencyScore: qualityScores.consistency,
        overallScore: overall,
        assessedBy: currentUserId,
        notes: qualityScores.notes,
      });
    }

    return NextResponse.json({ dataset: updated[0] });
  } catch (error) {
    console.error('Error validating dataset:', error);
    return NextResponse.json({ error: 'Failed to validate dataset' }, { status: 500 });
  }
}
