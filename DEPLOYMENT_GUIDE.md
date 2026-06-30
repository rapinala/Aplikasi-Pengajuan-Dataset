# 🚀 Panduan Deployment ke Server

## Pilihan Platform Deployment

### 1. **Vercel (Paling Mudah - Recommended)** ⭐
### 2. **VPS/Dedicated Server (Ubuntu/CentOS)**
### 3. **Docker Container**
### 4. **Cloud Platform (AWS, Google Cloud, Azure)**

---

## 📦 Opsi 1: Deploy ke Vercel (Tercepat & Gratis)

### Kelebihan:
- ✅ Gratis untuk project kecil-menengah
- ✅ Setup 5 menit
- ✅ Auto SSL certificate
- ✅ CDN global
- ✅ Auto scaling
- ✅ Git integration

### Langkah-langkah:

#### A. Persiapan

1. **Push code ke GitHub/GitLab**
```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

2. **Setup PostgreSQL Database**

Pilihan database hosting:
- **Vercel Postgres** (mudah, terintegrasi)
- **Supabase** (gratis tier bagus)
- **Neon** (serverless PostgreSQL)
- **Railway** (mudah setup)

**Contoh: Supabase (Gratis)**
- Daftar di https://supabase.com
- Create new project
- Tunggu database provisioning (~2 menit)
- Copy **Connection String** dari Settings > Database
- Format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### B. Deploy ke Vercel

1. **Daftar/Login ke Vercel**
   - Buka https://vercel.com
   - Sign up dengan GitHub account

2. **Import Project**
   - Klik "Add New..." > "Project"
   - Pilih repository GitHub Anda
   - Klik "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Environment Variables**
   
   Tambahkan di "Environment Variables" section:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NODE_ENV=production
   ```

5. **Deploy**
   - Klik "Deploy"
   - Tunggu ~2-3 menit
   - Done! Aplikasi live di `https://your-project.vercel.app`

6. **Setup Database Schema**
   
   Setelah deploy pertama:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Link project
   vercel link
   
   # Push database schema
   npx drizzle-kit push
   
   # (Optional) Seed data
   npx ts-node scripts/seed.ts
   ```

7. **Custom Domain (Optional)**
   - Di Vercel Dashboard > Settings > Domains
   - Tambahkan domain Anda
   - Update DNS di provider domain Anda
   - Vercel auto-provision SSL

---

## 🖥️ Opsi 2: Deploy ke VPS/Server (Ubuntu 22.04)

### Persiapan Server

**Spesifikasi Minimum:**
- CPU: 2 core
- RAM: 2GB
- Storage: 20GB
- OS: Ubuntu 22.04 LTS

### A. Login ke Server

```bash
ssh root@your-server-ip
```

### B. Update System

```bash
apt update && apt upgrade -y
```

### C. Install Node.js 18+

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify
node -v  # Should be v18+
npm -v
```

### D. Install PostgreSQL

```bash
# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start service
systemctl start postgresql
systemctl enable postgresql

# Create database & user
sudo -u postgres psql

# Di PostgreSQL prompt:
CREATE DATABASE dataset_portal;
CREATE USER dataset_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE dataset_portal TO dataset_user;
ALTER DATABASE dataset_portal OWNER TO dataset_user;
\q
```

### E. Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### F. Setup Aplikasi

```bash
# Create app directory
mkdir -p /var/www/dataset-portal
cd /var/www/dataset-portal

# Clone repository (atau upload via SFTP)
git clone https://github.com/username/repo-name.git .

# Install dependencies
npm install

# Create .env file
nano .env
```

**Isi .env:**
```env
DATABASE_URL=postgresql://dataset_user:strong_password_here@localhost:5432/dataset_portal
NODE_ENV=production
PORT=3000
```

```bash
# Build aplikasi
npm run build

# Push database schema
npx drizzle-kit push

# (Optional) Seed data
npx ts-node scripts/seed.ts
```

### G. Start dengan PM2

```bash
# Start aplikasi
pm2 start npm --name "dataset-portal" -- start

# Save PM2 config
pm2 save

# Auto-start on server reboot
pm2 startup
# Copy-paste command yang muncul, lalu jalankan

# Check status
pm2 status
pm2 logs dataset-portal
```

### H. Install & Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install -y nginx

# Create Nginx config
nano /etc/nginx/sites-available/dataset-portal
```

**Isi config:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/dataset-portal /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

### I. Install SSL (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already configured by certbot)
certbot renew --dry-run
```

