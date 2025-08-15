package service

import (
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
)

type AuthService interface {
	Register(request dto.AuthRegisterRequest) (*model.User, error)
	Login(request dto.AuthLoginRequest) (*dto.AuthResponse, error)
	GenerateToken(userID uint) (string, error)
	ValidateToken(token string) (*model.User, error)
}
