package service

import (
	"errors"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
	"project-bph-sekretaris/repository"

	"gorm.io/gorm"
)

type suratKeluarServiceImpl struct {
	suratKeluarRepo repository.SuratKeluarRepository
}

func NewSuratKeluarService(suratKeluarRepo repository.SuratKeluarRepository) SuratKeluarService {
	return &suratKeluarServiceImpl{
		suratKeluarRepo: suratKeluarRepo,
	}
}

func (s *suratKeluarServiceImpl) Create(request dto.SuratKeluarRequest, createdBy uint) (*model.SuratKeluar, error) {
	suratKeluar := &model.SuratKeluar{
		NoSurat:      request.NoSurat,
		TujuanSurat:  request.TujuanSurat,
		Perihal:      request.Perihal,
		TanggalSurat: request.TanggalSurat,
		FileSurat:    request.FileSurat,
		Status:       request.Status,
		CreatedBy:    createdBy,

		// Template fields
		TipeSurat: request.TipeSurat,
		Lampiran:  request.Lampiran,

		// Fields for Surat Peringatan
		Nama:      request.Nama,
		NRA:       request.NRA,
		Jabatan:   request.Jabatan,
		Kesalahan: request.Kesalahan,

		// Fields for Surat Keputusan
		Periode:                    request.Periode,
		NamaKegiatan:               request.NamaKegiatan,
		KetuaPelaksana:             request.KetuaPelaksana,
		KetuaPelaksanaNRA:          request.KetuaPelaksanaNRA,
		Sekretaris:                 request.Sekretaris,
		SekretarisNRA:              request.SekretarisNRA,
		Bendahara:                  request.Bendahara,
		BendaharaNRA:               request.BendaharaNRA,
		AcaraKoordinator:           request.AcaraKoordinator,
		AcaraKoordinatorNRA:        request.AcaraKoordinatorNRA,
		AcaraAnggota:               request.AcaraAnggota,
		PerlengkapanKoordinator:    request.PerlengkapanKoordinator,
		PerlengkapanKoordinatorNRA: request.PerlengkapanKoordinatorNRA,
		PerlengkapanAnggota:        request.PerlengkapanAnggota,
		HumasKoordinator:           request.HumasKoordinator,
		HumasKoordinatorNRA:        request.HumasKoordinatorNRA,
		HumasAnggota:               request.HumasAnggota,

		// Fields for Surat Izin Kegiatan
		TanggalKegiatan: request.TanggalKegiatan,
		Waktu:           request.Waktu,
		Tempat:          request.Tempat,
		Penyelenggara:   request.Penyelenggara,

		// Signature fields
		TanggalPembuatan: request.TanggalPembuatan,
		TTDNama:          request.TTDNama,
		TTDNamaLengkap:   request.TTDNamaLengkap,
		TTDNRA:           request.TTDNRA,
	}

	if suratKeluar.Status == "" {
		suratKeluar.Status = "Draft"
	}

	err := s.suratKeluarRepo.Create(suratKeluar)
	if err != nil {
		return nil, err
	}

	return s.suratKeluarRepo.GetByID(suratKeluar.ID)
}

func (s *suratKeluarServiceImpl) GetByID(id uint) (*model.SuratKeluar, error) {
	suratKeluar, err := s.suratKeluarRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("surat keluar not found")
		}
		return nil, err
	}
	return suratKeluar, nil
}

func (s *suratKeluarServiceImpl) GetAll() ([]model.SuratKeluar, int64, error) {
	suratKeluar, err := s.suratKeluarRepo.GetAll()
	if err != nil {
		return nil, 0, err
	}

	count, err := s.suratKeluarRepo.Count()
	if err != nil {
		return nil, 0, err
	}

	return suratKeluar, count, nil
}

func (s *suratKeluarServiceImpl) GetByCreatedBy(createdBy uint) ([]model.SuratKeluar, error) {
	return s.suratKeluarRepo.GetByCreatedBy(createdBy)
}

func (s *suratKeluarServiceImpl) GetByStatus(status string) ([]model.SuratKeluar, error) {
	return s.suratKeluarRepo.GetByStatus(status)
}

