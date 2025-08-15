package controller

import (
	"net/http"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/service"

	"github.com/gin-gonic/gin"
)

type authControllerImpl struct {
	authService service.AuthService
}

func NewAuthController(authService service.AuthService) AuthController {
	return &authControllerImpl{
		authService: authService,
	}
}

func (ctrl *authControllerImpl) Register(c *gin.Context) {
	var request dto.AuthRegisterRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.GeneralResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	user, err := ctrl.authService.Register(request)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.GeneralResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	// Remove password from response
	user.PasswordHash = ""

	c.JSON(http.StatusCreated, dto.GeneralResponse{
		Status:  "success",
		Message: "User registered successfully",
		Data:    user,
	})
}

func (ctrl *authControllerImpl) Login(c *gin.Context) {
	var request dto.AuthLoginRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, dto.GeneralResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	response, err := ctrl.authService.Login(request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.GeneralResponse{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	// Remove password from response
	response.User.PasswordHash = ""

	c.JSON(http.StatusOK, dto.GeneralResponse{
		Status:  "success",
		Message: "Login successful",
		Data:    response,
	})
}
