package controller

import "github.com/gin-gonic/gin"

type SuratKeluarController interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	GetByStatus(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
	GetTemplates(c *gin.Context)
}
