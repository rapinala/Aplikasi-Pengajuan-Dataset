import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { datasets, instansi, dataQualityMetrics } from '@/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const instansiId = searchParams.get('instansiId');
    const role = searchParams.get('role') || 'instansi';

    // Total datasets by status
    const statusCounts = await db.select({
      status: datasets.status,
      count: sql<number>`count(*)::int`,
    })
    .from(datasets)
    .where(instansiId ? eq(datasets.instansiId, parseInt(instansiId)) : undefined)
    .groupBy(datasets.status);

    // Monthly submission trend (last 6 months)
    const monthlyTrend = await db.select({
      month: sql<string>`TO_CHAR(created_at, 'Mon YYYY')`,
      count: sql<number>`count(*)::int`,
    })
    .from(datasets)
    .where(
      and(
        instansiId ? eq(datasets.instansiId, parseInt(instansiId)) : undefined,
        gte(datasets.createdAt, sql`NOW() - INTERVAL '6 months'`)
      )
    )
    .groupBy(sql`TO_CHAR(created_at, 'Mon YYYY')`);

    // Category distribution
    const categoryDistribution = await db.select({
      categoryId: datasets.categoryId,
      count: sql<number>`count(*)::int`,
    })
    .from(datasets)
    .where(
      and(
        instansiId ? eq(datasets.instansiId, parseInt(instansiId)) : undefined,
        eq(datasets.status, 'published')
      )
    )
    .groupBy(datasets.categoryId);

    // Quality metrics average
    const qualityAvg = await db.select({
      avgCompleteness: sql<number>`AVG(completeness_score)::int`,
      avgAccuracy: sql<number>`AVG(accuracy_score)::int`,
      avgTimeliness: sql<number>`AVG(timeliness_score)::int`,
      avgConsistency: sql<number>`AVG(consistency_score)::int`,
      avgOverall: sql<number>`AVG(overall_score)::int`,
    })
    .from(dataQualityMetrics);

    // Top performers (if walidata/admin)
    let topPerformers: Array<{ instansiId: number | null; count: number }> = [];
    if (role === 'walidata' || role === 'admin') {
      topPerformers = await db.select({
        instansiId: datasets.instansiId,
        count: sql<number>`count(*)::int`,
      })
      .from(datasets)
      .where(eq(datasets.status, 'published'))
      .groupBy(datasets.instansiId)
      .orderBy(sql`count(*) DESC`)
      .limit(5);
    }

    return NextResponse.json({
      statusCounts,
      monthlyTrend,
      categoryDistribution,
      qualityMetrics: qualityAvg[0] || {},
      topPerformers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
