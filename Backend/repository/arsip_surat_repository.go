package repository

import "project-bph-sekretaris/model"

type ArsipSuratRepository interface {
	Create(arsipSurat *model.ArsipSurat) error
	GetByID(id uint) (*model.ArsipSurat, error)
	GetAll() ([]model.ArsipSurat, error)
	GetByTipeSurat(tipeSurat string) ([]model.ArsipSurat, error)
	GetByDiarsipkanOleh(diarsipkanOleh uint) ([]model.ArsipSurat, error)
	Update(arsipSurat *model.ArsipSurat) error
	Delete(id uint) error
	Count() (int64, error)
}
