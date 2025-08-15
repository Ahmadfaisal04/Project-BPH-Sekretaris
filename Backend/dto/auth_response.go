package dto

import "project-bph-sekretaris/model"

type AuthResponse struct {
	Token string     `json:"token"`
	User  model.User `json:"user"`
}

type GeneralResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
