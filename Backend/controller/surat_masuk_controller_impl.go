package controller

import (
	"net/http"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/service"
	"strconv"

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
	var request dto.SuratMasukRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.SuratMasukResponse{
			Status:  "error",
			Message: "Unauthorized",
		})
		return
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

	var request dto.SuratMasukUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.SuratMasukResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
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
