# 🔐 Panduan Login & Autentikasi

## ✅ Sistem Login Sudah Dibuat!

Sistem autentikasi lengkap dengan login, register, dan session management telah berhasil diimplementasikan.

---

## 🎯 Fitur yang Tersedia

### ✅ **Login Page** (`/login`)
- Form login dengan email & password
- Validation error handling
- Loading state
- Demo credentials quick-fill
- Redirect based on role (Instansi → /dashboard, Walidata → /walidata)

### ✅ **Register Page** (`/register`)
- Form registrasi lengkap
- Role selection (Instansi/Walidata)
- Instansi dropdown (untuk role instansi)
- Password confirmation
- Email uniqueness check
- Success message & auto-redirect

### ✅ **Session Management**
- JWT-based authentication
- 7-day session expiry
- HTTP-only cookies (secure)
- Auto session refresh

### ✅ **Route Protection**
- Middleware untuk protect routes
- Automatic redirect ke /login jika belum login
- Role-based access control
- Auto-redirect based on role

### ✅ **Logout**
- Logout button di Navbar
- Clear session & cookies
- Redirect ke login page

---

## 🚀 Cara Menggunakan

### 1. **Akses Login Page**

Buka browser dan navigasi ke:
```
http://localhost:3000/login
```

### 2. **Demo Credentials**

Untuk testing cepat, klik tombol demo:

**Instansi:**
- Email: `budi@dinkes.go.id`
- Password: `password123`
- Redirect ke: `/dashboard`

**Walidata:**
- Email: `walidata@kominfo.go.id`
- Password: `password123`
- Redirect ke: `/walidata`

### 3. **Registrasi User Baru**

1. Klik "Daftar di sini" atau navigasi ke `/register`
2. Isi form:
   - Nama Lengkap
   - Email (format: nama@instansi.go.id)
   - Role (Instansi/Walidata)
   - Instansi (jika role = Instansi)
   - Password (min 6 karakter)
   - Konfirmasi Password
3. Klik "Daftar"
4. Setelah sukses, otomatis redirect ke `/login`
5. Login dengan credential yang baru dibuat

### 4. **Logout**

1. Klik nama user di navbar (kanan atas)
2. Klik "Logout"
3. Session dihapus & redirect ke `/login`

---

## 🔒 Security Features

### ✅ **Password Hashing**
- Menggunakan bcryptjs
- Salt rounds: 10
- Password TIDAK disimpan plain text di database

### ✅ **JWT Token**
- Algorithm: HS256
- Expiry: 7 days
- Payload: userId, email, name, role, instansiId

### ✅ **HTTP-only Cookies**
- Cookie name: `session`
- HttpOnly: true (tidak bisa diakses JavaScript)
- Secure: true (production only)
- SameSite: lax

### ✅ **Route Protection**
- Middleware check di setiap request
- Protected routes: `/dashboard/*`, `/walidata/*`
- Auto-redirect jika tidak ada session

### ✅ **Role-based Access**
- Instansi hanya bisa akses `/dashboard`
- Walidata hanya bisa akses `/walidata`
- Auto-redirect jika salah akses

---

## 📁 File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Register page
│   └── api/
│       └── auth/
│           ├── login/route.ts    # Login API
│           ├── register/route.ts # Register API
│           ├── logout/route.ts   # Logout API
│           └── me/route.ts       # Get current user
├── lib/
│   └── auth.ts                   # Auth utilities (JWT, session)
├── components/
│   └── Navbar.tsx                # Updated with logout
└── middleware.ts                 # Route protection
```

---

## 🔧 Konfigurasi

### Environment Variables (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
```

⚠️ **PENTING:** Ganti `JWT_SECRET` di production dengan string random minimal 32 karakter!

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing

### Test Login Flow

1. **Buka** `http://localhost:3000`
2. **Klik** "Login Instansi" atau "Login Walidata"
3. **Otomatis** redirect ke `/login`
4. **Klik** tombol demo "👤 Instansi" atau "👨‍💼 Walidata"
5. **Klik** "Login"
6. **Verify** redirect ke dashboard sesuai role
7. **Check** nama user muncul di navbar
8. **Klik** user menu > Logout
9. **Verify** redirect ke `/login`

### Test Register Flow

1. **Navigasi** ke `/register`
2. **Isi** form dengan data baru
3. **Submit** form
4. **Verify** success message
5. **Wait** auto-redirect ke `/login`
6. **Login** dengan credential baru
7. **Verify** masuk ke dashboard

### Test Route Protection

1. **Logout** (jika sudah login)
2. **Coba akses** `http://localhost:3000/dashboard`
3. **Verify** otomatis redirect ke `/login`
4. **Login** sebagai Instansi
5. **Coba akses** `http://localhost:3000/walidata`
6. **Verify** otomatis redirect ke `/dashboard`

