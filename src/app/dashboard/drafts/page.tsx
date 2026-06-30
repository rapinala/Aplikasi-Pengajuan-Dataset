'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Edit, Trash2, Send } from 'lucide-react'

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<any[]>([])
  const mockInstansiId = 1

  useEffect(() => {
    fetch(`/api/datasets?status=draft&instansiId=${mockInstansiId}`)
      .then(res => res.json())
      .then(data => setDrafts(data.datasets || []))
      .catch(err => console.error(err))
  }, [])

  const handleSubmit = async (id: number) => {
    if (!confirm('Ajukan dataset ini untuk validasi?')) return

    try {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending', userId: 1 }),
      })

      if (response.ok) {
        alert('Dataset berhasil diajukan!')
        setDrafts(drafts.filter(d => d.id !== id))
      }
    } catch (error) {
      console.error('Error submitting draft:', error)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Draft Dataset</h1>
        <p className="text-gray-600 mt-1">Dataset yang tersimpan sebagai draft</p>
      </div>

      <div className="space-y-4">
        {drafts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <p>Tidak ada draft</p>
              <Link href="/dashboard/upload">
                <Button className="mt-4">Buat Dataset Baru</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          drafts.map((draft) => (
            <Card key={draft.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {draft.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {draft.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Terakhir diubah: {formatDate(draft.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" onClick={() => handleSubmit(draft.id)}>
                      <Send className="h-4 w-4 mr-1" /> Ajukan
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
