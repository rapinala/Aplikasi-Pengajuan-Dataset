# 📊 Dashboard Portal Pengajuan Dataset - Dokumentasi Lengkap

## 🎯 Tujuan Sistem

Dashboard Portal Pengajuan Dataset adalah sistem manajemen data terpadu untuk instansi pemerintah yang bertujuan:

1. **Mengelola proses pengajuan dataset** dari instansi hingga menjadi data publik
2. **Standardisasi metadata** untuk meningkatkan kualitas dan interoperabilitas data
3. **Transparansi proses validasi** dengan tracking status real-time
4. **Kolaborasi digital** antara instansi dan Walidata
5. **Mendukung pengambilan keputusan** berbasis data yang berkualitas

---

## 🏗️ Struktur Menu Dashboard

### 👤 Dashboard Instansi (Pengaju Data)

| Menu | Fungsi | Fitur Utama |
|------|--------|-------------|
| **Dashboard** | Overview statistik | Total dataset, pending, tervalidasi, draft |
| **Upload Dataset** | Form pengajuan baru | Wizard 4 langkah (Info Dasar, Metadata, Kamus Data, File) |
| **Dataset Saya** | Kelola dataset | Filter, search, lihat detail, tracking status |
| **Draft** | Dataset belum diajukan | Lanjutkan pengerjaan, edit, submit |
| **Forum Walidata** | Komunikasi dengan validator | Diskusi, komentar, history perubahan |

### 👨‍💼 Dashboard Walidata (Validator)

| Menu | Fungsi | Fitur Utama |
|------|--------|-------------|
| **Dashboard** | Overview validasi | Pending count, quality metrics, top performers |
| **Menunggu Validasi** | Review dataset pending | List semua pengajuan baru |
| **Tervalidasi** | Dataset approved | List dataset yang sudah disetujui |
| **Ditolak** | Dataset rejected | List dengan alasan penolakan |
| **Analitik Data** | Insight & rekomendasi | Visualisasi trend, kualitas, distribusi kategori |
| **Manajemen Instansi** | Kelola instansi | CRUD instansi kontributor |

---

## 🔄 User Flow: Alur Pengajuan Dataset

```
┌─────────────┐
│ 1. UPLOAD   │  → Instansi mengisi form & upload file dataset
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ 2. METADATA │  → Mengisi informasi standar (Konsep, Definisi, dll)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ 3. FORUM    │  → Walidata review, beri komentar, diskusi
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ 4. VALIDASI │  → Walidata approve (dengan scoring) atau reject
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ 5. PUBLIKASI│  → Dataset tervalidasi siap diakses publik
└─────────────┘
```

### Status Dataset

- **Draft**: Disimpan tapi belum diajukan
- **Pending**: Menunggu review Walidata
- **Validated**: Disetujui oleh Walidata
- **Rejected**: Ditolak dengan alasan tertentu
- **Published**: Tersedia untuk publik

---

## 📝 Modul Pengisian Metadata

### Informasi Wajib (Required Fields)

| Field | Deskripsi | Input Method |
|-------|-----------|--------------|
| **Judul Dataset** | Nama dataset yang deskriptif | Text input |
| **Deskripsi** | Penjelasan ringkas dataset | Textarea |
| **Kategori** | Klasifikasi topik data | **Dropdown** (8 kategori) |
| **Klasifikasi Akses** | Tingkat keamanan data | **Dropdown** (Publik/Terbatas/Rahasia) |
| **Konsep** | Gagasan utama data | Textarea |
| **Definisi** | Definisi formal indikator | Textarea |
| **Interpretasi** | Cara membaca data | Textarea |
| **Metodologi** | Metode pengumpulan data | Textarea |
| **Satuan Data** | Unit pengukuran | **Dropdown** (Orang, Rupiah, %, dll) |
| **Periode Data** | Rentang waktu | **Date picker** (start-end) |
| **Frekuensi Update** | Seberapa sering diperbarui | **Dropdown** (Harian, Bulanan, Tahunan, dll) |

### Fitur Kemudahan Input

#### 1. **Dropdown Kategori**
- 🏥 Kesehatan
- 🎓 Pendidikan
- 👥 Kependudukan
- 💰 Ekonomi
- 🏗️ Infrastruktur
- 🌳 Lingkungan
- 🤝 Sosial
- 🏛️ Pemerintahan

