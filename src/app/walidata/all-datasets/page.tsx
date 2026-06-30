'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Search, Database } from 'lucide-react'

export default function AllDatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/datasets')
      .then(res => res.json())
      .then(data => setDatasets(data.datasets || []))
      .catch(err => console.error(err))
  }, [])

  const filteredDatasets = datasets.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Semua Dataset</h1>
        <p className="text-gray-600 mt-1">Kelola semua dataset dari semua instansi</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari dataset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredDatasets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Database className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Tidak ada dataset ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          filteredDatasets.map((dataset) => (
            <Card key={dataset.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-1">{dataset.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                    <p className="text-xs text-gray-500">Diajukan {formatDate(dataset.createdAt)}</p>
                  </div>
                  <StatusBadge status={dataset.status} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
