package controller

import (
	"net/http"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/service"
	"strconv"

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
	var request dto.ArsipSuratRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.ArsipSuratResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.ArsipSuratResponse{
			Status:  "error",
			Message: "Unauthorized",
		})
		return
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
