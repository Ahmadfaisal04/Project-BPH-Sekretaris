package repository

import (
	"project-bph-sekretaris/model"

	"gorm.io/gorm"
)

type suratMasukRepositoryImpl struct {
	db *gorm.DB
}

func NewSuratMasukRepository(db *gorm.DB) SuratMasukRepository {
	return &suratMasukRepositoryImpl{db: db}
}

func (r *suratMasukRepositoryImpl) Create(suratMasuk *model.SuratMasuk) error {
	return r.db.Create(suratMasuk).Error
}

func (r *suratMasukRepositoryImpl) GetByID(id uint) (*model.SuratMasuk, error) {
	var suratMasuk model.SuratMasuk
	err := r.db.Preload("Creator").First(&suratMasuk, id).Error
	if err != nil {
		return nil, err
	}
	return &suratMasuk, nil
}

func (r *suratMasukRepositoryImpl) GetAll() ([]model.SuratMasuk, error) {
	var suratMasuk []model.SuratMasuk
	err := r.db.Preload("Creator").Find(&suratMasuk).Error
	return suratMasuk, err
}

func (r *suratMasukRepositoryImpl) GetByCreatedBy(createdBy uint) ([]model.SuratMasuk, error) {
	var suratMasuk []model.SuratMasuk
	err := r.db.Preload("Creator").Where("created_by = ?", createdBy).Find(&suratMasuk).Error
	return suratMasuk, err
}

func (r *suratMasukRepositoryImpl) GetByStatus(status string) ([]model.SuratMasuk, error) {
	var suratMasuk []model.SuratMasuk
	err := r.db.Preload("Creator").Where("status = ?", status).Find(&suratMasuk).Error
	return suratMasuk, err
}

func (r *suratMasukRepositoryImpl) Update(suratMasuk *model.SuratMasuk) error {
	return r.db.Save(suratMasuk).Error
}

func (r *suratMasukRepositoryImpl) Delete(id uint) error {
	return r.db.Delete(&model.SuratMasuk{}, id).Error
}

func (r *suratMasukRepositoryImpl) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.SuratMasuk{}).Count(&count).Error
	return count, err
}
