package controller

import "github.com/gin-gonic/gin"

type ArsipSuratController interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	GetByTipeSurat(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}
