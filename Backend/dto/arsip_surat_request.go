package dto

type ArsipSuratRequest struct {
	Nomor      string `json:"nomor" binding:"required"`
	Tanggal    string `json:"tanggal" binding:"required"`
	Perihal    string `json:"perihal" binding:"required"`
	Tipe       string `json:"tipe" binding:"required"`
	Keterangan string `json:"keterangan"`
	FileURL    string `json:"file_url"`
}

type ArsipSuratUpdateRequest struct {
	Keterangan string `json:"keterangan"`
}