#### 2. **Tag/Label System**
- Autocomplete dari tag yang sering digunakan
- Tambah tag custom dengan Enter key
- Visual chips untuk tag yang sudah dipilih

#### 3. **Kamus Data (Data Dictionary)**
- Definisikan struktur field dalam dataset
- **Field name**: Nama kolom
- **Type**: Tipe data (text, number, date, boolean)
- **Description**: Deskripsi field
- **Example**: Contoh nilai (opsional)
- Tambah/hapus field secara dinamis

#### 4. **File Upload**
- Drag & drop atau browse file
- Support: CSV, Excel (.xlsx, .xls), JSON, XML
- Max size: 50MB
- Preview info file setelah upload

---

## 💬 Integrasi Forum Walidata

### Alur Koordinasi Digital

```
Instansi Submit Dataset
         ↓
Walidata Notified (email/in-app)
         ↓
Walidata Review Dataset
         ↓
Walidata Add Comment/Question ← → Instansi Reply
         ↓                           ↓
Internal Discussion Thread    Transparent History
         ↓
Walidata Make Decision (Validate/Reject)
         ↓
Instansi Notified of Result
```

### Fitur Forum

1. **Komentar Internal**
   - Hanya visible untuk instansi terkait & Walidata
   - Thread discussion dengan reply
   - Attach file pendukung

2. **History Tracking**
   - Log semua aktivitas (submit, comment, validate, reject)
   - Timestamp lengkap
   - User attribution

3. **Notifikasi Real-time**
   - In-app notification dengan badge counter
   - Email notification (optional)
   - Push notification (mobile - future)

### Status Validasi Transparan

| Status | Notifikasi | Aksi Selanjutnya |
|--------|------------|------------------|
| **Pending** | "Dataset Anda sedang direview" | Tunggu feedback Walidata |
| **Commented** | "Walidata menambahkan komentar" | Baca & respond di forum |
| **Validated** | "Dataset disetujui dengan skor X%" | Lihat penilaian kualitas |
| **Rejected** | "Dataset ditolak: [alasan]" | Perbaiki & submit ulang |

---

## 📊 Dashboard Rekomendasi Data

### Visualisasi untuk Pimpinan Daerah

#### 1. **Metrik Kualitas Data**
```
┌─────────────────────────────────┐
│  Kelengkapan       ████████ 85% │
│  Akurasi          █████████ 90% │
│  Ketepatan Waktu   ███████ 78%  │
│  Konsistensi      ████████ 82%  │
│  ──────────────────────────────  │
│  Overall Quality   ████████ 84% │
└─────────────────────────────────┘
```

#### 2. **Trend Pengajuan Dataset**
- Line chart: Jumlah dataset per bulan (6 bulan terakhir)
- Insight: Tren naik/turun, musiman

#### 3. **Distribusi Kategori**
- Bar chart: Jumlah dataset per kategori
- Highlight: Area dengan data terlengkap vs area kekurangan data

#### 4. **Top Kontributor Instansi**
- Ranking instansi berdasarkan jumlah dataset tervalidasi
- Badge/award untuk top performers

#### 5. **Rekomendasi Kebijakan**

**Contoh Output Dashboard:**

```markdown
💡 REKOMENDASI KEBIJAKAN BERBASIS DATA

✅ Kualitas Data Keseluruhan: 84%
   → Data berkualitas tinggi, dapat diandalkan untuk 
     pengambilan keputusan strategis

📊 Area dengan Data Terlengkap: KESEHATAN
   → 47 dataset tervalidasi
   → Siap untuk analisis mendalam program kesehatan

⚠️  Area Perlu Perhatian: INFRASTRUKTUR
   → Hanya 12 dataset
   → Rekomendasi: Tingkatkan pengumpulan data 
     infrastruktur untuk perencanaan pembangunan

🤝 Kolaborasi Antar-Instansi
   → 15 instansi aktif berkontribusi
   → Dorong instansi lain untuk partisipasi
```

### Fitur Dashboard untuk Decision Maker

1. **Executive Summary Cards**
   - Total dataset, quality score, trend
   - One-glance overview

