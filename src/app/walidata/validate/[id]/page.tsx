'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatFileSize } from '@/lib/utils'
import { CheckCircle, XCircle, MessageSquare, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ValidateDatasetPage() {
  const params = useParams()
  const router = useRouter()
  const [dataset, setDataset] = useState<any>(null)
  const [discussions, setDiscussions] = useState<any[]>([])
  const [comment, setComment] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showQualityForm, setShowQualityForm] = useState(false)
  const [qualityScores, setQualityScores] = useState({
    completeness: 85,
    accuracy: 85,
    timeliness: 85,
    consistency: 85,
    notes: '',
  })

  useEffect(() => {
    if (params.id) {
      // Fetch dataset
      fetch(`/api/datasets/${params.id}`)
        .then(res => res.json())
        .then(data => setDataset(data.dataset))
        .catch(err => console.error(err))

      // Fetch discussions
      fetch(`/api/discussions?datasetId=${params.id}`)
        .then(res => res.json())
        .then(data => setDiscussions(data.discussions || []))
        .catch(err => console.error(err))
    }
  }, [params.id])

  const handleValidate = async () => {
    try {
      const response = await fetch(`/api/datasets/${params.id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          qualityScores,
          userId: 2, // Mock walidata user
        }),
      })

      if (response.ok) {
        alert('Dataset berhasil divalidasi!')
        router.push('/walidata/validated')
      }
    } catch (error) {
      console.error('Error validating:', error)
      alert('Gagal memvalidasi dataset')
    }
  }

  const handleReject = async () => {
    if (!rejectionReason) {
      alert('Mohon berikan alasan penolakan')
      return
    }

    try {
      const response = await fetch(`/api/datasets/${params.id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          reason: rejectionReason,
          userId: 2,
        }),
      })

      if (response.ok) {
        alert('Dataset ditolak')
        router.push('/walidata/pending')
      }
    } catch (error) {
      console.error('Error rejecting:', error)
      alert('Gagal menolak dataset')
    }
  }

  const handleAddComment = async () => {
    if (!comment) return

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: params.id,
          message: comment,
          isInternal: true,
          userId: 2,
        }),
      })

      if (response.ok) {
        setComment('')
        // Refresh discussions
        const res = await fetch(`/api/discussions?datasetId=${params.id}`)
        const data = await res.json()
        setDiscussions(data.discussions || [])
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  if (!dataset) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/walidata/pending" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Validasi Dataset</h1>
        <p className="text-gray-600 mt-1">Review detail dataset dan berikan penilaian</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dataset Info */}
          <Card>
            <CardHeader>
              <CardTitle>{dataset.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Deskripsi</h4>
                <p className="text-gray-700">{dataset.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t">
                <div>
                  <span className="text-sm text-gray-500">Kategori</span>
                  <p className="font-medium">Kategori #{dataset.categoryId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Klasifikasi</span>
                  <p className="font-medium capitalize">{dataset.classification}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Periode</span>
                  <p className="font-medium">
                    {dataset.periodStart} - {dataset.periodEnd || 'sekarang'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Update</span>
                  <p className="font-medium">{dataset.updateFrequency || '-'}</p>
                </div>
              </div>

              {dataset.tags?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map((tag: string) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata Standar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataset.concept && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Konsep</h4>
                  <p className="text-gray-700">{dataset.concept}</p>
                </div>
              )}
              {dataset.definition && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Definisi</h4>
                  <p className="text-gray-700">{dataset.definition}</p>
                </div>
              )}
              {dataset.interpretasi && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Interpretasi</h4>
                  <p className="text-gray-700">{dataset.interpretasi}</p>
                </div>
              )}
              {dataset.metodologi && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Metodologi</h4>
                  <p className="text-gray-700">{dataset.metodologi}</p>
                </div>
              )}
              {dataset.unitData && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Satuan Data</h4>
                  <p className="text-gray-700">{dataset.unitData}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Dictionary */}
          {dataset.dataDictionary?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kamus Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Field</th>
                        <th className="px-4 py-2 text-left">Tipe</th>
                        <th className="px-4 py-2 text-left">Deskripsi</th>
                        <th className="px-4 py-2 text-left">Contoh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.dataDictionary.map((field: any, idx: number) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2 font-medium">{field.field}</td>
                          <td className="px-4 py-2">{field.type}</td>
                          <td className="px-4 py-2">{field.description}</td>
                          <td className="px-4 py-2 text-gray-500">{field.example || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quality Assessment Form */}
          {showQualityForm && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Penilaian Kualitas Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'completeness', label: 'Kelengkapan Data' },
                  { key: 'accuracy', label: 'Akurasi' },
                  { key: 'timeliness', label: 'Ketepatan Waktu' },
                  { key: 'consistency', label: 'Konsistensi' },
                ].map((metric) => (
                  <div key={metric.key}>
                    <label className="block text-sm font-medium mb-2">
                      {metric.label}: {qualityScores[metric.key as keyof typeof qualityScores]}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={qualityScores[metric.key as keyof typeof qualityScores]}
                      onChange={(e) =>
                        setQualityScores({
                          ...qualityScores,
                          [metric.key]: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
                
                <div>
                  <label className="block text-sm font-medium mb-2">Catatan</label>
                  <textarea
                    value={qualityScores.notes}
                    onChange={(e) => setQualityScores({ ...qualityScores, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 min-h-[80px]"
                    placeholder="Catatan tambahan tentang kualitas data..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleValidate} variant="success">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Validasi Dataset
                  </Button>
                  <Button variant="outline" onClick={() => setShowQualityForm(false)}>
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Penolakan Dataset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Alasan Penolakan *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-red-300 rounded-md p-2 min-h-[100px]"
                    placeholder="Jelaskan alasan penolakan dataset ini..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={handleReject}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Tolak Dataset
                  </Button>
                  <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">File Dataset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Nama File</span>
                <p className="font-medium text-sm">{dataset.fileName || 'Tidak ada file'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Ukuran</span>
                <p className="font-medium text-sm">{formatFileSize(dataset.fileSize)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Tipe</span>
                <p className="font-medium text-sm">{dataset.fileType || '-'}</p>
              </div>
              {dataset.fileUrl && (
                <Button variant="outline" className="w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {!showQualityForm && !showRejectForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Aksi Validasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="success"
                  className="w-full"
                  onClick={() => setShowQualityForm(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validasi Dataset
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowRejectForm(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak Dataset
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Forum Diskusi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {discussions.map((disc) => (
                  <div key={disc.id} className="bg-gray-50 rounded p-2 text-sm">
                    <p className="text-gray-700">{disc.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(disc.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  rows={3}
                  placeholder="Tambahkan komentar..."
                />
                <Button size="sm" onClick={handleAddComment} className="w-full">
                  Kirim Komentar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
