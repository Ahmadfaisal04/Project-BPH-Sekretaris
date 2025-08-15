package main

import (
	"fmt"
	"log"
	"os"
	"project-bph-sekretaris/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func main() {
	// Get database configuration from environment variables
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "3306")
	dbUser := getEnv("DB_USER", "root")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "bph_sekretaris")

	// First, connect without database name to create the database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to MySQL server:", err)
	}

	// Create database if it doesn't exist
	fmt.Printf("Creating database '%s' if it doesn't exist...\n", dbName)
	err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s`", dbName)).Error
	if err != nil {
		log.Fatal("Failed to create database:", err)
	}

	// Now connect to the specific database
	dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("Database connected successfully")

	// Drop existing tables to force recreation with all new columns
	fmt.Println("Dropping existing tables to recreate with new schema...")
	db.Exec("DROP TABLE IF EXISTS arsip_surats")
	db.Exec("DROP TABLE IF EXISTS surat_keluars") 
	db.Exec("DROP TABLE IF EXISTS surat_masuks")
	db.Exec("DROP TABLE IF EXISTS users")

	// Auto migrate the schema
	fmt.Println("Running database migration...")
	err = db.AutoMigrate(
		&model.User{},
		&model.SuratMasuk{},
		&model.SuratKeluar{},
		&model.ArsipSurat{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	fmt.Println("Database migration completed successfully!")

	// Create default admin user if not exists
	var userCount int64
	db.Model(&model.User{}).Count(&userCount)

	if userCount == 0 {
		fmt.Println("Creating default admin user...")

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("Failed to hash password:", err)
		}

		admin := model.User{
			Name:         "Administrator", 
			Email:        "admin@bph.org",
			PasswordHash: string(hashedPassword),
			Role:         "ketua",
		}

		if err := db.Create(&admin).Error; err != nil {
			log.Fatal("Failed to create admin user:", err)
		}

		fmt.Println("Default admin user created successfully!")
		fmt.Println("Email: admin@bph.org")
		fmt.Println("Password: admin123")
	} else {
		fmt.Println("Admin user already exists, skipping creation.")
	}

	// Show table structures
	fmt.Println("\nTable structures:")
	
	// Show SuratKeluar structure
	rows, err := db.Raw("DESCRIBE surat_keluars").Rows()
	if err == nil {
		fmt.Println("=== SURAT_KELUARS TABLE ===")
		for rows.Next() {
			var field, fieldType, null, key, defaultVal, extra string
			rows.Scan(&field, &fieldType, &null, &key, &defaultVal, &extra)
			fmt.Printf("- %s: %s\n", field, fieldType)
		}
		rows.Close()
	}

	fmt.Println("\nSetup completed successfully!")
}
