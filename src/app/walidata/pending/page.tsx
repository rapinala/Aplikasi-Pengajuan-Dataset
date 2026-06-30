'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatFileSize } from '@/lib/utils'
import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'

export default function PendingDatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/datasets?status=pending')
      .then(res => res.json())
      .then(data => setDatasets(data.datasets || []))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dataset Menunggu Validasi</h1>
        <p className="text-gray-600 mt-1">Review dan validasi dataset yang diajukan</p>
      </div>

      <div className="space-y-4">
        {datasets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Clock className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Tidak ada dataset menunggu validasi</p>
            </CardContent>
          </Card>
        ) : (
          datasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">
                        Diajukan {formatDate(dataset.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {dataset.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {dataset.description}
                    </p>
                    
                    <div className="flex gap-6 text-sm text-gray-500">
                      <span>📎 {dataset.fileName || 'No file'}</span>
                      <span>💾 {formatFileSize(dataset.fileSize)}</span>
                      <span>📂 Kategori #{dataset.categoryId}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Link href={`/walidata/validate/${dataset.id}`}>
                      <Button>
                        <Eye className="h-4 w-4 mr-2" />
                        Review & Validasi
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
