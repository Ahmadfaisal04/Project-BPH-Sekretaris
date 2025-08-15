package controller

import (
	"net/http"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type suratKeluarControllerImpl struct {
	suratKeluarService service.SuratKeluarService
}

func NewSuratKeluarController(suratKeluarService service.SuratKeluarService) SuratKeluarController {
	return &suratKeluarControllerImpl{
		suratKeluarService: suratKeluarService,
	}
}

func (ctrl *suratKeluarControllerImpl) Create(c *gin.Context) {
	var request dto.SuratKeluarRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratKeluarResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.SuratKeluarResponse{
			Status:  "error",
			Message: "Unauthorized",
		})
		return
	}

	suratKeluar, err := ctrl.suratKeluarService.Create(request, userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratKeluarResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, dto.SuratKeluarResponse{
		Status:  "success",
		Message: "Surat keluar created successfully",
		Data:    suratKeluar,
	})
}

func (ctrl *suratKeluarControllerImpl) GetAll(c *gin.Context) {
	suratKeluar, total, err := ctrl.suratKeluarService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratKeluarListResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratKeluarListResponse{
		Status:  "success",
		Message: "Surat keluar retrieved successfully",
		Data:    suratKeluar,
		Total:   total,
	})
}

func (ctrl *suratKeluarControllerImpl) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratKeluarResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	suratKeluar, err := ctrl.suratKeluarService.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, dto.SuratKeluarResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratKeluarResponse{
		Status:  "success",
		Message: "Surat keluar retrieved successfully",
		Data:    suratKeluar,
	})
}

func (ctrl *suratKeluarControllerImpl) GetByStatus(c *gin.Context) {
	status := c.Query("status")
	if status == "" {
		c.JSON(http.StatusBadRequest, dto.SuratKeluarListResponse{
			Status:  "error",
			Message: "Status parameter is required",
		})
		return
	}

	suratKeluar, err := ctrl.suratKeluarService.GetByStatus(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratKeluarListResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratKeluarListResponse{
		Status:  "success",
		Message: "Surat keluar retrieved successfully",
		Data:    suratKeluar,
		Total:   int64(len(suratKeluar)),
	})
}

func (ctrl *suratKeluarControllerImpl) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratKeluarResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	var request dto.SuratKeluarUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratKeluarResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	suratKeluar, err := ctrl.suratKeluarService.Update(uint(id), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratKeluarResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratKeluarResponse{
		Status:  "success",
		Message: "Surat keluar updated successfully",
		Data:    suratKeluar,
	})
}

func (ctrl *suratKeluarControllerImpl) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratKeluarResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	err = ctrl.suratKeluarService.Delete(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratKeluarResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratKeluarResponse{
		Status:  "success",
		Message: "Surat keluar deleted successfully",
	})
}

