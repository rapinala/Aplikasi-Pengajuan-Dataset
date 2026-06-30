'use client'

import { DatasetUploadForm } from '@/components/DatasetUploadForm'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Upload Dataset Baru</h1>
        <p className="text-gray-600 mt-1">Ikuti langkah-langkah untuk mengajukan dataset</p>
      </div>

      <DatasetUploadForm
        userId={1}
        instansiId={1}
        onSuccess={() => {
          router.push('/dashboard/my-datasets')
        }}
      />
    </div>
  )
}
