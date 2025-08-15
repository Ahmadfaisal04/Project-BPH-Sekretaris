package service

import (
	"errors"
	"project-bph-sekretaris/dto"
	"project-bph-sekretaris/model"
	"project-bph-sekretaris/repository"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type authServiceImpl struct {
	userRepo repository.UserRepository
	jwtKey   []byte
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
	return &authServiceImpl{
		userRepo: userRepo,
		jwtKey:   []byte("your-secret-key"), // In production, use environment variable
	}
}

func (s *authServiceImpl) Register(request dto.AuthRegisterRequest) (*model.User, error) {
	// Check if user already exists
	_, err := s.userRepo.GetByEmail(request.Email)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &model.User{
		Name:         request.Name,
		Email:        request.Email,
		PasswordHash: string(hashedPassword),
		Role:         request.Role,
	}

	err = s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *authServiceImpl) Login(request dto.AuthLoginRequest) (*dto.AuthResponse, error) {
	// Get user by email
	user, err := s.userRepo.GetByEmail(request.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(request.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Generate token
	token, err := s.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *authServiceImpl) GenerateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": strconv.Itoa(int(userID)),
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtKey)
}

func (s *authServiceImpl) ValidateToken(tokenString string) (*model.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return s.jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userIDStr, ok := claims["user_id"].(string)
		if !ok {
			return nil, errors.New("invalid token claims")
		}

		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			return nil, errors.New("invalid user ID in token")
		}

		user, err := s.userRepo.GetByID(uint(userID))
		if err != nil {
			return nil, err
		}

		return user, nil
	}

	return nil, errors.New("invalid token")
}