func (s *suratKeluarServiceImpl) Update(id uint, request dto.SuratKeluarUpdateRequest) (*model.SuratKeluar, error) {
	suratKeluar, err := s.suratKeluarRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("surat keluar not found")
		}
		return nil, err
	}
	// Update fields if provided
	if request.NoSurat != "" {
		suratKeluar.NoSurat = request.NoSurat
	}
	if request.TujuanSurat != "" {
		suratKeluar.TujuanSurat = request.TujuanSurat
	}
	if request.Perihal != "" {
		suratKeluar.Perihal = request.Perihal
	}
	if !request.TanggalSurat.IsZero() {
		suratKeluar.TanggalSurat = request.TanggalSurat
	}
	if request.FileSurat != "" {
		suratKeluar.FileSurat = request.FileSurat
	}
	if request.Status != "" {
		suratKeluar.Status = request.Status
	}

	// Update template fields
	if request.TipeSurat != "" {
		suratKeluar.TipeSurat = request.TipeSurat
	}
	if request.Lampiran != "" {
		suratKeluar.Lampiran = request.Lampiran
	}

	// Update Surat Peringatan fields
	if request.Nama != "" {
		suratKeluar.Nama = request.Nama
	}
	if request.NRA != "" {
		suratKeluar.NRA = request.NRA
	}
	if request.Jabatan != "" {
		suratKeluar.Jabatan = request.Jabatan
	}
	if request.Kesalahan != "" {
		suratKeluar.Kesalahan = request.Kesalahan
	}

	// Update Surat Keputusan fields
	if request.Periode != "" {
		suratKeluar.Periode = request.Periode
	}
	if request.NamaKegiatan != "" {
		suratKeluar.NamaKegiatan = request.NamaKegiatan
	}
	if request.KetuaPelaksana != "" {
		suratKeluar.KetuaPelaksana = request.KetuaPelaksana
	}
	if request.KetuaPelaksanaNRA != "" {
		suratKeluar.KetuaPelaksanaNRA = request.KetuaPelaksanaNRA
	}
	if request.Sekretaris != "" {
		suratKeluar.Sekretaris = request.Sekretaris
	}
	if request.SekretarisNRA != "" {
		suratKeluar.SekretarisNRA = request.SekretarisNRA
	}
	if request.Bendahara != "" {
		suratKeluar.Bendahara = request.Bendahara
	}
	if request.BendaharaNRA != "" {
		suratKeluar.BendaharaNRA = request.BendaharaNRA
	}
	if request.AcaraKoordinator != "" {
		suratKeluar.AcaraKoordinator = request.AcaraKoordinator
	}
	if request.AcaraKoordinatorNRA != "" {
		suratKeluar.AcaraKoordinatorNRA = request.AcaraKoordinatorNRA
	}
	if request.AcaraAnggota != "" {
		suratKeluar.AcaraAnggota = request.AcaraAnggota
	}
	if request.PerlengkapanKoordinator != "" {
		suratKeluar.PerlengkapanKoordinator = request.PerlengkapanKoordinator
	}
	if request.PerlengkapanKoordinatorNRA != "" {
		suratKeluar.PerlengkapanKoordinatorNRA = request.PerlengkapanKoordinatorNRA
	}
	if request.PerlengkapanAnggota != "" {
		suratKeluar.PerlengkapanAnggota = request.PerlengkapanAnggota
	}
	if request.HumasKoordinator != "" {
		suratKeluar.HumasKoordinator = request.HumasKoordinator
	}
	if request.HumasKoordinatorNRA != "" {
		suratKeluar.HumasKoordinatorNRA = request.HumasKoordinatorNRA
	}
	if request.HumasAnggota != "" {
		suratKeluar.HumasAnggota = request.HumasAnggota
	}

	// Update Surat Izin Kegiatan fields
	if request.TanggalKegiatan != nil {
		suratKeluar.TanggalKegiatan = request.TanggalKegiatan
	}
	if request.Waktu != "" {
		suratKeluar.Waktu = request.Waktu
	}
	if request.Tempat != "" {
		suratKeluar.Tempat = request.Tempat
	}
	if request.Penyelenggara != "" {
		suratKeluar.Penyelenggara = request.Penyelenggara
	}

	// Update signature fields
	if !request.TanggalPembuatan.IsZero() {
		suratKeluar.TanggalPembuatan = request.TanggalPembuatan
	}
	if request.TTDNama != "" {
		suratKeluar.TTDNama = request.TTDNama
	}
	if request.TTDNamaLengkap != "" {
		suratKeluar.TTDNamaLengkap = request.TTDNamaLengkap
	}
	if request.TTDNRA != "" {
		suratKeluar.TTDNRA = request.TTDNRA
	}

	err = s.suratKeluarRepo.Update(suratKeluar)
	if err != nil {
		return nil, err
	}

	return s.suratKeluarRepo.GetByID(id)
}

func (s *suratKeluarServiceImpl) Delete(id uint) error {
	_, err := s.suratKeluarRepo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("surat keluar not found")
		}
		return err
	}

	return s.suratKeluarRepo.Delete(id)
}

func (s *suratKeluarServiceImpl) CheckNoSuratExists(noSurat string) (bool, error) {
	_, err := s.suratKeluarRepo.GetByNoSurat(noSurat)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil // Nomor surat tidak ditemukan, berarti belum ada
		}
		return false, err // Error lain
	}
	return true, nil // Nomor surat ditemukan, berarti sudah ada
}
