package dto

import "project-bph-sekretaris/model"

type SuratMasukResponse struct {
	Status  string            `json:"status"`
	Message string            `json:"message"`
	Data    *model.SuratMasuk `json:"data,omitempty"`
}

type SuratMasukListResponse struct {
	Status  string             `json:"status"`
	Message string             `json:"message"`
	Data    []model.SuratMasuk `json:"data,omitempty"`
	Total   int64              `json:"total,omitempty"`
}
