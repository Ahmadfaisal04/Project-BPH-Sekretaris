package service

import (
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
)

type SuratKeluarService interface {
	Create(request dto.SuratKeluarRequest, createdBy uint) (*model.SuratKeluar, error)
	GetByID(id uint) (*model.SuratKeluar, error)
	GetAll() ([]model.SuratKeluar, int64, error)
	GetByCreatedBy(createdBy uint) ([]model.SuratKeluar, error)
	GetByStatus(status string) ([]model.SuratKeluar, error)
	Update(id uint, request dto.SuratKeluarUpdateRequest) (*model.SuratKeluar, error)
	Delete(id uint) error
	CheckNoSuratExists(noSurat string) (bool, error)
}
