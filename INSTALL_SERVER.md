# 🚀 Cara Install ke Server - Panduan Singkat

## 📌 3 Cara Termudah

### ⭐ CARA 1: Vercel (PALING MUDAH - 5 MENIT)

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# 2. Buka https://vercel.com
#    - Login dengan GitHub
#    - Import repository
#    - Add environment variable: DATABASE_URL
#    - Deploy!

# 3. Setup database di Supabase.com (gratis)
#    - Create project
#    - Copy database URL
#    - Paste di Vercel Environment Variables

# 4. Push schema
npx drizzle-kit push

# SELESAI! ✅
```

**Domain otomatis:** `https://nama-project.vercel.app`  
**SSL otomatis:** ✅ Gratis  
**Biaya:** Gratis untuk traffic normal

---

### 🖥️ CARA 2: VPS Ubuntu (Otomatis dengan Script)

```bash
# 1. Login ke VPS
ssh root@IP_SERVER_ANDA

# 2. Download & jalankan script auto-install
wget https://raw.githubusercontent.com/username/repo/main/scripts/deploy-vps.sh
chmod +x deploy-vps.sh
./deploy-vps.sh

# Script akan otomatis install:
# - Node.js 18
# - PostgreSQL
# - PM2
# - Nginx

# 3. Ikuti prompt untuk:
#    - Database name
#    - Database user
#    - Database password
#    - Git repository URL

# 4. Setup database
cd /var/www/dataset-portal
npx drizzle-kit push
npx ts-node scripts/seed.ts  # Optional: demo data

# 5. Start aplikasi
pm2 start npm --name dataset-portal -- start
pm2 save
pm2 startup  # Copy command yang muncul & jalankan

# 6. Setup Nginx
./scripts/setup-nginx.sh
# Masukkan domain Anda

# 7. Install SSL
apt install certbot python3-certbot-nginx
certbot --nginx -d domain-anda.com

# SELESAI! ✅
```

**Akses:** `https://domain-anda.com`  
**Biaya VPS:** $5-10/bulan (DigitalOcean, Linode, Vultr)

---

### 🐳 CARA 3: Docker (Paling Portable)

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Clone repository
git clone https://github.com/username/repo.git
cd repo

# 3. Build & run
docker-compose up -d

# 4. Setup database
docker-compose exec app npx drizzle-kit push
docker-compose exec app npx ts-node scripts/seed.ts

# SELESAI! ✅
```

**Akses:** `http://localhost:3000` atau `http://IP_SERVER:3000`

---

## 🔍 Detail Setiap Cara

### VERCEL (Recommended untuk Pemula)

**Kelebihan:**
- ✅ Gratis (sampai 100GB bandwidth/bulan)
- ✅ Setup super cepat (5 menit)
- ✅ Auto deploy dari Git
- ✅ SSL otomatis
- ✅ Global CDN
- ✅ Zero maintenance

**Langkah Detail:**

1. **Setup Database (Supabase)**
   - Buka https://supabase.com
   - Sign up gratis
   - "New Project"
   - Tunggu ~2 menit
   - Buka "Settings" > "Database"
   - Copy "Connection String"
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

2. **Deploy ke Vercel**
   - Buka https://vercel.com
   - Sign up dengan GitHub
   - "New Project" > Import dari GitHub
   - Pilih repository
   - Add Environment Variable:
     ```
     Name: DATABASE_URL
     Value: [paste connection string dari Supabase]
     ```
   - Click "Deploy"

3. **Setup Database Schema**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login & link
   vercel login
   vercel link
   
   # Push schema
   npx drizzle-kit push
   ```

4. **Seed Data (Optional)**
   ```bash
   npx ts-node scripts/seed.ts
   ```

5. **Custom Domain (Optional)**
   - Vercel Dashboard > Settings > Domains
   - Add domain: `portal.example.com`
   - Update DNS di registrar domain:
     ```
     Type: CNAME
     Name: portal
     Value: cname.vercel-dns.com
     ```

---

### VPS UBUNTU

**Spesifikasi Minimum:**
- 2GB RAM
- 2 CPU Core
- 20GB Storage
- Ubuntu 22.04 LTS

**Provider Recommended:**
- DigitalOcean ($6/bulan)
- Linode ($5/bulan)
- Vultr ($6/bulan)
- Hetzner ($5/bulan - Eropa)

**Setup Manual (Jika script gagal):**

```bash
# 1. Update sistem
apt update && apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 3. Install PostgreSQL
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# 4. Create database
sudo -u postgres psql
CREATE DATABASE dataset_portal;
CREATE USER dataset_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE dataset_portal TO dataset_user;
\q

# 5. Install PM2
npm install -g pm2

