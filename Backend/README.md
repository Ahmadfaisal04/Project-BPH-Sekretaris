# BPH Sekretaris - Backend API

Backend API untuk sistem penarsipan surat sederhana dengan arsitektur layered menggunakan Golang dan Gin framework.

## 🚀 Fitur

- **Authentication & Authorization** - JWT-based authentication dengan role-based access
- **Manajemen Surat Masuk** - CRUD operations untuk surat masuk
- **Manajemen Surat Keluar** - CRUD operations untuk surat keluar
- **Sistem Arsip** - Pengelolaan arsip surat masuk dan keluar
- **RESTful API** - API endpoints yang konsisten dan mudah digunakan
- **Layered Architecture** - Clean code dengan separation of concerns

## 🛠️ Tech Stack

- **Language:** Go 1.21+
- **Framework:** Gin
- **Database:** MySQL
- **ORM:** GORM
- **Authentication:** JWT
- **Password Hashing:** bcrypt

## 📁 Struktur Project

```
project-bph-sekretaris/
├── config/           # Database configuration
├── controller/       # HTTP controllers
├── dto/             # Data Transfer Objects
├── middleware/      # HTTP middlewares
├── model/           # Database models
├── repository/      # Data access layer
├── service/         # Business logic layer
├── migrate/         # Database migration
├── main.go          # Application entry point
├── go.mod           # Go dependencies
└── README.md        # Documentation
```

## 🔧 Installation & Setup

### Prerequisites

- Go 1.21 atau lebih baru
- MySQL 5.7+ atau MariaDB
- Git

### 1. Clone Repository

```bash
git clone https://github.com/Ahmadfaisal04/Riset-BPH.git
cd Riset-BPH
```

### 2. Install Dependencies

```bash
go mod download
```

### 3. Environment Configuration

Buat file `.env` dengan konfigurasi database:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_databases
# Server Configuration
PORT=8080

# JWT Secret Key (ubah di production)
JWT_SECRET=your-secret-key-here
```


### 4. Run Application

```bash
go run main.go
```

Server akan berjalan di `http://localhost:8080`

## 📱 Testing API

Anda dapat mengakses dan menguji API melalui:

- **Backend API:** http://localhost:8080

Login dengan kredensial default:

- Email: `admin@bph.org`
- Password: `admin123`

## 📚 API Documentation

### Authentication

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Nama User",
  "email": "user@example.com",
  "password": "password123",
  "role": "ketua|sekretaris|anggota"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@bph.org",
  "password": "admin123"
}
```

Response:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "Administrator",
      "email": "admin@bph.org",
      "role": "ketua"
    }
  }
}
```

### Surat Masuk

#### Create Surat Masuk

```http
POST /api/v1/surat-masuk
Authorization: Bearer <token>
Content-Type: application/json

{
  "no_surat": "SM/001/2025",
  "asal_surat": "Kementerian Pendidikan",
  "perihal": "Undangan Rapat Koordinasi",
  "tanggal_surat": "2025-08-01T00:00:00Z",
  "tanggal_diterima": "2025-08-01T00:00:00Z",
  "file_surat": "surat_masuk_001.pdf",
  "status": "Baru"
}
```

#### Get All Surat Masuk

```http
GET /api/v1/surat-masuk
Authorization: Bearer <token>
```

#### Get Surat Masuk by ID

```http
GET /api/v1/surat-masuk/:id
Authorization: Bearer <token>
```

#### Update Surat Masuk

```http
PUT /api/v1/surat-masuk/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Arsip"
}
```

#### Delete Surat Masuk

```http
DELETE /api/v1/surat-masuk/:id
Authorization: Bearer <token>
```

#### Filter by Status

```http
GET /api/v1/surat-masuk/status?status=Baru
Authorization: Bearer <token>
```

### Surat Keluar

#### Create Surat Keluar

```http
POST /api/v1/surat-keluar
Authorization: Bearer <token>
Content-Type: application/json

{
  "no_surat": "SK/001/2025",
  "tujuan_surat": "Dinas Pendidikan Provinsi",
  "perihal": "Laporan Kegiatan Bulanan",
  "tanggal_surat": "2025-08-01T00:00:00Z",
  "file_surat": "surat_keluar_001.pdf",
  "status": "Draft"
}
```

Endpoints lainnya sama seperti Surat Masuk, ganti `/surat-masuk` dengan `/surat-keluar`.

Status yang valid: `Draft`, `Terkirim`, `Arsip`

### Arsip Surat

#### Create Arsip Surat

```http
POST /api/v1/arsip-surat
Authorization: Bearer <token>
Content-Type: application/json

{
  "surat_id": 1,
  "tipe_surat": "masuk",
  "keterangan": "Arsip surat undangan rapat koordinasi"
}
```

#### Get All Arsip Surat

```http
GET /api/v1/arsip-surat
Authorization: Bearer <token>
```

#### Filter by Tipe Surat

```http
GET /api/v1/arsip-surat/tipe?tipe_surat=masuk
Authorization: Bearer <token>
```

Tipe surat yang valid: `masuk`, `keluar`

### Health Check

```http
GET /health
```

## 🧪 Testing

Script ini akan menguji semua endpoint secara otomatis.

### Manual Testing dengan curl

```bash
# Health check
curl http://localhost:8080/health

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bph.org","password":"admin123"}'

# Get surat masuk (ganti <token> dengan JWT token dari login)
curl -X GET http://localhost:8080/api/v1/surat-masuk \
  -H "Authorization: Bearer <token>"
```

## 🗃️ Database Schema

### Users Table

- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `role` (VARCHAR) - ketua, sekretaris, anggota
- `created_at` (TIMESTAMP)

### Surat Masuk Table

- `id` (Primary Key)
- `no_surat` (VARCHAR)
- `asal_surat` (VARCHAR)
- `perihal` (TEXT)
- `tanggal_surat` (DATE)
- `tanggal_diterima` (DATE)
- `file_surat` (VARCHAR)
- `status` (VARCHAR) - Baru, Arsip
- `created_by` (Foreign Key to Users)
- `created_at` (TIMESTAMP)

### Surat Keluar Table

- `id` (Primary Key)
- `no_surat` (VARCHAR)
- `tujuan_surat` (VARCHAR)
- `perihal` (TEXT)
- `tanggal_surat` (DATE)
- `file_surat` (VARCHAR)
- `status` (VARCHAR) - Draft, Terkirim, Arsip
- `created_by` (Foreign Key to Users)
- `created_at` (TIMESTAMP)

### Arsip Surat Table

- `id` (Primary Key)
- `surat_id` (INTEGER)
- `tipe_surat` (VARCHAR) - masuk, keluar
- `keterangan` (TEXT)
- `diarsipkan_oleh` (Foreign Key to Users)
- `tanggal_arsip` (TIMESTAMP)

## 🔒 Security

- **JWT Authentication** - Semua endpoint (kecuali auth) memerlukan JWT token
- **Password Hashing** - Password di-hash menggunakan bcrypt
- **Role-based Access** - Sistem role untuk kontrol akses
- **CORS** - Configured untuk frontend integration