---

## 📊 Database Schema

Password di-hash sebelum disimpan:

```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  role user_role NOT NULL,
  instansi_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 Session Flow

```
┌─────────────┐
│   Login     │
│  /api/auth/ │
│    login    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Verify     │
│  Password   │
│  (bcrypt)   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Create     │
│  JWT Token  │
│  (7 days)   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Set Cookie │
│  (HttpOnly) │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Redirect   │
│  Dashboard  │
└─────────────┘
```

---

## 🛡️ Middleware Protection

```typescript
// middleware.ts
const protectedRoutes = ['/dashboard', '/walidata']

if (isProtectedRoute && !session) {
  redirect('/login')
}

if (path.startsWith('/dashboard') && role === 'walidata') {
  redirect('/walidata')
}

if (path.startsWith('/walidata') && role === 'instansi') {
  redirect('/dashboard')
}
```

---

## 🚨 Troubleshooting

### Login gagal meskipun credentials benar

**Penyebab:** Password belum di-hash di database

**Solusi:**
```bash
# Re-seed database dengan password ter-hash
npx drizzle-kit push --force
npx ts-node scripts/seed.ts
```

### Session hilang setelah refresh

**Penyebab:** Cookie settings tidak tepat

**Solusi:** Check `.env` dan pastikan `JWT_SECRET` ada

### Tidak bisa akses protected routes

**Penyebab:** Middleware tidak jalan

**Solusi:** 
1. Check `middleware.ts` exists
2. Restart dev server: `npm run dev`
3. Clear browser cookies

### "Email sudah terdaftar" saat register

**Penyebab:** Email sudah ada di database

**Solusi:** 
- Gunakan email berbeda
- Atau hapus user dari database:
```sql
DELETE FROM users WHERE email = 'email@example.com';
```

---

## 📝 Demo Accounts

Setelah seed, tersedia akun demo:

| Email | Password | Role | Akses |
|-------|----------|------|-------|
| budi@dinkes.go.id | password123 | Instansi | /dashboard |
| siti@dindik.go.id | password123 | Instansi | /dashboard |
| walidata@kominfo.go.id | password123 | Walidata | /walidata |
| validator@bappeda.go.id | password123 | Walidata | /walidata |

---

## 🔐 Production Checklist

Sebelum deploy ke production:

- [ ] Ganti `JWT_SECRET` dengan random string 32+ chars
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set cookie `secure: true` di production
- [ ] Implement rate limiting untuk login API
- [ ] Add CSRF protection
- [ ] Implement "Forgot Password" flow
- [ ] Add email verification
- [ ] Enable 2FA (optional)
- [ ] Add login attempt limiting
- [ ] Setup audit logs
- [ ] Implement session revocation
- [ ] Add "Remember Me" feature

---

## 🎯 Next Features (Optional)

### Email Verification
- Send verification email saat register
- User harus verify email sebelum login

### Forgot Password
- Form "Lupa Password" di login page
- Send reset link via email
- Update password dengan token

### Social Login
- Login dengan Google
- Login dengan Microsoft (untuk gov email)

### 2FA (Two-Factor Authentication)
- OTP via SMS
- OTP via Email
- Authenticator app (Google Authenticator)

### Session Management
- View active sessions
- Revoke specific session
- "Logout from all devices"

---

## 📞 API Endpoints

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "instansi",
    "instansiId": 1
  }
}
```

**Response (Error):**
```json
{
  "error": "Email atau password salah"
}
```

---

### POST `/api/auth/register`
**Request:**
```json
{
  "name": "New User",
  "email": "new@example.com",
  "password": "password123",
  "role": "instansi",
  "instansiId": 1
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 5,
    "email": "new@example.com",
    "name": "New User",
    "role": "instansi"
  }
}
```

---

### POST `/api/auth/logout`
**Response:**
```json
{
  "success": true
}
```

---

### GET `/api/auth/me`
**Response (Logged in):**
```json
{
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "instansi",
    "instansiId": 1
  }
}
```

**Response (Not logged in):**
```json
{
  "user": null
}
```

---

## ✅ Status

**Login System:** ✅ Fully Functional  
**Register:** ✅ Working  
**Session:** ✅ JWT-based  
**Route Protection:** ✅ Middleware active  
**Role-based Access:** ✅ Implemented  
**Password Security:** ✅ Bcrypt hashed  
**Logout:** ✅ Working  

---

**Sistem login sudah 100% siap digunakan! 🎉**

Login credentials ada di halaman `/login` dengan tombol demo untuk quick testing.
