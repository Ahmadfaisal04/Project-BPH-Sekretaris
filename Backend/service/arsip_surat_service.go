package service

import (
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
)

type ArsipSuratService interface {
	Create(request dto.ArsipSuratRequest, diarsipkanOleh uint) (*model.ArsipSurat, error)
	GetByID(id uint) (*model.ArsipSurat, error)
	GetAll() ([]model.ArsipSurat, int64, error)
	GetByTipeSurat(tipeSurat string) ([]model.ArsipSurat, error)
	GetByDiarsipkanOleh(diarsipkanOleh uint) ([]model.ArsipSurat, error)
	Update(id uint, request dto.ArsipSuratUpdateRequest) (*model.ArsipSurat, error)
	Delete(id uint) error
}
