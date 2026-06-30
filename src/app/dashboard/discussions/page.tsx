'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function DiscussionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Forum Walidata</h1>
        <p className="text-gray-600 mt-1">Komunikasi dengan validator dataset</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Diskusi Dataset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>Forum diskusi akan muncul setelah Anda mengajukan dataset</p>
            <p className="text-sm mt-2">Walidata akan memberikan feedback dan Anda dapat berdiskusi di sini</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