# 6. Clone & setup app
mkdir -p /var/www/dataset-portal
cd /var/www/dataset-portal
git clone https://github.com/username/repo.git .
npm install

# 7. Create .env
cat > .env << EOF
DATABASE_URL=postgresql://dataset_user:password123@localhost:5432/dataset_portal
NODE_ENV=production
PORT=3000
EOF

# 8. Build
npm run build

# 9. Push schema
npx drizzle-kit push

# 10. Start with PM2
pm2 start npm --name dataset-portal -- start
pm2 save
pm2 startup

# 11. Install Nginx
apt install -y nginx

# 12. Create Nginx config
nano /etc/nginx/sites-available/dataset-portal

# Paste config (lihat DEPLOYMENT_GUIDE.md)

# 13. Enable & restart
ln -s /etc/nginx/sites-available/dataset-portal /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 14. Setup firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# 15. Install SSL
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## 🗄️ Database Options

### 1. Supabase (Recommended - Gratis)
- URL: https://supabase.com
- Gratis: 500MB database, 2GB bandwidth
- Setup: 2 menit
- Features: Auto backup, dashboard UI

### 2. Neon (Serverless PostgreSQL)
- URL: https://neon.tech
- Gratis: 10GB storage
- Auto sleep saat idle (hemat resource)

### 3. Railway
- URL: https://railway.app
- Gratis tier bagus
- Easy setup

### 4. PostgreSQL di VPS
- Full control
- Unlimited size
- Perlu maintenance

---

## 📊 Perbandingan Biaya

| Platform | Setup | Biaya/Bulan | Maintenance |
|----------|-------|-------------|-------------|
| **Vercel + Supabase** | 5 min | $0 - $20 | Zero |
| **VPS DigitalOcean** | 30 min | $6 - $12 | Medium |
| **Railway** | 5 min | $0 - $20 | Low |
| **AWS/GCP** | 60 min | $10 - $50 | High |

---

## 🔐 Security Checklist

Setelah deploy:

- [ ] Ganti semua default password
- [ ] Enable firewall
- [ ] Install SSL certificate
- [ ] Setup automatic backups
- [ ] Disable root SSH login (VPS)
- [ ] Setup SSH key authentication (VPS)
- [ ] Configure fail2ban (VPS)
- [ ] Set proper file permissions
- [ ] Enable rate limiting
- [ ] Setup monitoring

---

## 🔧 Maintenance Scripts

**Backup Database:**
```bash
# Setup cron job untuk auto backup
chmod +x scripts/backup-database.sh

# Edit crontab
crontab -e

# Add line (backup setiap hari jam 2 pagi):
0 2 * * * /var/www/dataset-portal/scripts/backup-database.sh
```

**Update Aplikasi:**
```bash
cd /var/www/dataset-portal
git pull
npm install
npm run build
pm2 restart dataset-portal
```

**Monitor Logs:**
```bash
# PM2 logs
pm2 logs dataset-portal

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Database logs
tail -f /var/log/postgresql/postgresql-15-main.log
```

---

## 🆘 Troubleshooting

### App tidak bisa diakses

```bash
# Check app status
pm2 status
pm2 logs dataset-portal

# Check Nginx
systemctl status nginx
nginx -t

# Check port
netstat -tulpn | grep 3000

# Check firewall
ufw status
```

### Database error

```bash
# Check PostgreSQL
systemctl status postgresql

# Test connection
psql -U dataset_user -d dataset_portal -h localhost

# Check logs
tail -f /var/log/postgresql/postgresql-15-main.log
```

### 502 Bad Gateway (Nginx)

```bash
# Check if app running
pm2 status

# Restart app
pm2 restart dataset-portal

# Check Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

---

## 📞 Butuh Bantuan?

1. **Cek dokumentasi lengkap:** `DEPLOYMENT_GUIDE.md`
2. **Review logs:** `pm2 logs` atau Vercel dashboard
3. **Test database connection:** `psql -U user -d database`
4. **Verify environment variables:** `cat .env`

---

## 🎯 Quick Commands

```bash
# Start app
pm2 start npm --name dataset-portal -- start

# Restart app
pm2 restart dataset-portal

# Stop app
pm2 stop dataset-portal

# View logs
pm2 logs dataset-portal

# Monitor
pm2 monit

# List processes
pm2 list

# Backup database
./scripts/backup-database.sh

# Restore database
./scripts/restore-database.sh

# Update app
git pull && npm install && npm run build && pm2 restart dataset-portal
```

---

**Pilih cara yang paling sesuai dengan kebutuhan dan skill level Anda!**

- **Pemula:** Gunakan Vercel ⭐
- **Budget rendah:** VPS dengan script otomatis
- **Full control:** VPS setup manual
- **Portable:** Docker

**Good luck! 🚀**
