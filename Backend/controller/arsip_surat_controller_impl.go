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

type arsipSuratControllerImpl struct {
	arsipSuratService service.ArsipSuratService
}

func NewArsipSuratController(arsipSuratService service.ArsipSuratService) ArsipSuratController {
	return &arsipSuratControllerImpl{
		arsipSuratService: arsipSuratService,
	}
}

func (ctrl *arsipSuratControllerImpl) Create(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.ArsipSuratResponse{
			Status:  "error",
			Message: "Unauthorized",
		})
		return
	}
	// Parse form data
	nomor := c.PostForm("nomor")
	tanggal := c.PostForm("tanggal")
	perihal := c.PostForm("perihal")
	tipe := c.PostForm("tipe")
	keterangan := c.PostForm("keterangan")

	// Debug logging
	fmt.Printf("Received arsip data: nomor=%s, tanggal=%s, perihal=%s, tipe=%s, keterangan=%s\n",
		nomor, tanggal, perihal, tipe, keterangan)

	if nomor == "" || tanggal == "" || perihal == "" || tipe == "" {
		fmt.Printf("Missing required fields validation failed\n")
		c.JSON(http.StatusBadRequest, dto.ArsipSuratResponse{
			Status:  "error",
			Message: "Missing required fields: nomor, tanggal, perihal, tipe",
		})
		return
	}

	// Handle file upload
	var fileURL string
	file, header, err := c.Request.FormFile("file")
	if err == nil {
		defer file.Close()

		// Create uploads directory if it doesn't exist
		uploadsDir := "./uploads"
		if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
			os.MkdirAll(uploadsDir, 0755)
		}

		// Generate unique filename
		timestamp := time.Now().Unix()
		filename := fmt.Sprintf("%d_%s", timestamp, strings.ReplaceAll(header.Filename, " ", "_"))
		filePath := filepath.Join(uploadsDir, filename)

		// Save file
		dst, err := os.Create(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ArsipSuratResponse{
				Status:  "error",
				Message: "Failed to save file: " + err.Error(),
			})
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ArsipSuratResponse{
				Status:  "error",
				Message: "Failed to save file: " + err.Error(),
			})
			return
		}

		fileURL = fmt.Sprintf("/uploads/%s", filename)
	}

	// Create request object with proper structure
	request := dto.ArsipSuratRequest{
		Nomor:      nomor,
		Tanggal:    tanggal,
		Perihal:    perihal,
		Tipe:       tipe,
		Keterangan: keterangan,
		FileURL:    fileURL,
	}

	arsipSurat, err := ctrl.arsipSuratService.Create(request, userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ArsipSuratResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, dto.ArsipSuratResponse{
		Status:  "success",
		Message: "Arsip surat created successfully",
		Data:    arsipSurat,
	})
}

func (ctrl *arsipSuratControllerImpl) GetAll(c *gin.Context) {
	arsipSurat, total, err := ctrl.arsipSuratService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ArsipSuratListResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.ArsipSuratListResponse{
		Status:  "success",
		Message: "Arsip surat retrieved successfully",
		Data:    arsipSurat,
		Total:   total,
	})
}

func (ctrl *arsipSuratControllerImpl) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ArsipSuratResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	arsipSurat, err := ctrl.arsipSuratService.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ArsipSuratResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.ArsipSuratResponse{
		Status:  "success",
		Message: "Arsip surat retrieved successfully",
		Data:    arsipSurat,
	})
}

func (ctrl *arsipSuratControllerImpl) GetByTipeSurat(c *gin.Context) {
	tipeSurat := c.Query("tipe_surat")
	if tipeSurat == "" {
		c.JSON(http.StatusBadRequest, dto.ArsipSuratListResponse{
			Status:  "error",
			Message: "Tipe surat parameter is required",
		})
		return
	}

	arsipSurat, err := ctrl.arsipSuratService.GetByTipeSurat(tipeSurat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ArsipSuratListResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.ArsipSuratListResponse{
		Status:  "success",
		Message: "Arsip surat retrieved successfully",
		Data:    arsipSurat,
		Total:   int64(len(arsipSurat)),
	})
}

func (ctrl *arsipSuratControllerImpl) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ArsipSuratResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	var request dto.ArsipSuratUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.ArsipSuratResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	arsipSurat, err := ctrl.arsipSuratService.Update(uint(id), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ArsipSuratResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.ArsipSuratResponse{
		Status:  "success",
		Message: "Arsip surat updated successfully",
		Data:    arsipSurat,
	})
}

func (ctrl *arsipSuratControllerImpl) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ArsipSuratResponse{
			Status:  "error",
			Message: "Invalid ID format",
		})
		return
	}

	err = ctrl.arsipSuratService.Delete(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ArsipSuratResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.ArsipSuratResponse{
		Status:  "success",
		Message: "Arsip surat deleted successfully",
	})
}
