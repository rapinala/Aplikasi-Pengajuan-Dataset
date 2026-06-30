# 🎯 Quick Reference - Portal Dataset

## 🔐 Login & Access

### Login Page
```
URL: http://localhost:3000/login
```

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Instansi | budi@dinkes.go.id | password123 |
| Walidata | walidata@kominfo.go.id | password123 |

💡 **Quick Fill:** Klik tombol demo di halaman login!

---

## 📱 Halaman Utama

### Landing Page
```
/                  → Dokumentasi & info sistem
```

### Auth Pages
```
/login             → Login page
/register          → Register user baru
```

### Dashboard Instansi
```
/dashboard         → Home dashboard
/dashboard/upload  → Upload dataset baru (4-step wizard)
/dashboard/my-datasets  → List & manage datasets
/dashboard/drafts  → Dataset draft
/dashboard/discussions  → Forum dengan Walidata
```

### Dashboard Walidata
```
/walidata          → Home dashboard
/walidata/pending  → Dataset menunggu validasi
/walidata/validate/[id]  → Form review & validasi
/walidata/validated  → Dataset tervalidasi
/walidata/analytics  → Dashboard analitik
/walidata/all-datasets  → Semua dataset
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login       → Login
POST /api/auth/register    → Register
POST /api/auth/logout      → Logout
GET  /api/auth/me          → Get current user
```

### Datasets
```
GET    /api/datasets           → List datasets (+ filters)
POST   /api/datasets           → Create dataset
GET    /api/datasets/[id]      → Get detail
PATCH  /api/datasets/[id]      → Update dataset
DELETE /api/datasets/[id]      → Delete dataset
POST   /api/datasets/[id]/validate  → Validate/reject
```

### Others
```
GET  /api/discussions      → Get discussions
POST /api/discussions      → Add comment
GET  /api/notifications    → Get notifications
GET  /api/stats            → Get statistics
GET  /api/health           → Health check
```

---

## 🛠️ Quick Commands

### Development
```bash
# Install dependencies
npm install

# Setup database
npx drizzle-kit push

# Seed demo data
npx ts-node scripts/seed.ts

# Run dev server
npm run dev

# Type check
npm run typecheck

# Build production
npm run build

# Start production
npm start
```

### Production (VPS with PM2)
```bash
# Start app
pm2 start npm --name dataset-portal -- start

# Restart
pm2 restart dataset-portal

# Stop
pm2 stop dataset-portal

# Logs
pm2 logs dataset-portal

# Monitor
pm2 monit

# List processes
pm2 list
```

### Database
```bash
# Backup
./scripts/backup-database.sh

# Restore
./scripts/restore-database.sh

# Connect to DB
psql -U dataset_user -d dataset_portal

# Reset DB
npx drizzle-kit push --force
npx ts-node scripts/seed.ts
```

---

## 📊 Database Tables

```
users              → User accounts
instansi           → Instansi pemerintah
datasets           → Dataset submissions
dataset_categories → Kategori dataset
discussions        → Forum comments
notifications      → User notifications
activity_logs      → Audit trail
data_quality_metrics  → Quality scores
```

---

## 🎨 Status Dataset

| Status | Warna | Deskripsi |
|--------|-------|-----------|
| draft | Gray | Belum diajukan |
| pending | Yellow | Menunggu validasi |
| validated | Green | Disetujui Walidata |
| rejected | Red | Ditolak |
| published | Blue | Tersedia publik |

---

## 📝 Metadata Wajib

### Informasi Dasar
- Judul Dataset
- Deskripsi
- Kategori
- Klasifikasi (Publik/Terbatas/Rahasia)
- Tags

### Metadata Standar
- Konsep
- Definisi
- Interpretasi
- Metodologi
- Satuan Data
- Periode Data
- Frekuensi Update

### Kamus Data
- Nama Field
- Tipe Data
- Deskripsi
- Contoh (optional)

### File
- Format: CSV, Excel, JSON, XML
- Max size: 50MB

---

## 🔒 Security

### Password
- Hashing: bcrypt (10 rounds)
- Min length: 6 characters
- Tidak disimpan plain text

### Session
- Type: JWT
- Expiry: 7 days
- Storage: HTTP-only cookie
- Algorithm: HS256

### Route Protection
- Middleware: Active
- Protected: /dashboard, /walidata
- Role-based: Instansi ≠ Walidata

---

## 🚀 Deployment Quick Start

### Vercel (5 menit)
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy
vercel login
vercel

# 3. Add env vars in Vercel dashboard
DATABASE_URL=...
JWT_SECRET=...

# 4. Push schema
npx drizzle-kit push
```

### VPS (30 menit)
```bash
# 1. SSH to server
ssh root@IP_ADDRESS

# 2. Run auto-deploy script
./scripts/deploy-vps.sh

# 3. Setup Nginx
./scripts/setup-nginx.sh

# 4. SSL
certbot --nginx -d domain.com
```

---

## 🆘 Troubleshooting

### Login tidak bisa
```bash
# Re-seed with hashed password
npx ts-node scripts/seed.ts
```

### Session hilang
```bash
# Check .env
cat .env | grep JWT_SECRET

# Restart server
pm2 restart dataset-portal
```

### Database error
```bash
# Check connection
psql -U dataset_user -d dataset_portal -h localhost

# Re-push schema
npx drizzle-kit push
```

### Build error
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Support

| Issue | Check File |
|-------|-----------|
| Login problems | [LOGIN_GUIDE.md](./LOGIN_GUIDE.md) |
| Server install | [INSTALL_SERVER.md](./INSTALL_SERVER.md) |
| Development | [QUICK_START.md](./QUICK_START.md) |
| Features | [DOCUMENTATION.md](./DOCUMENTATION.md) |
| Deployment | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) |

---

## ✅ Checklist Setup

### Local Development
- [ ] Clone repository
- [ ] `npm install`
- [ ] Setup PostgreSQL
- [ ] Update `.env`
- [ ] `npx drizzle-kit push`
- [ ] `npx ts-node scripts/seed.ts`
- [ ] `npm run dev`
- [ ] Test login `/login`

### Production Deployment
- [ ] Choose platform (Vercel/VPS)
- [ ] Setup production database
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Push database schema
- [ ] Seed initial data
- [ ] Setup domain & SSL
- [ ] Test all features
- [ ] Configure backups

---

## 🎯 Common Tasks

### Add new user
```
1. Go to /register
2. Fill form
3. Login with new credentials
```

### Reset password
```bash
# Manual reset in DB
UPDATE users 
SET password = '$2a$10$...'  -- bcrypt hash
WHERE email = 'user@example.com';
```

### View logs
```bash
# PM2 logs
pm2 logs dataset-portal

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Update app
```bash
git pull
npm install
npm run build
pm2 restart dataset-portal
```

---

**Keep this page bookmarked for quick reference! 🔖**
