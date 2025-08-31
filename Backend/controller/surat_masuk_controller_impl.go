package controller

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/service"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type suratMasukControllerImpl struct {
	suratMasukService service.SuratMasukService
}

func NewSuratMasukController(suratMasukService service.SuratMasukService) SuratMasukController {
	return &suratMasukControllerImpl{
		suratMasukService: suratMasukService,
	}
}

func (ctrl *suratMasukControllerImpl) Create(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Unauthorized",
		})
		return
	}

	// Parse form data
	err := c.Request.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Failed to parse form data: " + err.Error(),
		})
		return
	}

	// Extract form fields
	noSurat := c.PostForm("no_surat")
	asalSurat := c.PostForm("asal_surat")
	perihal := c.PostForm("perihal")
	tanggalSuratStr := c.PostForm("tanggal_surat")
	tanggalDiterimaStr := c.PostForm("tanggal_diterima")
	status := c.PostForm("status")

	if noSurat == "" || asalSurat == "" || perihal == "" || tanggalSuratStr == "" || tanggalDiterimaStr == "" {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Missing required fields",
		})
		return
	}

	// Parse dates
	tanggalSurat, err := time.Parse(time.RFC3339, tanggalSuratStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Invalid tanggal_surat format",
		})
		return
	}

	tanggalDiterima, err := time.Parse(time.RFC3339, tanggalDiterimaStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Invalid tanggal_diterima format",
		})
		return
	}

	// Handle file upload
	var filePath string
	file, header, err := c.Request.FormFile("file_surat")
	if err == nil {
		defer file.Close()

		// Create uploads directory if it doesn't exist
		uploadDir := "./uploads"
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			os.MkdirAll(uploadDir, 0755)
		}

		// Generate unique filename
		ext := filepath.Ext(header.Filename)
		filename := fmt.Sprintf("%d_%s%s", time.Now().Unix(), strings.ReplaceAll(noSurat, "/", "_"), ext)
		filePath = "/uploads/" + filename

		// Save file
		dst, err := os.Create("." + filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
				Status:  "error",
				Message: "Failed to create file: " + err.Error(),
			})
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
				Status:  "error",
				Message: "Failed to save file: " + err.Error(),
			})
			return
		}
	}

	// Create request object
	request := dto.SuratMasukRequest{
		NoSurat:         noSurat,
		AsalSurat:       asalSurat,
		Perihal:         perihal,
		TanggalSurat:    tanggalSurat,
		TanggalDiterima: tanggalDiterima,
		FileSurat:       filePath,
		Status:          status,
	}

	suratMasuk, err := ctrl.suratMasukService.Create(request, userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, dto.SuratMasukResponse{
		Status:  "success",
		Message: "Surat masuk created successfully",
		Data:    suratMasuk,
	})
}

func (ctrl *suratMasukControllerImpl) GetAll(c *gin.Context) {
	suratMasuk, total, err := ctrl.suratMasukService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratMasukListResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratMasukListResponse{
		Status:  "success",
		Message: "Surat masuk retrieved successfully",
		Data:    suratMasuk,
		Total:   total,
	})
}

func (ctrl *suratMasukControllerImpl) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	suratMasuk, err := ctrl.suratMasukService.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, dto.SuratMasukResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratMasukResponse{
		Status:  "success",
		Message: "Surat masuk retrieved successfully",
		Data:    suratMasuk,
	})
}

func (ctrl *suratMasukControllerImpl) GetByStatus(c *gin.Context) {
	status := c.Query("status")
	if status == "" {
		c.JSON(http.StatusBadRequest, dto.SuratMasukListResponse{
			Status:  "error",
			Message: "Status parameter is required",
		})
		return
	}

	suratMasuk, err := ctrl.suratMasukService.GetByStatus(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratMasukListResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratMasukListResponse{
		Status:  "success",
		Message: "Surat masuk retrieved successfully",
		Data:    suratMasuk,
		Total:   int64(len(suratMasuk)),
	})
}

func (ctrl *suratMasukControllerImpl) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	// Check content type - support both JSON and FormData
	contentType := c.GetHeader("Content-Type")
	var request dto.SuratMasukUpdateRequest

	if strings.Contains(contentType, "multipart/form-data") {
		// Handle FormData (for file uploads)
		err := c.Request.ParseMultipartForm(10 << 20) // 10 MB max
		if err != nil {
			c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
				Status:  "error",
				Message: "Failed to parse form data: " + err.Error(),
			})
			return
		}

		// Extract form fields (only update non-empty fields)
		if noSurat := c.PostForm("no_surat"); noSurat != "" {
			request.NoSurat = noSurat
		}
		if asalSurat := c.PostForm("asal_surat"); asalSurat != "" {
			request.AsalSurat = asalSurat
		}
		if perihal := c.PostForm("perihal"); perihal != "" {
			request.Perihal = perihal
		}
		if tanggalSuratStr := c.PostForm("tanggal_surat"); tanggalSuratStr != "" {
			if tanggalSurat, err := time.Parse(time.RFC3339, tanggalSuratStr); err == nil {
				request.TanggalSurat = tanggalSurat
			}
		}
		if tanggalDiterimaStr := c.PostForm("tanggal_diterima"); tanggalDiterimaStr != "" {
			if tanggalDiterima, err := time.Parse(time.RFC3339, tanggalDiterimaStr); err == nil {
				request.TanggalDiterima = tanggalDiterima
			}
		}
		if status := c.PostForm("status"); status != "" {
			request.Status = status
		}

		// Handle file upload
		file, header, err := c.Request.FormFile("file_surat")
		if err == nil {
			defer file.Close()

			// Create uploads directory if it doesn't exist
			uploadDir := "./uploads"
			if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
				os.MkdirAll(uploadDir, 0755)
			}

			// Generate unique filename
			ext := filepath.Ext(header.Filename)
			filename := fmt.Sprintf("%d_update_%s%s", time.Now().Unix(), strings.ReplaceAll(request.NoSurat, "/", "_"), ext)
			filePath := "/uploads/" + filename

			// Save file
			dst, err := os.Create("." + filePath)
			if err != nil {
				c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
					Status:  "error",
					Message: "Failed to create file: " + err.Error(),
				})
				return
			}
			defer dst.Close()

			if _, err := io.Copy(dst, file); err != nil {
				c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
					Status:  "error",
					Message: "Failed to save file: " + err.Error(),
				})
				return
			}

			request.FileSurat = filePath
		}
	} else {
		// Handle JSON (backward compatibility)
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
				Status:  "error",
				Message: err.Error(),
			})
			return
		}
	}

	suratMasuk, err := ctrl.suratMasukService.Update(uint(id), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratMasukResponse{
		Status:  "success",
		Message: "Surat masuk updated successfully",
		Data:    suratMasuk,
	})
}

func (ctrl *suratMasukControllerImpl) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	err = ctrl.suratMasukService.Delete(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuratMasukResponse{
		Status:  "success",
		Message: "Surat masuk deleted successfully",
	})
}

func (ctrl *suratMasukControllerImpl) CheckNoSurat(c *gin.Context) {
	noSurat := c.Query("no_surat")
	if noSurat == "" {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Nomor surat harus diisi",
		})
		return
	}

	exists, err := ctrl.suratMasukService.CheckNoSuratExists(noSurat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.SuratMasukResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"exists": exists,
		"message": func() string {
			if exists {
				return "Nomor surat sudah ada"
			}
			return "Nomor surat tersedia"
		}(),
	})
}
