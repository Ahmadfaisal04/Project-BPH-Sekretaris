package service

import (
	"errors"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
	"project-bph-sekretaris/repository"

	"gorm.io/gorm"
)

type suratMasukServiceImpl struct {
	suratMasukRepo repository.SuratMasukRepository
}

func NewSuratMasukService(suratMasukRepo repository.SuratMasukRepository) SuratMasukService {
	return &suratMasukServiceImpl{
		suratMasukRepo: suratMasukRepo,
	}
}

func (s *suratMasukServiceImpl) Create(request dto.SuratMasukRequest, createdBy uint) (*model.SuratMasuk, error) {
	suratMasuk := &model.SuratMasuk{
		NoSurat:         request.NoSurat,
		AsalSurat:       request.AsalSurat,
		Perihal:         request.Perihal,
		TanggalSurat:    request.TanggalSurat,
		TanggalDiterima: request.TanggalDiterima,
		FileSurat:       request.FileSurat,
		Status:          request.Status,
		CreatedBy:       createdBy,
	}

	if suratMasuk.Status == "" {
		suratMasuk.Status = "Baru"
	}

	err := s.suratMasukRepo.Create(suratMasuk)
	if err != nil {
		return nil, err
	}

	return s.suratMasukRepo.GetByID(suratMasuk.ID)
}

func (s *suratMasukServiceImpl) GetByID(id uint) (*model.SuratMasuk, error) {
	suratMasuk, err := s.suratMasukRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("surat masuk not found")
		}
		return nil, err
	}
	return suratMasuk, nil
}

func (s *suratMasukServiceImpl) GetAll() ([]model.SuratMasuk, int64, error) {
	suratMasuk, err := s.suratMasukRepo.GetAll()
	if err != nil {
		return nil, 0, err
	}

	count, err := s.suratMasukRepo.Count()
	if err != nil {
		return nil, 0, err
	}

	return suratMasuk, count, nil
}

func (s *suratMasukServiceImpl) GetByCreatedBy(createdBy uint) ([]model.SuratMasuk, error) {
	return s.suratMasukRepo.GetByCreatedBy(createdBy)
}

func (s *suratMasukServiceImpl) GetByStatus(status string) ([]model.SuratMasuk, error) {
	return s.suratMasukRepo.GetByStatus(status)
}

func (s *suratMasukServiceImpl) Update(id uint, request dto.SuratMasukUpdateRequest) (*model.SuratMasuk, error) {
	suratMasuk, err := s.suratMasukRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("surat masuk not found")
		}
		return nil, err
	}

	// Update fields if provided
	if request.NoSurat != "" {
		suratMasuk.NoSurat = request.NoSurat
	}
	if request.AsalSurat != "" {
		suratMasuk.AsalSurat = request.AsalSurat
	}
	if request.Perihal != "" {
		suratMasuk.Perihal = request.Perihal
	}
	if !request.TanggalSurat.IsZero() {
		suratMasuk.TanggalSurat = request.TanggalSurat
	}
	if !request.TanggalDiterima.IsZero() {
		suratMasuk.TanggalDiterima = request.TanggalDiterima
	}
	if request.FileSurat != "" {
		suratMasuk.FileSurat = request.FileSurat
	}
	if request.Status != "" {
		suratMasuk.Status = request.Status
	}

	err = s.suratMasukRepo.Update(suratMasuk)
	if err != nil {
		return nil, err
	}

	return s.suratMasukRepo.GetByID(id)
}

func (s *suratMasukServiceImpl) Delete(id uint) error {
	_, err := s.suratMasukRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("surat masuk not found")
		}
		return err
	}

	return s.suratMasukRepo.Delete(id)
}
