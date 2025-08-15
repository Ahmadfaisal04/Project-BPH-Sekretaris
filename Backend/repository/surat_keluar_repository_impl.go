package repository

import (
	"project-bph-sekretaris/model"

	"gorm.io/gorm"
)

type suratKeluarRepositoryImpl struct {
	db *gorm.DB
}

func NewSuratKeluarRepository(db *gorm.DB) SuratKeluarRepository {
	return &suratKeluarRepositoryImpl{db: db}
}

func (r *suratKeluarRepositoryImpl) Create(suratKeluar *model.SuratKeluar) error {
	return r.db.Create(suratKeluar).Error
}

func (r *suratKeluarRepositoryImpl) GetByID(id uint) (*model.SuratKeluar, error) {
	var suratKeluar model.SuratKeluar
	err := r.db.Preload("Creator").First(&suratKeluar, id).Error
	if err != nil {
		return nil, err
	}
	return &suratKeluar, nil
}

func (r *suratKeluarRepositoryImpl) GetAll() ([]model.SuratKeluar, error) {
	var suratKeluar []model.SuratKeluar
	err := r.db.Preload("Creator").Find(&suratKeluar).Error
	return suratKeluar, err
}

func (r *suratKeluarRepositoryImpl) GetByCreatedBy(createdBy uint) ([]model.SuratKeluar, error) {
	var suratKeluar []model.SuratKeluar
	err := r.db.Preload("Creator").Where("created_by = ?", createdBy).Find(&suratKeluar).Error
	return suratKeluar, err
}

func (r *suratKeluarRepositoryImpl) GetByStatus(status string) ([]model.SuratKeluar, error) {
	var suratKeluar []model.SuratKeluar
	err := r.db.Preload("Creator").Where("status = ?", status).Find(&suratKeluar).Error
	return suratKeluar, err
}

func (r *suratKeluarRepositoryImpl) Update(suratKeluar *model.SuratKeluar) error {
	return r.db.Save(suratKeluar).Error
}

func (r *suratKeluarRepositoryImpl) Delete(id uint) error {
	return r.db.Delete(&model.SuratKeluar{}, id).Error
}

func (r *suratKeluarRepositoryImpl) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.SuratKeluar{}).Count(&count).Error
	return count, err
}
