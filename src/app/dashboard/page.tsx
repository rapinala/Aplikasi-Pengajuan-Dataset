'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Clock, CheckCircle, XCircle, TrendingUp, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentDatasets, setRecentDatasets] = useState<any[]>([])
  const mockInstansiId = 1

  useEffect(() => {
    // Fetch stats
    fetch(`/api/stats?instansiId=${mockInstansiId}&role=instansi`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))

    // Fetch recent datasets
    fetch(`/api/datasets?instansiId=${mockInstansiId}`)
      .then(res => res.json())
      .then(data => setRecentDatasets(data.datasets?.slice(0, 5) || []))
      .catch(err => console.error(err))
  }, [])

  const getStatusCount = (status: string) => {
    return stats?.statusCounts?.find((s: any) => s.status === status)?.count || 0
  }

  const statCards = [
    {
      title: 'Total Dataset',
      value: stats?.statusCounts?.reduce((acc: number, s: any) => acc + s.count, 0) || 0,
      icon: Database,
      color: 'bg-blue-500',
    },
    {
      title: 'Menunggu Validasi',
      value: getStatusCount('pending'),
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Tervalidasi',
      value: getStatusCount('validated'),
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Draft',
      value: getStatusCount('draft'),
      icon: FileText,
      color: 'bg-gray-500',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Instansi</h1>
        <p className="text-gray-600 mt-1">Selamat datang di Portal Pengajuan Dataset</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
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
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/upload">
              <Button className="w-full h-20 text-lg">
                📤 Upload Dataset Baru
              </Button>
            </Link>
            <Link href="/dashboard/drafts">
              <Button variant="outline" className="w-full h-20 text-lg">
                📝 Lihat Draft
              </Button>
            </Link>
            <Link href="/dashboard/discussions">
              <Button variant="outline" className="w-full h-20 text-lg">
                💬 Forum Walidata
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Datasets */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Dataset Terbaru</CardTitle>
            <Link href="/dashboard/my-datasets">
              <Button variant="ghost" size="sm">Lihat Semua →</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentDatasets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Belum ada dataset</p>
              <Link href="/dashboard/upload">
                <Button className="mt-4">Upload Dataset Pertama</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{dataset.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {dataset.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>📅 {new Date(dataset.createdAt).toLocaleDateString('id-ID')}</span>
                        {dataset.fileName && <span>📎 {dataset.fileName}</span>}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          dataset.status === 'validated'
                            ? 'bg-green-100 text-green-800'
                            : dataset.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : dataset.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {dataset.status === 'validated'
                          ? 'Tervalidasi'
                          : dataset.status === 'pending'
                          ? 'Pending'
                          : dataset.status === 'rejected'
                          ? 'Ditolak'
                          : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
