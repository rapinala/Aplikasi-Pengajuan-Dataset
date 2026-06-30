'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Award, AlertCircle } from 'lucide-react'
import { DATA_CATEGORIES } from '@/lib/constants'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/stats?role=walidata')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))
  }, [])

  const getCategoryName = (id: number | null) => {
    return DATA_CATEGORIES.find(c => c.id === id)?.name || 'Lainnya'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analitik & Rekomendasi Data</h1>
        <p className="text-gray-600 mt-1">Dashboard untuk mendukung perencanaan pembangunan berbasis data</p>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Kelengkapan', 
            value: stats?.qualityMetrics?.avgCompleteness || 0,
            icon: Award,
            color: 'blue'
          },
          { 
            label: 'Akurasi', 
            value: stats?.qualityMetrics?.avgAccuracy || 0,
            icon: TrendingUp,
            color: 'green'
          },
          { 
            label: 'Ketepatan Waktu', 
            value: stats?.qualityMetrics?.avgTimeliness || 0,
            icon: BarChart3,
            color: 'purple'
          },
          { 
            label: 'Konsistensi', 
            value: stats?.qualityMetrics?.avgConsistency || 0,
            icon: AlertCircle,
            color: 'orange'
          },
        ].map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <Icon className={`h-5 w-5 text-${metric.color}-600`} />
                </div>
                <p className="text-3xl font-bold mb-2">{metric.value}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${metric.color}-600 h-2 rounded-full`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Pengajuan */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Pengajuan Dataset (6 Bulan Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.monthlyTrend?.map((trend: any) => (
                <div key={trend.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{trend.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(trend.count * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{trend.count}</span>
                  </div>
                </div>
              ))}
              {(!stats?.monthlyTrend || stats.monthlyTrend.length === 0) && (
                <p className="text-center text-gray-500 py-4">Belum ada data trend</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distribusi Kategori */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Dataset per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.categoryDistribution
                ?.sort((a: any, b: any) => b.count - a.count)
                .map((cat: any) => (
                  <div key={cat.categoryId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {getCategoryName(cat.categoryId)}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(cat.count * 10, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{cat.count}</span>
                    </div>
                  </div>
                ))}
              {(!stats?.categoryDistribution || stats.categoryDistribution.length === 0) && (
                <p className="text-center text-gray-500 py-4">Belum ada dataset terpublikasi</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rekomendasi untuk Pimpinan */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <CardTitle className="text-blue-900">
            💡 Rekomendasi Kebijakan Berbasis Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Kualitas Data Keseluruhan</h4>
              <p className="text-sm text-blue-800">
                Skor kualitas rata-rata: <strong>{stats?.qualityMetrics?.avgOverall || 0}%</strong>
                {stats?.qualityMetrics?.avgOverall >= 80 && (
                  <span className="ml-2">✓ Data berkualitas tinggi, dapat diandalkan untuk pengambilan keputusan strategis</span>
                )}
                {stats?.qualityMetrics?.avgOverall < 80 && stats?.qualityMetrics?.avgOverall >= 60 && (
                  <span className="ml-2">⚠ Perlu peningkatan kualitas data untuk keputusan yang lebih akurat</span>
                )}
                {stats?.qualityMetrics?.avgOverall < 60 && (
                  <span className="ml-2">❌ Kualitas data perlu ditingkatkan signifikan</span>
                )}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Area dengan Data Terlengkap</h4>
              <p className="text-sm text-green-800">
                {stats?.categoryDistribution?.[0] ? (
                  <>
                    Kategori <strong>{getCategoryName(stats.categoryDistribution[0].categoryId)}</strong> memiliki 
                    dataset terbanyak ({stats.categoryDistribution[0].count} dataset). 
                    Area ini siap untuk analisis mendalam dan perencanaan berbasis bukti.
                  </>
                ) : (
                  'Belum ada data untuk rekomendasi'
                )}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Area yang Perlu Perhatian</h4>
              <p className="text-sm text-yellow-800">
                {stats?.categoryDistribution?.length > 0 ? (
                  <>
                    Kategori dengan data terbatas perlu mendapat prioritas pengumpulan data 
                    untuk mendukung perencanaan yang lebih komprehensif.
                  </>
                ) : (
                  'Tingkatkan pengumpulan data di semua sektor untuk mendukung perencanaan pembangunan'
                )}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Kolaborasi Antar-Instansi</h4>
              <p className="text-sm text-purple-800">
                {stats?.topPerformers?.length > 0 ? (
                  <>
                    Ada {stats.topPerformers.length} instansi aktif berkontribusi. 
                    Tingkatkan kolaborasi dengan instansi lain untuk memperkaya ekosistem data daerah.
                  </>
                ) : (
                  'Dorong lebih banyak instansi untuk berkontribusi dalam pengajuan dataset'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Dataset Tervalidasi</h3>
            <p className="text-4xl font-bold">
              {stats?.statusCounts?.find((s: any) => s.status === 'validated')?.count || 0}
            </p>
            <p className="text-sm opacity-90 mt-2">Siap digunakan untuk analisis</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Rata-rata Kualitas</h3>
            <p className="text-4xl font-bold">{stats?.qualityMetrics?.avgOverall || 0}%</p>
            <p className="text-sm opacity-90 mt-2">Skor kualitas keseluruhan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Instansi Kontributor</h3>
            <p className="text-4xl font-bold">{stats?.topPerformers?.length || 0}</p>
            <p className="text-sm opacity-90 mt-2">Aktif berkontribusi</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
