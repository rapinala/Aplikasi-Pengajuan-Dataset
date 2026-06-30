import Link from 'next/link'
import { Database, Upload, CheckCircle, BarChart3, Users, MessageSquare, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">Portal Dataset Pemerintah</span>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Login Instansi</Button>
              </Link>
              <Link href="/walidata">
                <Button>Login Walidata</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Dashboard Portal Pengajuan Dataset
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Sistem manajemen pengajuan dataset untuk instansi pemerintah dengan proses validasi transparan 
            dan standar metadata yang terstruktur
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/upload">
              <Button size="lg" className="text-lg">
                <Upload className="mr-2 h-5 w-5" />
                Ajukan Dataset
              </Button>
            </Link>
          </div>
        </div>

        {/* Struktur Menu */}
        <section className="mb-20" id="menu-structure">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            📋 Struktur Menu Dashboard
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Instansi Menu */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-900">👤 Dashboard Instansi</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {[
                    { icon: '📊', label: 'Dashboard', desc: 'Overview statistik pengajuan' },
                    { icon: '📤', label: 'Upload Dataset', desc: 'Form pengajuan dataset baru' },
                    { icon: '🗂️', label: 'Dataset Saya', desc: 'Kelola semua dataset yang diajukan' },
                    { icon: '📝', label: 'Draft', desc: 'Dataset yang belum diajukan' },
                    { icon: '💬', label: 'Forum Walidata', desc: 'Diskusi dengan validator' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Walidata Menu */}
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-900">👨‍💼 Dashboard Walidata</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {[
                    { icon: '📊', label: 'Dashboard', desc: 'Overview validasi & kualitas data' },
                    { icon: '⏳', label: 'Menunggu Validasi', desc: 'Dataset yang perlu direview' },
                    { icon: '✅', label: 'Tervalidasi', desc: 'Dataset yang sudah disetujui' },
                    { icon: '❌', label: 'Ditolak', desc: 'Dataset yang tidak memenuhi standar' },
                    { icon: '📈', label: 'Analitik Data', desc: 'Insight & rekomendasi kebijakan' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* User Flow */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔄 Alur Pengajuan Dataset
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: 'Upload Data', desc: 'Instansi mengisi form & upload file', icon: '📤' },
              { step: 2, title: 'Isi Metadata', desc: 'Lengkapi informasi standar', icon: '📝' },
              { step: 3, title: 'Forum Walidata', desc: 'Review & diskusi', icon: '💬' },
              { step: 4, title: 'Validasi', desc: 'Approve/reject dataset', icon: '✅' },
              { step: 5, title: 'Publikasi', desc: 'Data siap diakses', icon: '🌐' },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fitur Utama */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            ✨ Fitur Utama Sistem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Metadata Terstandarisasi', desc: 'Form lengkap dengan dropdown & autocomplete', icon: '📋' },
              { title: 'Status Transparan', desc: 'Tracking real-time dengan notifikasi', icon: '🔍' },
              { title: 'Forum Koordinasi', desc: 'Komunikasi langsung instansi-walidata', icon: '💬' },
              { title: 'Penilaian Kualitas', desc: 'Sistem scoring objektif', icon: '⭐' },
              { title: 'Dashboard Analitik', desc: 'Visualisasi & rekomendasi kebijakan', icon: '📊' },
              { title: 'Multi-Format File', desc: 'CSV, Excel, JSON, XML', icon: '📁' },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Siap Meningkatkan Kualitas Data Pemerintah?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Mulai ajukan dataset Anda sekarang
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Dashboard Instansi
              </Button>
            </Link>
            <Link href="/walidata">
              <Button size="lg" className="bg-blue-800 hover:bg-blue-900">
                Dashboard Walidata
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
