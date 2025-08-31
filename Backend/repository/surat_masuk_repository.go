package repository

import "project-bph-sekretaris/model"

type SuratMasukRepository interface {
	Create(suratMasuk *model.SuratMasuk) error
	GetByID(id uint) (*model.SuratMasuk, error)
	GetAll() ([]model.SuratMasuk, error)
	GetByCreatedBy(createdBy uint) ([]model.SuratMasuk, error)
	GetByStatus(status string) ([]model.SuratMasuk, error)
	Update(suratMasuk *model.SuratMasuk) error
	Delete(id uint) error
	Count() (int64, error)
	GetByNoSurat(noSurat string) (*model.SuratMasuk, error)
}
