package dto

import "project-bph-sekretaris/model"

type SuratKeluarResponse struct {
	Status  string             `json:"status"`
	Message string             `json:"message"`
	Data    *model.SuratKeluar `json:"data,omitempty"`
}

type SuratKeluarListResponse struct {
	Status  string              `json:"status"`
	Message string              `json:"message"`
	Data    []model.SuratKeluar `json:"data,omitempty"`
	Total   int64               `json:"total,omitempty"`
}