### J. Setup Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

### K. Monitoring & Maintenance

```bash
# View logs
pm2 logs dataset-portal

# Restart app
pm2 restart dataset-portal

# Monitor resources
pm2 monit

# Update aplikasi
cd /var/www/dataset-portal
git pull
npm install
npm run build
pm2 restart dataset-portal
```

---

## 🐳 Opsi 3: Deploy dengan Docker

### A. Create Dockerfile

```bash
# Create file di root project
nano Dockerfile
```

**Isi Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### B. Update next.config.ts

```typescript
// Add this to next.config.ts
const nextConfig = {
  output: 'standalone',
  // ... existing config
}
```

### C. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/dataset_portal
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=dataset_portal
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### D. Build & Run

```bash
# Build image
docker-compose build

# Start containers
docker-compose up -d

# Check logs
docker-compose logs -f app

# Push database schema
docker-compose exec app npx drizzle-kit push

# Seed data (optional)
docker-compose exec app npx ts-node scripts/seed.ts

# Stop containers
docker-compose down
```

---

## ☁️ Opsi 4: Deploy ke Cloud Platform

### A. **Railway (Mudah & Gratis)**

1. Daftar di https://railway.app
2. "New Project" > "Deploy from GitHub"
3. Pilih repository
4. Add PostgreSQL service
5. Set environment variables
6. Deploy otomatis

### B. **DigitalOcean App Platform**

1. Daftar di https://www.digitalocean.com
2. Create App > GitHub repo
3. Add Managed PostgreSQL Database
4. Configure environment variables
5. Deploy

### C. **AWS (EC2 + RDS)**

1. Launch EC2 instance (Ubuntu)
2. Create RDS PostgreSQL database
3. Follow langkah VPS di atas
4. Configure Security Groups

---

## 🔧 Post-Deployment Checklist

### Security

- [ ] Setup firewall (UFW/Security Groups)
- [ ] Enable SSL/HTTPS
- [ ] Change default passwords
- [ ] Setup SSH key authentication
- [ ] Disable root SSH login
- [ ] Setup fail2ban (untuk VPS)
- [ ] Regular security updates

### Performance

- [ ] Enable Nginx gzip compression
- [ ] Setup CDN untuk static assets
- [ ] Configure database connection pooling
- [ ] Setup Redis cache (optional)
- [ ] Enable Next.js image optimization

### Monitoring

- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Setup analytics (Google Analytics, Plausible)
- [ ] Database backup automation
- [ ] PM2 monitoring (untuk VPS)

### Backup

```bash
# Database backup script
nano /root/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

pg_dump -U dataset_user dataset_portal > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /root/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /root/backup-db.sh
```

---

## 🆘 Troubleshooting

### App tidak bisa diakses

```bash
# Check PM2 status
pm2 status
pm2 logs dataset-portal

# Check Nginx
systemctl status nginx
nginx -t

# Check firewall
ufw status
```

### Database connection error

```bash
# Check PostgreSQL
systemctl status postgresql

# Test connection
psql -U dataset_user -d dataset_portal -h localhost

# Check credentials in .env
cat /var/www/dataset-portal/.env
```

### Build error

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

---

## 📊 Perbandingan Platform

| Platform | Kemudahan | Biaya | Performa | Maintenance |
|----------|-----------|-------|----------|-------------|
| **Vercel** | ⭐⭐⭐⭐⭐ | Gratis/Murah | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **VPS** | ⭐⭐⭐ | Murah | ⭐⭐⭐⭐ | ⭐⭐ |
| **Docker** | ⭐⭐⭐⭐ | Varies | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Railway** | ⭐⭐⭐⭐⭐ | Gratis/Murah | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **AWS** | ⭐⭐ | Mahal | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## 💡 Rekomendasi

### Untuk Development/Testing
→ **Vercel** atau **Railway** (gratis, cepat setup)

### Untuk Production Skala Kecil-Menengah
→ **Vercel** dengan database managed (Supabase/Neon)

### Untuk Production Skala Besar/Enterprise
→ **VPS** (DigitalOcean, Linode) atau **AWS**

### Untuk Full Control
→ **VPS dengan Docker**

---

## 📞 Support

Jika ada masalah saat deployment:

1. Cek logs: `pm2 logs` (VPS) atau Vercel dashboard
2. Verify environment variables
3. Test database connection
4. Check firewall/security groups
5. Review Nginx configuration (untuk VPS)

**Selamat! Aplikasi Anda sekarang live di internet! 🎉**