func (ctrl *suratKeluarControllerImpl) GetTemplates(c *gin.Context) {
	templates := map[string]interface{}{
		"status":  "success",
		"message": "Templates retrieved successfully",
		"data": []map[string]interface{}{
			{
				"id":          "surat_peringatan",
				"name":        "Surat Peringatan",
				"description": "Template untuk surat peringatan kepada anggota",
				"fields": []map[string]interface{}{
					{"name": "no_surat", "label": "Nomor Surat", "type": "text", "required": true},
					{"name": "nama", "label": "Nama Penerima", "type": "text", "required": true},
					{"name": "nra", "label": "NRA Penerima", "type": "text", "required": true},
					{"name": "jabatan", "label": "Jabatan Penerima", "type": "text", "required": true},
					{"name": "kesalahan", "label": "Kesalahan", "type": "textarea", "required": true},
					{"name": "tanggal_pembuatan", "label": "Tanggal Pembuatan", "type": "date", "required": true},
					{"name": "ttd_nama", "label": "Yang Bertandatangan", "type": "select", "options": []string{"Ketua Umum"}, "required": true},
					{"name": "ttd_nama_lengkap", "label": "Nama Lengkap Penandatangan", "type": "text", "required": true},
					{"name": "ttd_nra", "label": "NRA Penandatangan", "type": "text", "required": true},
				},
			},
			{
				"id":          "surat_keputusan",
				"name":        "Surat Keputusan",
				"description": "Template untuk surat keputusan pembentukan panitia",
				"fields": []map[string]interface{}{
					{"name": "no_surat", "label": "Nomor Surat", "type": "text", "required": true},
					{"name": "lampiran", "label": "Lampiran", "type": "text", "required": false},
					{"name": "perihal", "label": "Perihal", "type": "text", "required": true},
					{"name": "periode", "label": "Periode", "type": "text", "required": true},
					{"name": "nama_kegiatan", "label": "Nama Kegiatan", "type": "text", "required": true},
					{"name": "tanggal_pembuatan", "label": "Tanggal Pembuatan", "type": "date", "required": true},
					{"name": "ketua_pelaksana", "label": "Ketua Pelaksana", "type": "text", "required": true},
					{"name": "ketua_pelaksana_nra", "label": "NRA Ketua Pelaksana", "type": "text", "required": true},
					{"name": "sekretaris", "label": "Sekretaris", "type": "text", "required": true},
					{"name": "sekretaris_nra", "label": "NRA Sekretaris", "type": "text", "required": true},
					{"name": "bendahara", "label": "Bendahara", "type": "text", "required": true},
					{"name": "bendahara_nra", "label": "NRA Bendahara", "type": "text", "required": true},
					{"name": "acara_koordinator", "label": "Koordinator Divisi Acara", "type": "text", "required": true},
					{"name": "acara_koordinator_nra", "label": "NRA Koordinator Divisi Acara", "type": "text", "required": true},
					{"name": "acara_anggota", "label": "Anggota Divisi Acara", "type": "textarea", "required": true},
					{"name": "perlengkapan_koordinator", "label": "Koordinator Divisi Perlengkapan", "type": "text", "required": true},
					{"name": "perlengkapan_koordinator_nra", "label": "NRA Koordinator Divisi Perlengkapan", "type": "text", "required": true},
					{"name": "perlengkapan_anggota", "label": "Anggota Divisi Perlengkapan", "type": "textarea", "required": true},
					{"name": "humas_koordinator", "label": "Koordinator Divisi Humas", "type": "text", "required": true},
					{"name": "humas_koordinator_nra", "label": "NRA Koordinator Divisi Humas", "type": "text", "required": true},
					{"name": "humas_anggota", "label": "Anggota Divisi Humas", "type": "textarea", "required": true},
					{"name": "ttd_nama", "label": "Yang Bertandatangan", "type": "select", "options": []string{"Ketua Umum"}, "required": true},
					{"name": "ttd_nama_lengkap", "label": "Nama Lengkap Penandatangan", "type": "text", "required": true},
					{"name": "ttd_nra", "label": "NRA Penandatangan", "type": "text", "required": true},
				},
			},
			{
				"id":          "surat_izin_kegiatan",
				"name":        "Surat Izin Kegiatan",
				"description": "Template untuk surat permohonan izin kegiatan",
				"fields": []map[string]interface{}{
					{"name": "no_surat", "label": "Nomor Surat", "type": "text", "required": true},
					{"name": "lampiran", "label": "Lampiran", "type": "text", "required": false},
					{"name": "tujuan_surat", "label": "Ditujukan Kepada", "type": "text", "required": true},
					{"name": "nama_kegiatan", "label": "Nama Kegiatan", "type": "text", "required": true},
					{"name": "penyelenggara", "label": "Penyelenggara", "type": "text", "required": true},
					{"name": "tanggal_kegiatan", "label": "Tanggal Kegiatan", "type": "date", "required": true},
					{"name": "waktu", "label": "Waktu", "type": "text", "required": true},
					{"name": "tempat", "label": "Tempat", "type": "text", "required": true},
					{"name": "tanggal_pembuatan", "label": "Tanggal Pembuatan", "type": "date", "required": true},
					{"name": "ttd_nama", "label": "Yang Bertandatangan", "type": "select", "options": []string{"Ketua Umum"}, "required": true},
					{"name": "ttd_nama_lengkap", "label": "Nama Lengkap Penandatangan", "type": "text", "required": true},
					{"name": "ttd_nra", "label": "NRA Penandatangan", "type": "text", "required": true},
				},
			},
		},
	}

	c.JSON(http.StatusOK, templates)
}
