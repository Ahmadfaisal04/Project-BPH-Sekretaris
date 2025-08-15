package repository

import (
	"project-bph-sekretaris/model"

	"gorm.io/gorm"
)

type arsipSuratRepositoryImpl struct {
	db *gorm.DB
}

func NewArsipSuratRepository(db *gorm.DB) ArsipSuratRepository {
	return &arsipSuratRepositoryImpl{db: db}
}

func (r *arsipSuratRepositoryImpl) Create(arsipSurat *model.ArsipSurat) error {
	return r.db.Create(arsipSurat).Error
}

func (r *arsipSuratRepositoryImpl) GetByID(id uint) (*model.ArsipSurat, error) {
	var arsipSurat model.ArsipSurat
	err := r.db.Preload("User").First(&arsipSurat, id).Error
	if err != nil {
		return nil, err
	}
	return &arsipSurat, nil
}

func (r *arsipSuratRepositoryImpl) GetAll() ([]model.ArsipSurat, error) {
	var arsipSurat []model.ArsipSurat
	err := r.db.Preload("User").Find(&arsipSurat).Error
	return arsipSurat, err
}

func (r *arsipSuratRepositoryImpl) GetByTipeSurat(tipeSurat string) ([]model.ArsipSurat, error) {
	var arsipSurat []model.ArsipSurat
	err := r.db.Preload("User").Where("tipe_surat = ?", tipeSurat).Find(&arsipSurat).Error
	return arsipSurat, err
}

func (r *arsipSuratRepositoryImpl) GetByDiarsipkanOleh(diarsipkanOleh uint) ([]model.ArsipSurat, error) {
	var arsipSurat []model.ArsipSurat
	err := r.db.Preload("User").Where("diarsipkan_oleh = ?", diarsipkanOleh).Find(&arsipSurat).Error
	return arsipSurat, err
}

func (r *arsipSuratRepositoryImpl) Update(arsipSurat *model.ArsipSurat) error {
	return r.db.Save(arsipSurat).Error
}

func (r *arsipSuratRepositoryImpl) Delete(id uint) error {
	return r.db.Delete(&model.ArsipSurat{}, id).Error
}

func (r *arsipSuratRepositoryImpl) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.ArsipSurat{}).Count(&count).Error
	return count, err
}
