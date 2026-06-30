'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate, formatFileSize } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Search, Eye, Download } from 'lucide-react'
import Link from 'next/link'

export default function MyDatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const mockInstansiId = 1

  useEffect(() => {
    fetch(`/api/datasets?instansiId=${mockInstansiId}`)
      .then(res => res.json())
      .then(data => setDatasets(data.datasets || []))
      .catch(err => console.error(err))
  }, [])

  const filteredDatasets = datasets.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || d.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dataset Saya</h1>
        <p className="text-gray-600 mt-1">Kelola semua dataset yang telah Anda ajukan</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari dataset..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="validated">Tervalidasi</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Datasets List */}
      <div className="space-y-4">
        {filteredDatasets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              Tidak ada dataset ditemukan
            </CardContent>
          </Card>
        ) : (
          filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {dataset.title}
                      </h3>
                      <StatusBadge status={dataset.status} />
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {dataset.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Dibuat:</span>
                    <p className="font-medium">{formatDate(dataset.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">File:</span>
                    <p className="font-medium">{dataset.fileName || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ukuran:</span>
                    <p className="font-medium">{formatFileSize(dataset.fileSize)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Dilihat:</span>
                    <p className="font-medium">{dataset.viewCount || 0}x</p>
                  </div>
                </div>

                {dataset.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-800">
                      <strong>Alasan Ditolak:</strong> {dataset.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/datasets/${dataset.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" /> Lihat Detail
                  </Link>
                  {dataset.status === 'validated' && (
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                      <Download className="h-4 w-4" /> Download
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
