'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Upload, Plus, Trash2, Save, Send } from 'lucide-react'
import { DATA_CATEGORIES, UPDATE_FREQUENCIES, DATA_CLASSIFICATIONS, UNIT_DATA_OPTIONS } from '@/lib/constants'

interface DatasetUploadFormProps {
  userId: number
  instansiId: number
  onSuccess?: () => void
}

export function DatasetUploadForm({ userId, instansiId, onSuccess }: DatasetUploadFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    concept: '',
    definition: '',
    interpretasi: '',
    metodologi: '',
    unitData: '',
    periodStart: '',
    periodEnd: '',
    updateFrequency: '',
    categoryId: 1,
    classification: 'publik',
    tags: [] as string[],
    fileName: '',
    fileSize: 0,
    fileType: '',
    fileUrl: '',
  })
  
  const [dataDictionary, setDataDictionary] = useState<Array<{
    field: string
    type: string
    description: string
    example?: string
  }>>([{ field: '', type: '', description: '', example: '' }])
  
  const [currentTag, setCurrentTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileUploading, setFileUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileUploading(true)
    
    // Simulate file upload (in production, upload to cloud storage)
    setTimeout(() => {
      setFormData({
        ...formData,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: `/uploads/${file.name}`, // Mock URL
      })
      setFileUploading(false)
    }, 1500)
  }

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag] })
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const addDictionaryField = () => {
    setDataDictionary([...dataDictionary, { field: '', type: '', description: '', example: '' }])
  }

  const updateDictionaryField = (index: number, key: string, value: string) => {
    const updated = [...dataDictionary]
    updated[index] = { ...updated[index], [key]: value }
    setDataDictionary(updated)
  }

  const removeDictionaryField = (index: number) => {
    setDataDictionary(dataDictionary.filter((_, i) => i !== index))
  }

  const handleSubmit = async (status: 'draft' | 'pending') => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dataDictionary: dataDictionary.filter(d => d.field),
          status,
          userId,
          instansiId,
        }),
      })

      if (response.ok) {
        alert(status === 'draft' ? 'Draft tersimpan!' : 'Dataset berhasil diajukan!')
        onSuccess?.()
      } else {
        alert('Gagal menyimpan dataset')
      }
    } catch (error) {
      console.error('Error submitting dataset:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-24 h-1 ${
                    step > s ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span>Info Dasar</span>
          <span>Metadata</span>
          <span>Kamus Data</span>
          <span>Upload File</span>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar Dataset</CardTitle>
            <CardDescription>Masukkan informasi dasar tentang dataset Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Dataset *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Data Jumlah Penduduk Kota XYZ 2024"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                placeholder="Jelaskan secara singkat tentang dataset ini..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {DATA_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Klasifikasi *</label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {DATA_CLASSIFICATIONS.map((cls) => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tag/Label</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Ketik tag dan tekan Enter"
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-blue-600">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>Selanjutnya</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Metadata */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata Standar</CardTitle>
            <CardDescription>Isi metadata sesuai standar untuk meningkatkan kualitas data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Konsep</label>
              <textarea
                value={formData.concept}
                onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[80px]"
                placeholder="Jelaskan konsep atau gagasan utama dari data ini..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Definisi</label>
              <textarea
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[80px]"
                placeholder="Definisi formal dari data atau indikator..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Interpretasi</label>
              <textarea
                value={formData.interpretasi}
                onChange={(e) => setFormData({ ...formData, interpretasi: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[80px]"
                placeholder="Bagaimana cara membaca dan memahami data ini..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Metodologi Pengumpulan Data</label>
              <textarea
                value={formData.metodologi}
                onChange={(e) => setFormData({ ...formData, metodologi: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[80px]"
                placeholder="Metode yang digunakan untuk mengumpulkan data..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Satuan Data</label>
                <select
                  value={formData.unitData}
                  onChange={(e) => setFormData({ ...formData, unitData: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Pilih Satuan</option>
                  {UNIT_DATA_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frekuensi Update</label>
                <select
                  value={formData.updateFrequency}
                  onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Pilih Frekuensi</option>
                  {UPDATE_FREQUENCIES.map((freq) => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Periode Mulai</label>
                <Input
                  type="month"
                  value={formData.periodStart}
                  onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Periode Akhir</label>
                <Input
                  type="month"
                  value={formData.periodEnd}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Kembali</Button>
              <Button onClick={() => setStep(3)}>Selanjutnya</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Data Dictionary */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Kamus Data</CardTitle>
            <CardDescription>Definisikan struktur dan field dalam dataset Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataDictionary.map((field, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Field {index + 1}</h4>
                  {dataDictionary.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDictionaryField(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Nama Field"
                    value={field.field}
                    onChange={(e) => updateDictionaryField(index, 'field', e.target.value)}
                  />
                  <Input
                    placeholder="Tipe Data (text, number, date, dll)"
                    value={field.type}
                    onChange={(e) => updateDictionaryField(index, 'type', e.target.value)}
                  />
                </div>
                
                <Input
                  placeholder="Deskripsi field"
                  value={field.description}
                  onChange={(e) => updateDictionaryField(index, 'description', e.target.value)}
                />
                
                <Input
                  placeholder="Contoh nilai (opsional)"
                  value={field.example}
                  onChange={(e) => updateDictionaryField(index, 'example', e.target.value)}
                />
              </div>
            ))}
            
            <Button variant="outline" onClick={addDictionaryField} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Tambah Field
            </Button>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Kembali</Button>
              <Button onClick={() => setStep(4)}>Selanjutnya</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: File Upload */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload File Dataset</CardTitle>
            <CardDescription>Upload file dataset Anda (CSV, Excel, JSON, XML)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Pilih File
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls,.json,.xml"
                      onChange={handleFileChange}
                      disabled={fileUploading}
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    Format: CSV, Excel, JSON, XML (Max 50MB)
                  </p>
                </div>
              </div>
              
              {fileUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-600">Mengupload file...</p>
                </div>
              )}
              
              {formData.fileName && !fileUploading && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">✓ {formData.fileName}</p>
                  <p className="text-xs text-green-600">
                    {(formData.fileSize / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>Kembali</Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleSubmit('draft')}
                  disabled={loading || !formData.title}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Draft
                </Button>
                <Button
                  onClick={() => handleSubmit('pending')}
                  disabled={loading || !formData.title || !formData.fileName}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Ajukan untuk Validasi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
