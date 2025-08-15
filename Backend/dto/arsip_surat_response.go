package dto

import "project-bph-sekretaris/model"

type ArsipSuratResponse struct {
	Status  string            `json:"status"`
	Message string            `json:"message"`
	Data    *model.ArsipSurat `json:"data,omitempty"`
}

type ArsipSuratListResponse struct {
	Status  string             `json:"status"`
	Message string             `json:"message"`
	Data    []model.ArsipSurat `json:"data,omitempty"`
	Total   int64              `json:"total,omitempty"`
}
