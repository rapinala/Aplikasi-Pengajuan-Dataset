'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CheckCircle, XCircle, Database, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function WalidataPage() {
  const [stats, setStats] = useState<any>(null)
  const [pendingDatasets, setPendingDatasets] = useState<any[]>([])

  useEffect(() => {
    // Fetch stats
    fetch('/api/stats?role=walidata')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))

    // Fetch pending datasets
    fetch('/api/datasets?status=pending')
      .then(res => res.json())
      .then(data => setPendingDatasets(data.datasets?.slice(0, 5) || []))
      .catch(err => console.error(err))
  }, [])

  const getStatusCount = (status: string) => {
    return stats?.statusCounts?.find((s: any) => s.status === status)?.count || 0
  }

  const statCards = [
    {
      title: 'Menunggu Validasi',
      value: getStatusCount('pending'),
      icon: Clock,
      color: 'bg-yellow-500',
      href: '/walidata/pending',
    },
    {
      title: 'Tervalidasi',
      value: getStatusCount('validated'),
      icon: CheckCircle,
      color: 'bg-green-500',
      href: '/walidata/validated',
    },
    {
      title: 'Total Dataset',
      value: stats?.statusCounts?.reduce((acc: number, s: any) => acc + s.count, 0) || 0,
      icon: Database,
      color: 'bg-blue-500',
      href: '/walidata/all-datasets',
    },
    {
      title: 'Kualitas Rata-rata',
      value: `${stats?.qualityMetrics?.avgOverall || 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      href: '/walidata/analytics',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Walidata</h1>
        <p className="text-gray-600 mt-1">Kelola validasi dan kualitas dataset</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Priority Actions */}
      <Card className="mb-8 border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Perlu Perhatian: Dataset Menunggu Validasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingDatasets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              ✓ Semua dataset sudah divalidasi
            </p>
          ) : (
            <div className="space-y-3">
              {pendingDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{dataset.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Diajukan: {new Date(dataset.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Link href={`/walidata/validate/${dataset.id}`}>
                      <Button size="sm">Validasi Sekarang</Button>
                    </Link>
                  </div>
                </div>
              ))}
              <Link href="/walidata/pending">
                <Button variant="outline" className="w-full mt-2">
                  Lihat Semua ({getStatusCount('pending')})
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Metrik Kualitas Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Kelengkapan', value: stats?.qualityMetrics?.avgCompleteness || 0 },
                { label: 'Akurasi', value: stats?.qualityMetrics?.avgAccuracy || 0 },
                { label: 'Ketepatan Waktu', value: stats?.qualityMetrics?.avgTimeliness || 0 },
                { label: 'Konsistensi', value: stats?.qualityMetrics?.avgConsistency || 0 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{metric.label}</span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Kontributor Instansi</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topPerformers?.length > 0 ? (
              <div className="space-y-3">
                {stats.topPerformers.map((perf: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {idx + 1}
                      </div>
                      <span className="text-sm">Instansi #{perf.instansiId}</span>
                    </div>
                    <span className="text-sm font-medium">{perf.count} dataset</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
