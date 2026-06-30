# 📊 Dashboard Portal Pengajuan Dataset

> Sistem manajemen pengajuan dataset untuk instansi pemerintah dengan proses validasi transparan dan standar metadata terstruktur.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

---

## 📚 Dokumentasi Lengkap

**Baru pertama kali?** Lihat **[INDEX.md](./INDEX.md)** untuk navigasi semua dokumentasi!

| Dokumentasi | Untuk Siapa | Konten |
|-------------|-------------|--------|
| **[INDEX.md](./INDEX.md)** | Semua | 📍 Index & navigasi semua docs |
| **[QUICK_START.md](./QUICK_START.md)** | Developer | ⚡ Setup 5 menit & demo |
| **[INSTALL_SERVER.md](./INSTALL_SERVER.md)** | Admin | 🚀 3 cara install ke server |
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | User | 📖 Panduan lengkap fitur |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Developer | 🔍 Technical details |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | DevOps | 🛠️ Deploy production |

---

## 🎯 Fitur Utama

### Untuk Instansi (Pengaju Data)
- ✅ **Form Pengajuan Wizard 4 Langkah** dengan UI intuitif
- 📝 **Metadata Terstandarisasi** dengan dropdown & autocomplete
- 📊 **Dashboard Statistik** personal submission tracking
- 💬 **Forum Diskusi** langsung dengan Walidata
- 🔔 **Notifikasi Real-time** untuk setiap update status
- 📁 **Multi-format File** (CSV, Excel, JSON, XML)

### Untuk Walidata (Validator)
- 🔍 **Review & Validasi** dataset dengan scoring kualitas
- ⭐ **Penilaian 4 Dimensi**: Kelengkapan, Akurasi, Ketepatan Waktu, Konsistensi
- 📈 **Dashboard Analitik** dengan visualisasi insight
- 💡 **Rekomendasi Kebijakan** berbasis data
- 👥 **Manajemen Instansi** kontributor
- 📊 **Tracking Kualitas Data** keseluruhan

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Setup database schema
npx drizzle-kit push

# (Optional) Seed demo data
npm run seed

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📱 Navigasi Aplikasi

### Landing Page
- `/` - Dokumentasi sistem & penjelasan fitur

### Dashboard Instansi
- `/dashboard` - Overview statistik pengajuan
- `/dashboard/upload` - Form upload dataset baru
- `/dashboard/my-datasets` - Kelola semua dataset
- `/dashboard/drafts` - Dataset draft
- `/dashboard/discussions` - Forum dengan Walidata

### Dashboard Walidata
- `/walidata` - Overview validasi & kualitas
- `/walidata/pending` - Dataset menunggu validasi
- `/walidata/validate/[id]` - Halaman review & validasi
- `/walidata/validated` - Dataset tervalidasi
- `/walidata/analytics` - Analitik & rekomendasi
- `/walidata/all-datasets` - Semua dataset

## 🗂️ Struktur Database

### Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `users` | User accounts (instansi/walidata/admin) |
| `instansi` | Master data instansi pemerintah |
| `datasets` | Dataset submissions dengan metadata |
| `dataset_categories` | Kategori dataset |
| `discussions` | Forum/komentar per dataset |
| `notifications` | Sistem notifikasi |
| `activity_logs` | Audit trail aktivitas |
| `data_quality_metrics` | Skor kualitas per dataset |

## 📋 Metadata Standar

Setiap dataset harus mengisi:

1. **Informasi Dasar**
   - Judul Dataset
   - Deskripsi
   - Kategori
   - Klasifikasi Akses
   - Tags/Label

2. **Metadata Standar**
   - Konsep
   - Definisi
   - Interpretasi
   - Metodologi
   - Satuan Data
   - Periode Data
   - Frekuensi Update

3. **Kamus Data**
   - Field name
   - Tipe data
   - Deskripsi
   - Contoh nilai

4. **File Dataset**
   - CSV, Excel, JSON, atau XML
   - Max 50MB

## 🔄 Alur Kerja

```
1. UPLOAD
   ↓
2. ISI METADATA
   ↓
3. FORUM DISKUSI (Walidata Review)
   ↓
4. VALIDASI (Approve/Reject + Scoring)
   ↓
5. PUBLIKASI
```

### Status Dataset

| Status | Deskripsi |
|--------|-----------|
| `draft` | Disimpan tapi belum diajukan |
| `pending` | Menunggu review Walidata |
| `validated` | Disetujui dengan skor kualitas |
| `rejected` | Ditolak dengan alasan |
| `published` | Tersedia untuk publik |

## 📊 Penilaian Kualitas Data

Walidata menilai dataset berdasarkan 4 dimensi:

1. **Kelengkapan** (25%) - Metadata lengkap, kamus data ada
2. **Akurasi** (25%) - Format valid, data konsisten
3. **Ketepatan Waktu** (25%) - Data up-to-date
4. **Konsistensi** (25%) - Standarisasi, no duplikasi

Skor keseluruhan: 0-100%

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Components**: Radix UI
- **Icons**: Lucide React
- **Language**: TypeScript

## 📚 API Routes

### Datasets
- `GET /api/datasets` - List datasets (with filters)
- `POST /api/datasets` - Create new dataset
- `GET /api/datasets/[id]` - Get dataset detail
- `PATCH /api/datasets/[id]` - Update dataset
- `POST /api/datasets/[id]/validate` - Validate/reject dataset

### Discussions
- `GET /api/discussions?datasetId=[id]` - Get discussions
- `POST /api/discussions` - Add comment

### Notifications
- `GET /api/notifications?userId=[id]` - Get notifications
- `PATCH /api/notifications` - Mark as read

### Stats
- `GET /api/stats` - Get statistics & analytics

## 🎨 Screenshots

### Landing Page
Dokumentasi lengkap sistem dengan penjelasan fitur

### Dashboard Instansi
- Overview pengajuan dataset
- Form upload dengan wizard 4 langkah
- Tracking status real-time

### Dashboard Walidata
- Review pending submissions
- Penilaian kualitas data
- Analytics & recommendations

## 🔐 Login & Authentication

**Sistem login sudah tersedia!** ✅

### Demo Credentials

Setelah seeding, akses `/login` dan gunakan:

**Instansi:**
- Email: `budi@dinkes.go.id`
- Password: `password123`

**Walidata:**
- Email: `walidata@kominfo.go.id`
- Password: `password123`

💡 **Tip:** Di halaman login, klik tombol "👤 Instansi" atau "👨‍💼 Walidata" untuk auto-fill credentials!

### Fitur Login
✅ JWT-based authentication  
✅ Password hashing dengan bcrypt  
✅ Session management (7 days)  
✅ Route protection middleware  
✅ Role-based access control  
✅ Register page untuk user baru  
✅ Logout functionality  

**Panduan lengkap:** [LOGIN_GUIDE.md](./LOGIN_GUIDE.md)

## 📖 Dokumentasi Lengkap

Lihat [DOCUMENTATION.md](./DOCUMENTATION.md) untuk:
- Struktur menu detail
- User flow lengkap
- Panduan fitur
- Best practices
- Roadmap future features

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat issue atau pull request.

## 📝 License

MIT License - feel free to use for your government data portal!

## 🙏 Acknowledgments

Dibuat untuk mendukung:
- ✅ Transformasi Digital Pemerintah
- ✅ Satu Data Indonesia
- ✅ Open Government Data
- ✅ Pembangunan Berbasis Data

---

**Developed with ❤️ for better government data management**
