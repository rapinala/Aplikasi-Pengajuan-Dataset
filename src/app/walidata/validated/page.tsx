'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatFileSize } from '@/lib/utils'
import { CheckCircle, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ValidatedDatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/datasets?status=validated')
      .then(res => res.json())
      .then(data => setDatasets(data.datasets || []))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dataset Tervalidasi</h1>
        <p className="text-gray-600 mt-1">Dataset yang telah disetujui</p>
      </div>

      <div className="space-y-4">
        {datasets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <CheckCircle className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Belum ada dataset tervalidasi</p>
            </CardContent>
          </Card>
        ) : (
          datasets.map((dataset) => (
            <Card key={dataset.id} className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Divalidasi {formatDate(dataset.validatedAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {dataset.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3">
                      {dataset.description}
                    </p>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>📎 {dataset.fileName}</span>
                      <span>💾 {formatFileSize(dataset.fileSize)}</span>
                      <span>👁️ {dataset.viewCount} views</span>
                    </div>
                  </div>
                  <div className="ml-4 space-y-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" /> Detail
                    </Button>
                    <Button size="sm" variant="success" className="w-full">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
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
