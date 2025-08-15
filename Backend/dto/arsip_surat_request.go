package dto

type ArsipSuratRequest struct {
	SuratID    uint   `json:"surat_id" binding:"required"`
	TipeSurat  string `json:"tipe_surat" binding:"required,oneof=masuk keluar"`
	Keterangan string `json:"keterangan"`
}

type ArsipSuratUpdateRequest struct {
	Keterangan string `json:"keterangan"`
}
