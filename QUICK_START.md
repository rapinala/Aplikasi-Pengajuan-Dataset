# 🚀 Quick Start Guide

## Setup dalam 5 Menit

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Pastikan PostgreSQL sudah running, lalu push schema:

```bash
npx drizzle-kit push
```

### 3. (Optional) Seed Demo Data

```bash
# Install ts-node jika belum
npm install -D ts-node

# Run seed script
npx ts-node scripts/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🎯 Demo Walkthrough

### Scenario 1: Mengajukan Dataset (Instansi)

1. **Buka** `/dashboard`
2. **Klik** "Upload Dataset" atau navigasi ke `/dashboard/upload`
3. **Ikuti Wizard 4 Langkah:**
   
   **Step 1 - Info Dasar:**
   - Judul: "Data Kependudukan 2024"
   - Deskripsi: "Data jumlah penduduk per kecamatan"
   - Kategori: Pilih "👥 Kependudukan"
   - Klasifikasi: "Publik"
   - Tags: Ketik "kependudukan" + Enter, "demografi" + Enter
   - **Klik Next**

   **Step 2 - Metadata:**
   - Konsep: "Jumlah penduduk berdasarkan wilayah"
   - Definisi: "Penduduk terdaftar dalam sistem kependudukan"
   - Interpretasi: "Angka menunjukkan total penduduk terdaftar"
   - Metodologi: "Data dari Dukcapil"
   - Satuan: Pilih "Jiwa"
   - Frekuensi: Pilih "Bulanan"
   - Periode: 2024-01 s/d 2024-12
   - **Klik Next**

   **Step 3 - Kamus Data:**
   - Field 1: 
     - Nama: "kecamatan"
     - Tipe: "text"
     - Deskripsi: "Nama kecamatan"
     - Contoh: "Kecamatan A"
   - Field 2:
     - Nama: "jumlah_penduduk"
     - Tipe: "number"
     - Deskripsi: "Total penduduk"
     - Contoh: "50000"
   - **Klik "Tambah Field"** untuk menambah field lain
   - **Klik Next**

   **Step 4 - Upload File:**
   - **Klik** "Pilih File" atau drag & drop file CSV/Excel
   - **Tunggu** upload selesai
   - **Pilih:**
     - "Simpan Draft" jika belum siap submit
     - "Ajukan untuk Validasi" jika siap direview
   
4. **Selesai!** Dataset berhasil diajukan
5. **Cek** di `/dashboard/my-datasets` untuk melihat status

---

### Scenario 2: Memvalidasi Dataset (Walidata)

1. **Buka** `/walidata`
2. **Lihat** section "Perlu Perhatian" - ada dataset pending
3. **Klik** "Validasi Sekarang" atau navigasi `/walidata/pending`
4. **Pilih** dataset untuk direview
5. **Di halaman validasi:**
   
   **Review:**
   - Baca metadata lengkap
   - Periksa kamus data
   - Download file untuk verifikasi (optional)
   
   **Diskusi (optional):**
   - Tambah komentar di sidebar jika ada pertanyaan
   - Tunggu response dari instansi
   
   **Keputusan:**
   
   **Jika APPROVE:**
   - Klik "Validasi Dataset"
   - Set quality scores:
     - Kelengkapan: 90%
     - Akurasi: 85%
     - Ketepatan Waktu: 88%
     - Konsistensi: 87%
   - Tambah notes: "Dataset lengkap dan berkualitas"
   - **Klik "Validasi Dataset"**
   
   **Jika REJECT:**
   - Klik "Tolak Dataset"
   - Isi alasan: "Metadata belum lengkap, mohon tambahkan interpretasi data"
   - **Klik "Tolak Dataset"**

6. **Selesai!** Instansi akan menerima notifikasi
7. **Lihat** analytics di `/walidata/analytics`

---

### Scenario 3: Melihat Analytics (Walidata/Pimpinan)

1. **Navigasi** ke `/walidata/analytics`
2. **Lihat Dashboard:**
   
   **Quality Metrics:**
   - Kelengkapan: 85%
   - Akurasi: 90%
   - Ketepatan Waktu: 78%
   - Konsistensi: 82%
   - **Overall: 84%**

   **Trend Pengajuan:**
   - Grafik menunjukkan tren 6 bulan terakhir
   - Identifikasi bulan dengan submission tertinggi

   **Distribusi Kategori:**
   - Lihat kategori mana yang paling banyak dataset
   - Identifikasi gap data

   **Rekomendasi Kebijakan:**
   - Baca insight otomatis
   - Area terlengkap → fokus analisis
   - Area kurang → dorong pengumpulan data

3. **Export** (future feature) untuk laporan ke pimpinan

---

## 📱 Navigasi Cepat

### Instansi

| Halaman | URL | Fungsi |
|---------|-----|--------|
| Dashboard | `/dashboard` | Overview |
| Upload | `/dashboard/upload` | Ajukan dataset baru |
| My Datasets | `/dashboard/my-datasets` | Kelola dataset |
| Drafts | `/dashboard/drafts` | Dataset draft |
| Forum | `/dashboard/discussions` | Diskusi dengan Walidata |

### Walidata

| Halaman | URL | Fungsi |
|---------|-----|--------|
| Dashboard | `/walidata` | Overview validasi |
| Pending | `/walidata/pending` | Dataset perlu review |
| Validate | `/walidata/validate/[id]` | Form validasi |
| Validated | `/walidata/validated` | Dataset approved |
| All Datasets | `/walidata/all-datasets` | Semua dataset |
| Analytics | `/walidata/analytics` | Dashboard insight |

---

## 🎨 UI Components

### Status Badges

- 🟢 **Validated** - Green badge
- 🟡 **Pending** - Yellow badge
- 🔴 **Rejected** - Red badge
- ⚪ **Draft** - Gray badge
- 🔵 **Published** - Blue badge

### Notification Icons

- 📬 **Submission** - Dataset baru diajukan
- ✅ **Validation** - Dataset divalidasi
- ❌ **Rejection** - Dataset ditolak
- 💬 **Comment** - Komentar baru

---

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL running
systemctl status postgresql

# Test connection
psql -U postgres -d app_db -c "SELECT 1"

# Reset database
npx drizzle-kit push --force
```

### Build Error

```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build
```

### Type Errors

```bash
# Regenerate types
npx next typegen

# Type check
npm run typecheck
```

---

## 📚 Resources

- **Full Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Project Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **API Reference**: Check `/api/*` routes
- **Schema Reference**: [src/db/schema.ts](./src/db/schema.ts)

---

## 🤝 Support

Jika ada pertanyaan atau issue:

1. Cek dokumentasi lengkap
2. Review error logs
3. Check database connection
4. Verify environment variables

---

## 🎯 Next Steps

Setelah setup berhasil:

1. ✅ Eksplorasi landing page
2. ✅ Test upload dataset (Instansi flow)
3. ✅ Test validasi (Walidata flow)
4. ✅ Lihat analytics dashboard
5. ✅ Test forum diskusi
6. ✅ Review quality metrics

**Selamat! Anda siap menggunakan Portal Dataset Pemerintah!** 🎉

---

**Catatan:** Demo menggunakan mock data. Dalam production:
- Implementasi proper authentication
- Setup email notifications
- Configure cloud file storage
- Add security layers
- Setup monitoring & logging
