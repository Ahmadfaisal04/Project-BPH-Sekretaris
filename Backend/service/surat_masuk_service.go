package service

import (
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
)

type SuratMasukService interface {
	Create(request dto.SuratMasukRequest, createdBy uint) (*model.SuratMasuk, error)
	GetByID(id uint) (*model.SuratMasuk, error)
	GetAll() ([]model.SuratMasuk, int64, error)
	GetByCreatedBy(createdBy uint) ([]model.SuratMasuk, error)
	GetByStatus(status string) ([]model.SuratMasuk, error)
	Update(id uint, request dto.SuratMasukUpdateRequest) (*model.SuratMasuk, error)
	Delete(id uint) error
}
