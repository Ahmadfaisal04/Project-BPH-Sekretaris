package service

import (
	"errors"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
	"project-bph-sekretaris/repository"

	"gorm.io/gorm"
)

type arsipSuratServiceImpl struct {
	arsipSuratRepo repository.ArsipSuratRepository
}

func NewArsipSuratService(arsipSuratRepo repository.ArsipSuratRepository) ArsipSuratService {
	return &arsipSuratServiceImpl{
		arsipSuratRepo: arsipSuratRepo,
	}
}

func (s *arsipSuratServiceImpl) Create(request dto.ArsipSuratRequest, diarsipkanOleh uint) (*model.ArsipSurat, error) {
	arsipSurat := &model.ArsipSurat{
		Nomor:          request.Nomor,
		Tanggal:        request.Tanggal,
		Perihal:        request.Perihal,
		TipeSurat:      request.Tipe,
		Keterangan:     request.Keterangan,
		FileURL:        request.FileURL,
		DiarsipkanOleh: diarsipkanOleh,
	}

	err := s.arsipSuratRepo.Create(arsipSurat)
	if err != nil {
		return nil, err
	}

	return s.arsipSuratRepo.GetByID(arsipSurat.ID)
}

func (s *arsipSuratServiceImpl) GetByID(id uint) (*model.ArsipSurat, error) {
	arsipSurat, err := s.arsipSuratRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("arsip surat not found")
		}
		return nil, err
	}
	return arsipSurat, nil
}

func (s *arsipSuratServiceImpl) GetAll() ([]model.ArsipSurat, int64, error) {
	arsipSurat, err := s.arsipSuratRepo.GetAll()
	if err != nil {
		return nil, 0, err
	}

	count, err := s.arsipSuratRepo.Count()
	if err != nil {
		return nil, 0, err
	}

	return arsipSurat, count, nil
}

func (s *arsipSuratServiceImpl) GetByTipeSurat(tipeSurat string) ([]model.ArsipSurat, error) {
	return s.arsipSuratRepo.GetByTipeSurat(tipeSurat)
}

func (s *arsipSuratServiceImpl) GetByDiarsipkanOleh(diarsipkanOleh uint) ([]model.ArsipSurat, error) {
	return s.arsipSuratRepo.GetByDiarsipkanOleh(diarsipkanOleh)
}

func (s *arsipSuratServiceImpl) Update(id uint, request dto.ArsipSuratUpdateRequest) (*model.ArsipSurat, error) {
	arsipSurat, err := s.arsipSuratRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("arsip surat not found")
		}
		return nil, err
	}

	// Update fields if provided
	if request.Keterangan != "" {
		arsipSurat.Keterangan = request.Keterangan
	}

	err = s.arsipSuratRepo.Update(arsipSurat)
	if err != nil {
		return nil, err
	}

	return s.arsipSuratRepo.GetByID(id)
}

func (s *arsipSuratServiceImpl) Delete(id uint) error {
	_, err := s.arsipSuratRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("arsip surat not found")
		}
		return err
	}

	return s.arsipSuratRepo.Delete(id)
}
