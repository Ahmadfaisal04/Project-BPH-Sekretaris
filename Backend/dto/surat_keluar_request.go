package dto

import "time"

type SuratKeluarRequest struct {
	NoSurat      string    `json:"no_surat" binding:"required"`
	TujuanSurat  string    `json:"tujuan_surat" binding:"required"`
	Perihal      string    `json:"perihal" binding:"required"`
	TanggalSurat time.Time `json:"tanggal_surat" binding:"required"`
	FileSurat    string    `json:"file_surat"`
	Status       string    `json:"status" binding:"omitempty,oneof=Draft Terkirim Arsip"`

	// Template fields
	TipeSurat string `json:"tipe_surat"`
	Lampiran  string `json:"lampiran"`

	// Fields for Surat Peringatan
	Nama      string `json:"nama"`
	NRA       string `json:"nra"`
	Jabatan   string `json:"jabatan"`
	Kesalahan string `json:"kesalahan"`

	// Fields for Surat Keputusan
	Periode                    string `json:"periode"`
	NamaKegiatan               string `json:"nama_kegiatan"`
	KetuaPelaksana             string `json:"ketua_pelaksana"`
	KetuaPelaksanaNRA          string `json:"ketua_pelaksana_nra"`
	Sekretaris                 string `json:"sekretaris"`
	SekretarisNRA              string `json:"sekretaris_nra"`
	Bendahara                  string `json:"bendahara"`
	BendaharaNRA               string `json:"bendahara_nra"`
	AcaraKoordinator           string `json:"acara_koordinator"`
	AcaraKoordinatorNRA        string `json:"acara_koordinator_nra"`
	AcaraAnggota               string `json:"acara_anggota"`
	PerlengkapanKoordinator    string `json:"perlengkapan_koordinator"`
	PerlengkapanKoordinatorNRA string `json:"perlengkapan_koordinator_nra"`
	PerlengkapanAnggota        string `json:"perlengkapan_anggota"`
	HumasKoordinator           string `json:"humas_koordinator"`
	HumasKoordinatorNRA        string `json:"humas_koordinator_nra"`
	HumasAnggota               string `json:"humas_anggota"`

	// Fields for Surat Izin Kegiatan
	TanggalKegiatan *time.Time `json:"tanggal_kegiatan"`
	Waktu           string     `json:"waktu"`
	Tempat          string     `json:"tempat"`
	Penyelenggara   string     `json:"penyelenggara"`

	// Signature fields
	TanggalPembuatan time.Time `json:"tanggal_pembuatan" binding:"required"`
	TTDNama          string    `json:"ttd_nama"`
	TTDNamaLengkap   string    `json:"ttd_nama_lengkap"`
	TTDNRA           string    `json:"ttd_nra"`
}

type SuratKeluarUpdateRequest struct {
	NoSurat      string    `json:"no_surat"`
	TujuanSurat  string    `json:"tujuan_surat"`
	Perihal      string    `json:"perihal"`
	TanggalSurat time.Time `json:"tanggal_surat"`
	FileSurat    string    `json:"file_surat"`
	Status       string    `json:"status" binding:"omitempty,oneof=Draft Terkirim Arsip"`

	// Template fields
	TipeSurat string `json:"tipe_surat"`
	Lampiran  string `json:"lampiran"`

	// Fields for Surat Peringatan
	Nama      string `json:"nama"`
	NRA       string `json:"nra"`
	Jabatan   string `json:"jabatan"`
	Kesalahan string `json:"kesalahan"`

	// Fields for Surat Keputusan
	Periode                    string `json:"periode"`
	NamaKegiatan               string `json:"nama_kegiatan"`
	KetuaPelaksana             string `json:"ketua_pelaksana"`
	KetuaPelaksanaNRA          string `json:"ketua_pelaksana_nra"`
	Sekretaris                 string `json:"sekretaris"`
	SekretarisNRA              string `json:"sekretaris_nra"`
	Bendahara                  string `json:"bendahara"`
	BendaharaNRA               string `json:"bendahara_nra"`
	AcaraKoordinator           string `json:"acara_koordinator"`
	AcaraKoordinatorNRA        string `json:"acara_koordinator_nra"`
	AcaraAnggota               string `json:"acara_anggota"`
	PerlengkapanKoordinator    string `json:"perlengkapan_koordinator"`
	PerlengkapanKoordinatorNRA string `json:"perlengkapan_koordinator_nra"`
	PerlengkapanAnggota        string `json:"perlengkapan_anggota"`
	HumasKoordinator           string `json:"humas_koordinator"`
	HumasKoordinatorNRA        string `json:"humas_koordinator_nra"`
	HumasAnggota               string `json:"humas_anggota"`

	// Fields for Surat Izin Kegiatan
	TanggalKegiatan *time.Time `json:"tanggal_kegiatan"`
	Waktu           string     `json:"waktu"`
	Tempat          string     `json:"tempat"`
	Penyelenggara   string     `json:"penyelenggara"`

	// Signature fields
	TanggalPembuatan time.Time `json:"tanggal_pembuatan"`
	TTDNama          string    `json:"ttd_nama"`
	TTDNamaLengkap   string    `json:"ttd_nama_lengkap"`
	TTDNRA           string    `json:"ttd_nra"`
}
