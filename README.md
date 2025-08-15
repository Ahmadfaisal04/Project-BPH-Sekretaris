# 📄 BPH Sekretaris - Sistem Pengelolaan Surat

> **Sistem Informasi Pengelolaan Surat untuk Badan Pengurus Harian (BPH) Computer Club Oriented Network, Utility And Technology (COCONUT)**

![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?logo=next.js)
![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)
![Material-UI](https://img.shields.io/badge/Material--UI-5.13.0-0081CB?logo=mui)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)

## 📋 Deskripsi Project

BPH Sekretaris adalah sistem informasi berbasis web yang dirancang khusus untuk mengelola surat masuk dan surat keluar di organisasi COCONUT. Sistem ini memiliki fitur lengkap mulai dari pembuatan surat, pengelolaan arsip, hingga pencetakan dokumen dengan template yang telah disesuaikan.

### ✨ Fitur Utama

- **🔐 Authentication System** - Login dengan role-based access (Ketua, Sekretaris, Anggota)
- **📨 Manajemen Surat Masuk** - Input, edit, dan tracking surat masuk
- **📤 Manajemen Surat Keluar** - Pembuatan surat dengan template otomatis
- **📁 Sistem Arsip** - Penyimpanan dan pencarian arsip surat
- **🖨️ Print System** - Cetak surat dengan format yang rapi
- **📊 Dashboard** - Overview statistik surat masuk dan keluar
- **🔍 Search & Filter** - Pencarian surat berdasarkan berbagai kriteria

### 📝 Template Surat yang Tersedia

1. **Surat Peringatan** - Template untuk surat peringatan kepada anggota
2. **Surat Keputusan** - Template SK untuk penetapan panitia kegiatan
3. **Surat Izin Kegiatan** - Template permohonan izin kegiatan
4. **Surat Izin Sosialisasi** - Template permohonan izin sosialisasi
5. **Surat Undangan** - Template undangan kegiatan organisasi

## 🏗️ Arsitektur Project

```
📦 BPH-Sekretaris/
├── 🔧 Backend/                 # Go API Server
│   ├── config/                 # Database configuration
│   ├── controller/             # HTTP controllers
│   ├── dto/                    # Data Transfer Objects
│   ├── middleware/             # Authentication middleware
│   ├── model/                  # Database models
│   ├── repository/             # Data access layer
│   ├── service/                # Business logic
│   └── main.go                 # Entry point
├── 🎨 Frontend/                # Next.js Web App
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (dashboard)/    # Dashboard pages
│   │   │   │   ├── arsipsurat/ # Archive management
│   │   │   │   ├── dashboard/  # Main dashboard
│   │   │   │   ├── suratkeluar/# Outgoing mail
│   │   │   │   └── suratmasuk/ # Incoming mail
│   │   │   └── login/          # Authentication
│   │   ├── components/         # Reusable components
│   │   ├── config/             # API configuration
│   │   ├── context/            # React contexts
│   │   └── services/           # API services
│   └── package.json
└── README.md                   # Project documentation
```

## 🚀 Quick Start

### Prerequisites

Pastikan Anda telah menginstal:

- **Node.js** 18+ dan **npm**
- **Go** 1.21+
- **MySQL** 8.0+
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/your-username/Project-BPH-Sekretaris.git
cd Project-BPH-Sekretaris
```

### 2. Setup Backend

```bash
cd Backend

# Install dependencies
go mod download

# Setup database configuration
cp .env.example .env
# Edit .env file dengan konfigurasi database Anda

# Run database migration
go run migrate_db.go

# Start backend server
go run main.go
```

Backend akan berjalan di: `http://localhost:8080`

### 3. Setup Frontend

```bash
cd ../Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:5800`

### 4. Default Login

```
Email: admin@bph.org
Password: admin123
Role: ketua
```

## 🛠️ Tech Stack

### Backend

- **Framework:** Gin (Go)
- **Database:** MySQL dengan GORM
- **Authentication:** JWT
- **Architecture:** Layered (Controller → Service → Repository)
- **Security:** bcrypt password hashing

### Frontend

- **Framework:** Next.js 14 (App Router)
- **UI Library:** Material-UI (MUI)
- **State Management:** React Context
- **Styling:** Emotion + Styled Components
- **Date Handling:** Day.js
- **HTTP Client:** Fetch API

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ketua','sekretaris','anggota') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Surat Masuk Table

```sql
CREATE TABLE surat_masuks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  no_surat VARCHAR(255) NOT NULL,
  asal_surat VARCHAR(255) NOT NULL,
  perihal TEXT NOT NULL,
  tanggal_surat DATE NOT NULL,
  tanggal_diterima DATE NOT NULL,
  file_surat VARCHAR(255),
  status ENUM('Baru','Arsip') DEFAULT 'Baru',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Surat Keluar Table

```sql
CREATE TABLE surat_keluars (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  no_surat VARCHAR(255) NOT NULL,
  tujuan_surat VARCHAR(255) NOT NULL,
  perihal TEXT NOT NULL,
  tanggal_surat DATE NOT NULL,
  tanggal_pembuatan DATE NOT NULL,
  file_surat VARCHAR(255),
  status ENUM('Draft','Terkirim','Arsip') DEFAULT 'Draft',
  tipe_surat VARCHAR(255),
  content LONGTEXT,
  -- Template-specific fields
  nama VARCHAR(255),
  nra VARCHAR(255),
  jabatan VARCHAR(255),
  kesalahan TEXT,
  periode VARCHAR(255),
  nama_kegiatan VARCHAR(255),
  tanggal_kegiatan DATE,
  waktu VARCHAR(255),
  tempat VARCHAR(255),
  penyelenggara VARCHAR(255),
  ttd_nama VARCHAR(255),
  ttd_nama_lengkap VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔗 API Endpoints

### Authentication

```
POST   /api/v1/auth/login        # User login
POST   /api/v1/auth/register     # User registration
```

### Surat Masuk

```
GET    /api/v1/surat-masuk       # Get all incoming mail
POST   /api/v1/surat-masuk       # Create new incoming mail
GET    /api/v1/surat-masuk/:id   # Get specific incoming mail
PUT    /api/v1/surat-masuk/:id   # Update incoming mail
DELETE /api/v1/surat-masuk/:id   # Delete incoming mail
```

### Surat Keluar

```
GET    /api/v1/surat-keluar      # Get all outgoing mail
POST   /api/v1/surat-keluar      # Create new outgoing mail
GET    /api/v1/surat-keluar/:id  # Get specific outgoing mail
PUT    /api/v1/surat-keluar/:id  # Update outgoing mail
DELETE /api/v1/surat-keluar/:id  # Delete outgoing mail
```

### Health Check

```
GET    /health                   # API health status
```

## 🎯 Cara Penggunaan

### 1. Dashboard

- Lihat statistik surat masuk dan keluar
- Monitor aktivitas terbaru
- Akses cepat ke semua fitur

### 2. Surat Masuk

- Klik "Tambah Surat" untuk input surat masuk baru
- Isi form: Nomor Surat, Tanggal, Perihal, Asal, dan Upload File
- Surat akan otomatis tersimpan ke arsip

### 3. Surat Keluar

- Klik "Tambah Surat" untuk membuat surat baru
- Pilih jenis surat dari template yang tersedia
- Isi form sesuai template yang dipilih
- Klik "Buat Surat" untuk generate preview
- Gunakan tombol "Simpan Surat" atau "Print Surat"

### 4. Arsip Surat

- Lihat semua arsip surat masuk dan keluar
- Gunakan fitur pencarian untuk menemukan surat tertentu
- Data diurutkan berdasarkan tanggal terbaru

## 🔧 Development

### Setup Development Environment

```bash
# Clone dan masuk ke direktori
git clone <repository-url>
cd Project-BPH-Sekretaris

# Setup Backend
cd Backend
go mod download
go run migrate_db.go
go run main.go

# Setup Frontend (terminal baru)
cd Frontend
npm install
npm run dev
```

### Available Scripts

#### Backend

```bash
go run main.go          # Start server
go run migrate_db.go    # Run database migration
go mod tidy             # Clean up dependencies
```

#### Frontend

```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run linter
```

## 🚀 Deployment

### Backend Deployment

1. Build aplikasi: `go build -o main main.go`
2. Upload binary ke server
3. Setup environment variables
4. Jalankan dengan process manager (PM2/Systemd)

### Frontend Deployment

1. Build aplikasi: `npm run build`
2. Upload folder `.next` dan `package.json`
3. Install dependencies: `npm install --production`
4. Start aplikasi: `npm run start`

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

### Development Guidelines

- Gunakan conventional commits
- Tulis tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Follow existing code style

## 📝 License

Project ini menggunakan [MIT License](LICENSE).

## 👥 Team

- **Developer:** Ahmad Faisal
- **Organization:** COCONUT (Computer Club Oriented Network, Utility And Technology)
- **Contact:** hello@coconut.or.id

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Buat [issue](https://github.com/your-username/Project-BPH-Sekretaris/issues) di GitHub
2. Email: hello@coconut.or.id
3. Telegram: @your-telegram

## 🔄 Changelog

### v1.0.0 (2025-01-15)

- ✨ Initial release
- 🔐 Authentication system
- 📨 Surat masuk management
- 📤 Surat keluar with templates
- 📁 Archive system
- 🖨️ Print functionality

---

<div align="center">

**Made with ❤️ by COCONUT Team**

[Website](https://www.coconut.or.id) • [Email](mailto:hello@coconut.or.id) • [GitHub](https://github.com/your-username)

</div>
