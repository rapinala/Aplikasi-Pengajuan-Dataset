import { db } from '../src/db'
import { 
  users, 
  instansi, 
  datasets, 
  datasetCategories,
  discussions,
  notifications,
  activityLogs,
  dataQualityMetrics
} from '../src/db/schema'

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Seed Instansi
    console.log('Creating instansi...')
    const instansiData = await db.insert(instansi).values([
      { 
        name: 'Dinas Kesehatan', 
        code: 'DINKES',
        category: 'Dinas',
        address: 'Jl. Kesehatan No. 1',
        phone: '021-1234567',
        email: 'dinkes@pemda.go.id'
      },
      { 
        name: 'Dinas Pendidikan', 
        code: 'DINDIK',
        category: 'Dinas',
        address: 'Jl. Pendidikan No. 2',
        phone: '021-2345678',
        email: 'dindik@pemda.go.id'
      },
      { 
        name: 'Badan Pusat Statistik', 
        code: 'BPS',
        category: 'Badan',
        address: 'Jl. Statistik No. 3',
        phone: '021-3456789',
        email: 'bps@pemda.go.id'
      },
      { 
        name: 'Dinas Sosial', 
        code: 'DINSOS',
        category: 'Dinas',
        address: 'Jl. Sosial No. 4',
        phone: '021-4567890',
        email: 'dinsos@pemda.go.id'
      },
      { 
        name: 'Bappeda', 
        code: 'BAPPEDA',
        category: 'Badan',
        address: 'Jl. Perencanaan No. 5',
        phone: '021-5678901',
        email: 'bappeda@pemda.go.id'
      },
    ]).returning()

    console.log(`✓ Created ${instansiData.length} instansi`)

    // Seed Users
    console.log('Creating users...')
    const userData = await db.insert(users).values([
      {
        email: 'budi@dinkes.go.id',
        name: 'Budi Santoso',
        password: 'password123', // In production, hash this!
        role: 'instansi',
        instansiId: instansiData[0].id,
      },
      {
        email: 'siti@dindik.go.id',
        name: 'Siti Rahayu',
        password: 'password123',
        role: 'instansi',
        instansiId: instansiData[1].id,
      },
      {
        email: 'walidata@kominfo.go.id',
        name: 'Dr. Ahmad Walidata',
        password: 'password123',
        role: 'walidata',
      },
      {
        email: 'validator@bappeda.go.id',
        name: 'Dr. Siti Nurhaliza',
        password: 'password123',
        role: 'walidata',
      },
    ]).returning()

    console.log(`✓ Created ${userData.length} users`)

    // Seed Categories
    console.log('Creating categories...')
    const categoryData = await db.insert(datasetCategories).values([
      { name: 'Kependudukan', slug: 'kependudukan', icon: '👥' },
      { name: 'Kesehatan', slug: 'kesehatan', icon: '🏥' },
      { name: 'Pendidikan', slug: 'pendidikan', icon: '🎓' },
      { name: 'Ekonomi', slug: 'ekonomi', icon: '💰' },
      { name: 'Infrastruktur', slug: 'infrastruktur', icon: '🏗️' },
      { name: 'Lingkungan', slug: 'lingkungan', icon: '🌳' },
      { name: 'Sosial', slug: 'sosial', icon: '🤝' },
      { name: 'Pemerintahan', slug: 'pemerintahan', icon: '🏛️' },
    ]).returning()

    console.log(`✓ Created ${categoryData.length} categories`)

    // Seed Datasets
    console.log('Creating datasets...')
    const datasetData = await db.insert(datasets).values([
      {
        title: 'Data Jumlah Penduduk Kota XYZ 2024',
        description: 'Dataset berisi informasi jumlah penduduk per kecamatan di Kota XYZ tahun 2024',
        concept: 'Jumlah penduduk adalah total individu yang berdomisili di suatu wilayah',
        definition: 'Penduduk adalah orang yang bertempat tinggal atau menetap dalam suatu wilayah tertentu',
        interpretasi: 'Angka menunjukkan total penduduk terdaftar per kecamatan',
        metodologi: 'Data dikumpulkan melalui sistem informasi kependudukan',
        unitData: 'Jiwa',
        periodStart: '2024-01',
        periodEnd: '2024-12',
        updateFrequency: 'Bulanan',
        categoryId: categoryData[0].id,
        classification: 'publik',
        tags: ['kependudukan', 'demografi', 'sensus'],
        fileName: 'data_penduduk_2024.csv',
        fileSize: 245678,
        fileType: 'text/csv',
        fileUrl: '/uploads/data_penduduk_2024.csv',
        status: 'validated',
        submittedBy: userData[0].id,
        instansiId: instansiData[0].id,
        validatedBy: userData[2].id,
        validatedAt: new Date('2024-01-15'),
        dataDictionary: [
          { field: 'kecamatan', type: 'text', description: 'Nama kecamatan', example: 'Kecamatan A' },
          { field: 'jumlah_penduduk', type: 'number', description: 'Total penduduk', example: '50000' },
          { field: 'laki_laki', type: 'number', description: 'Jumlah laki-laki', example: '25000' },
          { field: 'perempuan', type: 'number', description: 'Jumlah perempuan', example: '25000' },
        ],
        viewCount: 125,
        downloadCount: 45,
      },
      {
        title: 'Data Fasilitas Kesehatan 2024',
        description: 'Daftar lengkap fasilitas kesehatan (Puskesmas, RS, Klinik) beserta kapasitas dan layanan',
        concept: 'Fasilitas kesehatan adalah tempat yang digunakan untuk menyelenggarakan upaya pelayanan kesehatan',
        definition: 'Meliputi Rumah Sakit, Puskesmas, Klinik, dan fasilitas kesehatan lainnya',
        interpretasi: 'Data menunjukkan sebaran dan kapasitas fasilitas kesehatan di wilayah',
        metodologi: 'Survey langsung ke fasilitas kesehatan dan verifikasi perizinan',
        unitData: 'Unit',
        periodStart: '2024-01',
        periodEnd: '2024-12',
        updateFrequency: 'Triwulanan',
        categoryId: categoryData[1].id,
        classification: 'publik',
        tags: ['kesehatan', 'fasilitas', 'infrastruktur'],
        fileName: 'faskes_2024.xlsx',
        fileSize: 189234,
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileUrl: '/uploads/faskes_2024.xlsx',
        status: 'pending',
        submittedBy: userData[0].id,
        instansiId: instansiData[0].id,
        dataDictionary: [
          { field: 'nama_faskes', type: 'text', description: 'Nama fasilitas kesehatan' },
          { field: 'tipe', type: 'text', description: 'Jenis fasilitas (RS/Puskesmas/Klinik)' },
          { field: 'alamat', type: 'text', description: 'Alamat lengkap' },
          { field: 'kapasitas_tempat_tidur', type: 'number', description: 'Jumlah tempat tidur' },
        ],
        viewCount: 23,
      },
      {
        title: 'Data Siswa dan Sekolah Tahun Ajaran 2024/2025',
        description: 'Statistik siswa per jenjang pendidikan dan data sekolah',
        concept: 'Data agregat siswa dan institusi pendidikan formal',
        definition: 'Siswa yang terdaftar aktif di lembaga pendidikan formal',
        interpretasi: 'Menunjukkan distribusi siswa berdasarkan jenjang dan wilayah',
        metodologi: 'Pengumpulan data melalui sistem Dapodik',
        unitData: 'Orang',
        periodStart: '2024-07',
        periodEnd: '2025-06',
        updateFrequency: 'Semesteran',
        categoryId: categoryData[2].id,
        classification: 'publik',
        tags: ['pendidikan', 'siswa', 'sekolah'],
        fileName: 'data_siswa_2024.csv',
        fileSize: 456789,
        fileType: 'text/csv',
        fileUrl: '/uploads/data_siswa_2024.csv',
        status: 'validated',
        submittedBy: userData[1].id,
        instansiId: instansiData[1].id,
        validatedBy: userData[3].id,
        validatedAt: new Date('2024-02-10'),
        viewCount: 89,
        downloadCount: 34,
      },
      {
        title: 'Data Kemiskinan dan Bantuan Sosial 2024',
        description: 'Data penerima bantuan sosial dan tingkat kemiskinan per wilayah',
        concept: 'Kemiskinan adalah kondisi dimana seseorang tidak mampu memenuhi kebutuhan dasar',
        definition: 'Penduduk dengan pengeluaran di bawah garis kemiskinan',
        interpretasi: 'Persentase dan jumlah absolut penduduk miskin',
        metodologi: 'Data dari Survei Sosial Ekonomi Nasional dan verifikasi lapangan',
        unitData: 'KK',
        periodStart: '2024-01',
        periodEnd: '2024-12',
        updateFrequency: 'Tahunan',
        categoryId: categoryData[6].id,
        classification: 'terbatas',
        tags: ['kemiskinan', 'bansos', 'sosial'],
        fileName: 'data_kemiskinan_2024.xlsx',
        fileSize: 234567,
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileUrl: '/uploads/data_kemiskinan_2024.xlsx',
        status: 'draft',
        submittedBy: userData[0].id,
        instansiId: instansiData[3].id,
        viewCount: 5,
      },
    ]).returning()

    console.log(`✓ Created ${datasetData.length} datasets`)

    // Seed Quality Metrics for validated datasets
    console.log('Creating quality metrics...')
    const validatedDatasets = datasetData.filter(d => d.status === 'validated')
    const qualityData = await db.insert(dataQualityMetrics).values(
      validatedDatasets.map(dataset => ({
        datasetId: dataset.id,
        completenessScore: Math.floor(Math.random() * 20) + 80, // 80-100
        accuracyScore: Math.floor(Math.random() * 20) + 80,
        timelinessScore: Math.floor(Math.random() * 20) + 75,
        consistencyScore: Math.floor(Math.random() * 20) + 80,
        overallScore: Math.floor(Math.random() * 15) + 82, // 82-97
        assessedBy: userData[2].id,
        notes: 'Dataset memenuhi standar kualitas data',
      }))
    ).returning()

    console.log(`✓ Created ${qualityData.length} quality metrics`)

    // Seed Discussions
    console.log('Creating discussions...')
    const discussionData = await db.insert(discussions).values([
      {
        datasetId: datasetData[1].id, // pending dataset
        userId: userData[2].id, // walidata
        message: 'Mohon lengkapi informasi metodologi pengumpulan data. Apakah ada standar yang digunakan?',
        isInternal: true,
      },
      {
        datasetId: datasetData[1].id,
        userId: userData[0].id, // instansi
        message: 'Terima kasih feedbacknya. Kami menggunakan standar WHO untuk klasifikasi fasilitas kesehatan.',
        isInternal: true,
      },
    ]).returning()

    console.log(`✓ Created ${discussionData.length} discussions`)

    // Seed Notifications
    console.log('Creating notifications...')
    const notificationData = await db.insert(notifications).values([
      {
        userId: userData[0].id,
        type: 'validation',
        title: 'Dataset Divalidasi',
        message: 'Dataset "Data Jumlah Penduduk Kota XYZ 2024" telah divalidasi',
        datasetId: datasetData[0].id,
        isRead: true,
      },
      {
        userId: userData[0].id,
        type: 'comment',
        title: 'Komentar Baru',
        message: 'Walidata menambahkan komentar pada dataset Anda',
        datasetId: datasetData[1].id,
        isRead: false,
      },
      {
        userId: userData[1].id,
        type: 'validation',
        title: 'Dataset Divalidasi',
        message: 'Dataset "Data Siswa dan Sekolah" telah divalidasi dengan skor 89%',
        datasetId: datasetData[2].id,
        isRead: false,
      },
    ]).returning()

    console.log(`✓ Created ${notificationData.length} notifications`)

    // Seed Activity Logs
    console.log('Creating activity logs...')
    const activityData = await db.insert(activityLogs).values([
      {
        userId: userData[0].id,
        action: 'create_dataset',
        description: 'Membuat dataset baru: Data Jumlah Penduduk Kota XYZ 2024',
        datasetId: datasetData[0].id,
        metadata: { status: 'pending' },
      },
      {
        userId: userData[2].id,
        action: 'validate_dataset',
        description: 'Memvalidasi dataset: Data Jumlah Penduduk Kota XYZ 2024',
        datasetId: datasetData[0].id,
        metadata: { previousStatus: 'pending', newStatus: 'validated' },
      },
      {
        userId: userData[1].id,
        action: 'create_dataset',
        description: 'Membuat dataset baru: Data Siswa dan Sekolah',
        datasetId: datasetData[2].id,
        metadata: { status: 'pending' },
      },
    ]).returning()

    console.log(`✓ Created ${activityData.length} activity logs`)

    console.log('\n✅ Seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Instansi: ${instansiData.length}`)
    console.log(`   - Users: ${userData.length}`)
    console.log(`   - Categories: ${categoryData.length}`)
    console.log(`   - Datasets: ${datasetData.length}`)
    console.log(`   - Quality Metrics: ${qualityData.length}`)
    console.log(`   - Discussions: ${discussionData.length}`)
    console.log(`   - Notifications: ${notificationData.length}`)
    console.log(`   - Activity Logs: ${activityData.length}`)
    
    console.log('\n👤 Demo Login Credentials:')
    console.log('   Instansi: budi@dinkes.go.id / password123')
    console.log('   Walidata: walidata@kominfo.go.id / password123')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