2. **Drill-down Capability**
   - Click kategori → lihat detail dataset
   - Filter by instansi, periode, status

3. **Export Reports**
   - PDF summary report
   - Excel data untuk analisis lanjut

4. **Comparison View**
   - Bandingkan antar periode
   - Benchmark antar daerah (future)

---

## ⭐ Saran Fitur Utama untuk Kualitas Data

### 1. **Sistem Scoring Kualitas Otomatis**

**4 Dimensi Penilaian:**

| Dimensi | Kriteria | Bobot |
|---------|----------|-------|
| **Kelengkapan** | % field terisi, kamus data ada | 25% |
| **Akurasi** | Validasi format, konsistensi nilai | 25% |
| **Ketepatan Waktu** | Data up-to-date sesuai frekuensi | 25% |
| **Konsistensi** | Standarisasi, tidak ada duplikasi | 25% |

**Auto-check:**
- Field kosong → kurangi skor kelengkapan
- Format invalid → kurangi skor akurasi
- Data outdated → kurangi skor timeliness
- Duplikasi → kurangi skor konsistensi

### 2. **Template & Guidelines**

- **Template Excel/CSV** yang sudah terstruktur
- **Panduan Pengisian** step-by-step dengan screenshot
- **FAQ** untuk pertanyaan umum
- **Best Practices** dari dataset berkualitas tinggi

### 3. **Preview & Validation**

- **Data Preview**: Tampilkan 10 baris pertama sebelum submit
- **Format Validation**: Auto-check tipe data, missing values
- **Duplicate Detection**: Warning jika ada duplikasi
- **Schema Validation**: Pastikan kesesuaian dengan kamus data

### 4. **Versioning & Update Management**

- Track versi dataset (v1.0, v1.1, v2.0)
- Changelog otomatis
- Rollback ke versi sebelumnya
- Update notification ke subscriber

### 5. **API Access**

- REST API untuk akses programmatic
- API key management
- Rate limiting
- Documentation (Swagger/OpenAPI)

### 6. **Data Quality Dashboard**

- Real-time monitoring kualitas
- Alert jika skor turun di bawah threshold
- Recommendation engine untuk perbaikan
- Gamification: Badge untuk dataset berkualitas

### 7. **Collaboration Features**

- Multi-user editing (dengan permission)
- Approval workflow (creator → reviewer → approver)
- Comment threads per field
- @mention untuk notifikasi

### 8. **Search & Discovery**

- Full-text search across metadata
- Faceted search (filter by kategori, instansi, periode)
- Related datasets recommendation
- Tag-based discovery

---

## 🛠️ Teknologi Stack

- **Frontend**: Next.js 16 + React 19
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **UI Components**: Radix UI + Tailwind CSS
- **Charts**: Recharts (optional)
- **Icons**: Lucide React

---

## 📦 Database Schema

### Tabel Utama

1. **users**: User accounts (instansi/walidata)
2. **instansi**: Master data instansi pemerintah
3. **datasets**: Dataset submissions dengan metadata lengkap
4. **dataset_categories**: Kategori dataset
5. **discussions**: Forum/komentar per dataset
6. **notifications**: Sistem notifikasi
7. **activity_logs**: Audit trail semua aktivitas
8. **data_quality_metrics**: Skor kualitas per dataset

---

## 🚀 Quick Start

1. **Login sebagai Instansi**: `/dashboard`
2. **Upload Dataset**: `/dashboard/upload`
3. **Login sebagai Walidata**: `/walidata`
4. **Validasi Dataset**: `/walidata/pending`
5. **Lihat Analytics**: `/walidata/analytics`

---

## 📈 Roadmap Future Enhancements

- [ ] Machine Learning untuk prediksi kualitas data
- [ ] Integrasi dengan sistem satu data Indonesia
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dengan AI insights
- [ ] Data catalog dengan semantic search
- [ ] Automated data quality monitoring
- [ ] Public portal untuk akses dataset
- [ ] Data visualization builder
- [ ] Collaborative data analysis workspace
- [ ] Open Data API marketplace

---

**Dibuat untuk mendukung transformasi digital pemerintah dan pembangunan berbasis data yang berkualitas.**
