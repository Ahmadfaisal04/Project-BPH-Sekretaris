package repository

import "project-bph-sekretaris/model"

type SuratKeluarRepository interface {
	Create(suratKeluar *model.SuratKeluar) error
	GetByID(id uint) (*model.SuratKeluar, error)
	GetAll() ([]model.SuratKeluar, error)
	GetByCreatedBy(createdBy uint) ([]model.SuratKeluar, error)
	GetByStatus(status string) ([]model.SuratKeluar, error)
	Update(suratKeluar *model.SuratKeluar) error
	Delete(id uint) error
	Count() (int64, error)
}
