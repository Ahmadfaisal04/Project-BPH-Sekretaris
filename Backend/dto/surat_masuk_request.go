package dto

import "time"

type SuratMasukRequest struct {
	NoSurat         string    `json:"no_surat" binding:"required"`
	AsalSurat       string    `json:"asal_surat" binding:"required"`
	Perihal         string    `json:"perihal" binding:"required"`
	TanggalSurat    time.Time `json:"tanggal_surat" binding:"required"`
	TanggalDiterima time.Time `json:"tanggal_diterima" binding:"required"`
	FileSurat       string    `json:"file_surat"`
	Status          string    `json:"status" binding:"omitempty,oneof=Baru Arsip"`
}

type SuratMasukUpdateRequest struct {
	NoSurat         string    `json:"no_surat"`
	AsalSurat       string    `json:"asal_surat"`
	Perihal         string    `json:"perihal"`
	TanggalSurat    time.Time `json:"tanggal_surat"`
	TanggalDiterima time.Time `json:"tanggal_diterima"`
	FileSurat       string    `json:"file_surat"`
	Status          string    `json:"status" binding:"omitempty,oneof=Baru Arsip"`
}
