package main

import (
	"log"
	"os"
	"project-bph-sekretaris/config"
	"project-bph-sekretaris/controller"
	"project-bph-sekretaris/middleware"
	"project-bph-sekretaris/repository"
	"project-bph-sekretaris/service"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Connect to database
	config.ConnectDatabase()

	// Initialize repositories
	userRepo := repository.NewUserRepository(config.DB)
	suratMasukRepo := repository.NewSuratMasukRepository(config.DB)
	suratKeluarRepo := repository.NewSuratKeluarRepository(config.DB)
	arsipSuratRepo := repository.NewArsipSuratRepository(config.DB)

	// Initialize services
	authService := service.NewAuthService(userRepo)
	suratMasukService := service.NewSuratMasukService(suratMasukRepo)
	suratKeluarService := service.NewSuratKeluarService(suratKeluarRepo)
	arsipSuratService := service.NewArsipSuratService(arsipSuratRepo)

	// Initialize controllers
	authController := controller.NewAuthController(authService)
	suratMasukController := controller.NewSuratMasukController(suratMasukService)
	suratKeluarController := controller.NewSuratKeluarController(suratKeluarService)
	arsipSuratController := controller.NewArsipSuratController(arsipSuratService)

	// Initialize Gin router
	router := gin.Default() // CORS middleware - Allow all origins for development
	router.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin == "" {
			origin = "*"
		}
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "success",
			"message": "BPH Sekretaris API is running",
		})
	})

	// API routes
	api := router.Group("/api/v1")

	// Auth routes (no middleware)
	auth := api.Group("/auth")
	{
		auth.POST("/register", authController.Register)
		auth.POST("/login", authController.Login)
	}

	// Protected routes (with auth middleware)
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware(authService))
	{
		// Surat Masuk routes
		suratMasukRoutes := protected.Group("/surat-masuk")
		{
			suratMasukRoutes.POST("", suratMasukController.Create)
			suratMasukRoutes.GET("", suratMasukController.GetAll)
			suratMasukRoutes.GET("/:id", suratMasukController.GetByID)
			suratMasukRoutes.GET("/status", suratMasukController.GetByStatus)
			suratMasukRoutes.PUT("/:id", suratMasukController.Update)
			suratMasukRoutes.DELETE("/:id", suratMasukController.Delete)
		}
		// Surat Keluar routes
		suratKeluarRoutes := protected.Group("/surat-keluar")
		{
			suratKeluarRoutes.POST("", suratKeluarController.Create)
			suratKeluarRoutes.GET("", suratKeluarController.GetAll)
			suratKeluarRoutes.GET("/:id", suratKeluarController.GetByID)
			suratKeluarRoutes.GET("/status", suratKeluarController.GetByStatus)
			suratKeluarRoutes.GET("/templates", suratKeluarController.GetTemplates)
			suratKeluarRoutes.PUT("/:id", suratKeluarController.Update)
			suratKeluarRoutes.DELETE("/:id", suratKeluarController.Delete)
		}

		// Arsip Surat routes
		arsipSuratRoutes := protected.Group("/arsip-surat")
		{
			arsipSuratRoutes.POST("", arsipSuratController.Create)
			arsipSuratRoutes.GET("", arsipSuratController.GetAll)
			arsipSuratRoutes.GET("/:id", arsipSuratController.GetByID)
			arsipSuratRoutes.GET("/tipe", arsipSuratController.GetByTipeSurat)
			arsipSuratRoutes.PUT("/:id", arsipSuratController.Update)
			arsipSuratRoutes.DELETE("/:id", arsipSuratController.Delete)
		}
	}

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
