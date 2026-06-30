export const DATA_CATEGORIES = [
  { id: 1, name: 'Kependudukan', slug: 'kependudukan', icon: '👥' },
  { id: 2, name: 'Kesehatan', slug: 'kesehatan', icon: '🏥' },
  { id: 3, name: 'Pendidikan', slug: 'pendidikan', icon: '🎓' },
  { id: 4, name: 'Ekonomi', slug: 'ekonomi', icon: '💰' },
  { id: 5, name: 'Infrastruktur', slug: 'infrastruktur', icon: '🏗️' },
  { id: 6, name: 'Lingkungan', slug: 'lingkungan', icon: '🌳' },
  { id: 7, name: 'Sosial', slug: 'sosial', icon: '🤝' },
  { id: 8, name: 'Pemerintahan', slug: 'pemerintahan', icon: '🏛️' },
]

export const UPDATE_FREQUENCIES = [
  'Harian',
  'Mingguan',
  'Bulanan',
  'Triwulanan',
  'Semesteran',
  'Tahunan',
  'Tidak Tentu',
]

export const DATA_CLASSIFICATIONS = [
  { value: 'publik', label: 'Publik', description: 'Dapat diakses oleh semua orang' },
  { value: 'terbatas', label: 'Terbatas', description: 'Hanya untuk kalangan tertentu' },
  { value: 'rahasia', label: 'Rahasia', description: 'Sangat terbatas, data sensitif' },
]

export const FILE_TYPES = [
  { ext: '.csv', mime: 'text/csv', label: 'CSV' },
  { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel' },
  { ext: '.xls', mime: 'application/vnd.ms-excel', label: 'Excel (Legacy)' },
  { ext: '.json', mime: 'application/json', label: 'JSON' },
  { ext: '.xml', mime: 'application/xml', label: 'XML' },
]

export const UNIT_DATA_OPTIONS = [
  'Orang',
  'Jiwa',
  'Keluarga',
  'KK',
  'Unit',
  'Buah',
  'Rupiah',
  'Persen (%)',
  'Meter',
  'Kilometer',
  'Hektar',
  'Kasus',
  'Lainnya',
]

export const MOCK_INSTANSI = [
  { id: 1, name: 'Dinas Kesehatan', code: 'DINKES' },
  { id: 2, name: 'Dinas Pendidikan', code: 'DINDIK' },
  { id: 3, name: 'Dinas Pekerjaan Umum', code: 'DPU' },
  { id: 4, name: 'Badan Pusat Statistik', code: 'BPS' },
  { id: 5, name: 'Dinas Sosial', code: 'DINSOS' },
  { id: 6, name: 'Bappeda', code: 'BAPPEDA' },
  { id: 7, name: 'Dinas Kominfo', code: 'KOMINFO' },
]
