package model

import (
	"time"
)

type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"type:varchar(255);not null"`
	Email        string    `json:"email" gorm:"type:varchar(255);unique;not null"`
	PasswordHash string    `json:"-" gorm:"type:varchar(255);not null"`
	Role         string    `json:"role" gorm:"type:varchar(50);not null;comment:'ketua, sekretaris, anggota'"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
}

type SuratMasuk struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	NoSurat         string    `json:"no_surat" gorm:"type:varchar(255);not null"`
	AsalSurat       string    `json:"asal_surat" gorm:"type:varchar(255);not null"`
	Perihal         string    `json:"perihal" gorm:"type:text;not null"`
	TanggalSurat    time.Time `json:"tanggal_surat" gorm:"type:date;not null"`
	TanggalDiterima time.Time `json:"tanggal_diterima" gorm:"type:date;not null"`
	FileSurat       string    `json:"file_surat" gorm:"type:varchar(255)"`
	Status          string    `json:"status" gorm:"type:varchar(50);not null;default:'Baru';comment:'Baru, Arsip'"`
	CreatedBy       uint      `json:"created_by" gorm:"not null"`
	CreatedAt       time.Time `json:"created_at" gorm:"autoCreateTime"`

	// Relations
	Creator User `json:"creator" gorm:"foreignKey:CreatedBy;references:ID"`
}

type SuratKeluar struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	NoSurat      string    `json:"no_surat" gorm:"type:varchar(255);not null"`
	TujuanSurat  string    `json:"tujuan_surat" gorm:"type:varchar(255);not null"`
	Perihal      string    `json:"perihal" gorm:"type:text;not null"`
	TanggalSurat time.Time `json:"tanggal_surat" gorm:"type:date;not null"`
	FileSurat    string    `json:"file_surat" gorm:"type:varchar(255)"`
	Status       string    `json:"status" gorm:"type:varchar(50);not null;default:'Draft';comment:'Draft, Terkirim, Arsip'"`
	CreatedBy    uint      `json:"created_by" gorm:"not null"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`

	// Template fields for different types of letters
	TipeSurat string `json:"tipe_surat" gorm:"type:varchar(100);comment:'Surat Peringatan, Surat Keputusan, Surat Izin Kegiatan'"`
	Lampiran  string `json:"lampiran" gorm:"type:varchar(255)"`

	// Fields for Surat Peringatan
	Nama      string `json:"nama" gorm:"type:varchar(255)"`
	NRA       string `json:"nra" gorm:"type:varchar(50)"`
	Jabatan   string `json:"jabatan" gorm:"type:varchar(255)"`
	Kesalahan string `json:"kesalahan" gorm:"type:text"`

	// Fields for Surat Keputusan
	Periode                    string `json:"periode" gorm:"type:varchar(50)"`
	NamaKegiatan               string `json:"nama_kegiatan" gorm:"type:varchar(255)"`
	KetuaPelaksana             string `json:"ketua_pelaksana" gorm:"type:varchar(255)"`
	KetuaPelaksanaNRA          string `json:"ketua_pelaksana_nra" gorm:"type:varchar(50)"`
	Sekretaris                 string `json:"sekretaris" gorm:"type:varchar(255)"`
	SekretarisNRA              string `json:"sekretaris_nra" gorm:"type:varchar(50)"`
	Bendahara                  string `json:"bendahara" gorm:"type:varchar(255)"`
	BendaharaNRA               string `json:"bendahara_nra" gorm:"type:varchar(50)"`
	AcaraKoordinator           string `json:"acara_koordinator" gorm:"type:varchar(255)"`
	AcaraKoordinatorNRA        string `json:"acara_koordinator_nra" gorm:"type:varchar(50)"`
	AcaraAnggota               string `json:"acara_anggota" gorm:"type:text"`
	PerlengkapanKoordinator    string `json:"perlengkapan_koordinator" gorm:"type:varchar(255)"`
	PerlengkapanKoordinatorNRA string `json:"perlengkapan_koordinator_nra" gorm:"type:varchar(50)"`
	PerlengkapanAnggota        string `json:"perlengkapan_anggota" gorm:"type:text"`
	HumasKoordinator           string `json:"humas_koordinator" gorm:"type:varchar(255)"`
	HumasKoordinatorNRA        string `json:"humas_koordinator_nra" gorm:"type:varchar(50)"`
	HumasAnggota               string `json:"humas_anggota" gorm:"type:text"`

	// Fields for Surat Izin Kegiatan
	TanggalKegiatan *time.Time `json:"tanggal_kegiatan" gorm:"type:date"`
	Waktu           string     `json:"waktu" gorm:"type:varchar(100)"`
	Tempat          string     `json:"tempat" gorm:"type:varchar(255)"`
	Penyelenggara   string     `json:"penyelenggara" gorm:"type:varchar(255)"`

	// Signature fields
	TanggalPembuatan time.Time `json:"tanggal_pembuatan" gorm:"type:date"`
	TTDNama          string    `json:"ttd_nama" gorm:"type:varchar(255)"`
	TTDNamaLengkap   string    `json:"ttd_nama_lengkap" gorm:"type:varchar(255)"`
	TTDNRA           string    `json:"ttd_nra" gorm:"type:varchar(50)"`

	// Relations
	Creator User `json:"creator" gorm:"foreignKey:CreatedBy;references:ID"`
}

type ArsipSurat struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	SuratID        uint      `json:"surat_id" gorm:"not null"`
	TipeSurat      string    `json:"tipe_surat" gorm:"type:varchar(50);not null;comment:'masuk atau keluar'"`
	Keterangan     string    `json:"keterangan" gorm:"type:text"`
	DiarsipkanOleh uint      `json:"diarsipkan_oleh" gorm:"not null"`
	TanggalArsip   time.Time `json:"tanggal_arsip" gorm:"autoCreateTime"`

	// Relations
	User User `json:"user" gorm:"foreignKey:DiarsipkanOleh;references:ID"`
}

func (User) TableName() string {
	return "users"
}

func (SuratMasuk) TableName() string {
	return "surat_masuk"
}

func (SuratKeluar) TableName() string {
	return "surat_keluar"
}

func (ArsipSurat) TableName() string {
	return "arsip_surat"
}
