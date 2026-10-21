---
sidebar_position: 3
description: "Learn how to build a REST API in Go with JWT authentication, role-based access control and a PostgreSQL database."
---

# Complete Guide: REST API with Go from Scratch

This guide will teach you how to build a complete REST API in Go with JWT authentication, role-based access control (RBAC) and a PostgreSQL database.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Project Initialization](#project-initialization)
4. [Base Configuration](#base-configuration)
5. [Models and Database](#models-and-database)
6. [Controllers and Routes](#controllers-and-routes)
7. [Middlewares](#middlewares)
8. [Tests](#tests)
9. [Endpoint Examples](#endpoint-examples)
10. [Running the Project](#running-the-project)
11. [Deployment](#deployment)
12. [Best Practices](#best-practices)

## Prerequisites

### 1. Installing Go

**Recommended version:** Go 1.21 or higher

**Windows:**
```bash title="Installing Go"
# Download from https://golang.org/dl/
# Or use Chocolatey
choco install golang

# Verify the installation
go version
```

**Linux/macOS:**
```bash title="Installing Go (2)"
# Use the official installer or a package manager
# Ubuntu/Debian
sudo apt update
sudo apt install golang-go

# macOS with Homebrew
brew install go

# Verify the installation
go version
```

### 2. Installing Dependencies

**PostgreSQL:**
```bash title="Installing Dependencies"
# Windows
# Download from https://www.postgresql.org/download/windows/

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Start the service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

**Git:**
```bash
# Windows: https://git-scm.com/download/win
# Linux: sudo apt install git
# macOS: brew install git
```

### 3. Environment Variables Configuration

Create a `.env` file:
```env title=".env"
# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/user_management?sslmode=disable

# JWT
JWT_SECRET=your-very-secure-secret-key-change-in-production

# Server
PORT=8080

# Environment
ENV=development
```

## Project Structure

```
user-management-api/
├── main.go                    # Server entry point
├── go.mod                     # Go module
├── go.sum                     # Dependency checksums
├── .env                       # Environment variables
├── .gitignore                 # Files to ignore in Git
├── README.md                  # Project documentation
├── models/                    # Data models
│   ├── user.go
│   ├── role.go
│   └── permission.go
├── repository/                # Data access layer
│   ├── user_repository.go
│   ├── role_repository.go
│   └── permission_repository.go
├── handlers/                  # HTTP controllers
│   ├── auth_handler.go
│   ├── user_handler.go
│   ├── role_handler.go
│   └── permission_handler.go
├── middleware/                # HTTP middlewares
│   ├── auth.go
│   ├── cors.go
│   └── logging.go
├── utils/                     # Utilities
│   └── jwt.go
├── tests/                     # Tests
│   ├── auth_test.go
│   └── user_test.go
├── scripts/                   # Utility scripts
│   ├── init_db.sql
│   └── seed_data.sql
├── Dockerfile                 # For containers
├── docker-compose.yml         # Service orchestration
└── docs/                      # Additional documentation
    └── api.md
```

## Project Initialization

### 1. Create the Module

```bash title="Create the Module"
# Create the project directory
mkdir user-management-api
cd user-management-api

# Initialize the Go module
go mod init user-management-api
```

### 2. Install Dependencies

```bash title="Install Dependencies"
# Main dependencies
go get github.com/gorilla/mux@v1.8.1
go get github.com/lib/pq@v1.10.9
go get github.com/golang-jwt/jwt/v5@v5.2.1
go get github.com/joho/godotenv@v1.5.1
go get golang.org/x/crypto@v0.26.0

# Development dependencies
go get github.com/stretchr/testify@v1.8.4
go get github.com/gorilla/mux@v1.8.1
```

### 3. Create the Folder Structure

```bash
mkdir models repository handlers middleware utils tests scripts docs
```

## Base Configuration

### 1. Main File (main.go)

```go title="Main File (main.go)"
package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"user-management-api/handlers"
	"user-management-api/middleware"
	"user-management-api/repository"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Printf("Could not load .env: %v", err)
	}

	// Initialize the database
	db, err := initDB()
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}
	defer db.Close()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	permissionRepo := repository.NewPermissionRepository(db)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userRepo, roleRepo, permissionRepo)
	authHandler := handlers.NewAuthHandler(userRepo)
	roleHandler := handlers.NewRoleHandler(roleRepo)
	permissionHandler := handlers.NewPermissionHandler(permissionRepo)

	// Configure the router
	router := mux.NewRouter()

	// Global middlewares
	router.Use(middleware.LoggingMiddleware)
	router.Use(middleware.CORSMiddleware)

	// Public routes
	router.HandleFunc("/api/auth/register", authHandler.Register).Methods("POST")
	router.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST")

	// Protected routes
	protected := router.PathPrefix("/api").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	// User routes
	protected.HandleFunc("/users", userHandler.GetUsers).Methods("GET")
	protected.HandleFunc("/users/{id}", userHandler.GetUser).Methods("GET")
	protected.HandleFunc("/users", userHandler.CreateUser).Methods("POST")
	protected.HandleFunc("/users/{id}", userHandler.UpdateUser).Methods("PUT")
	protected.HandleFunc("/users/{id}", userHandler.DeleteUser).Methods("DELETE")

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Initialize tables
	if err := initTables(db); err != nil {
		log.Fatal("Error initializing tables:", err)
	}

	// Create default data
	if err := createDefaultData(db); err != nil {
		log.Fatal("Error creating default data:", err)
	}

	// Configure the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start the server
	go func() {
		log.Printf("Server started on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Error starting server:", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Error shutting down server:", err)
	}
}

func initDB() (*sql.DB, error) {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		return nil, fmt.Errorf("DATABASE_URL not configured")
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	// Configure the connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db, nil
}

func initTables(db *sql.DB) error {
	// Create the users table
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			first_name VARCHAR(50),
			last_name VARCHAR(50),
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	return err
}

func createDefaultData(db *sql.DB) error {
	// Create the default admin user
	hashedPassword, err := models.HashPassword("admin123")
	if err != nil {
		return err
	}

	_, err = db.Exec(`
		INSERT INTO users (username, email, password_hash, first_name, last_name)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (username) DO NOTHING
	`, "admin", "admin@example.com", hashedPassword, "Admin", "User")

	return err
}
```

### 2. .gitignore File

```gitignore title=".gitignore File"
# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
bin/

# Go files
go.work
go.work.sum

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Database
*.db
*.sqlite

# OS
.DS_Store
Thumbs.db
```

## Models and Database

### 1. User Model (models/user.go)

```go title="User Model (models/user.go)"
package models

import (
	"encoding/json"
	"time"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           int       `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	FirstName    string    `json:"first_name" db:"first_name"`
	LastName     string    `json:"last_name" db:"last_name"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type UserCreate struct {
	Username  string `json:"username" validate:"required,min=3,max=50"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=6"`
	FirstName string `json:"first_name" validate:"required,min=2,max=50"`
	LastName  string `json:"last_name" validate:"required,min=2,max=50"`
}

type UserUpdate struct {
	Email     *string `json:"email,omitempty" validate:"omitempty,email"`
	FirstName *string `json:"first_name,omitempty" validate:"omitempty,min=2,max=50"`
	LastName  *string `json:"last_name,omitempty" validate:"omitempty,min=2,max=50"`
	IsActive  *bool   `json:"is_active,omitempty"`
}

type UserLogin struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type UserResponse struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword checks if a password matches the hash
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Username:  u.Username,
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		IsActive:  u.IsActive,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

// Validate checks if the user data is valid
func (u *UserCreate) Validate() error {
	if len(u.Username) < 3 || len(u.Username) > 50 {
		return fmt.Errorf("username must be between 3 and 50 characters")
	}
	if len(u.Password) < 6 {
		return fmt.Errorf("password must be at least 6 characters")
	}
	if len(u.FirstName) < 2 || len(u.FirstName) > 50 {
		return fmt.Errorf("first name must be between 2 and 50 characters")
	}
	if len(u.LastName) < 2 || len(u.LastName) > 50 {
		return fmt.Errorf("last name must be between 2 and 50 characters")
	}
	return nil
}
```

### 2. JWT Utilities (utils/jwt.go)

```go title="JWT Utilities (utils/jwt.go)"
package utils

import (
	"errors"
	"os"
	"time"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

func init() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-secret-key-change-in-production"
	}
	jwtSecret = []byte(secret)
}

type Claims struct {
	UserID   int      `json:"user_id"`
	Username string   `json:"username"`
	Roles    []string `json:"roles"`
	jwt.RegisteredClaims
}

func GenerateToken(userID int, username string, roles []string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	
	claims := &Claims{
		UserID:   userID,
		Username: username,
		Roles:    roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "user-management-api",
			Subject:   username,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

func GetTokenFromHeader(authHeader string) (string, error) {
	if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
		return "", errors.New("invalid authorization header format")
	}
	return authHeader[7:], nil
}
```

## Controllers and Routes

### 1. Authentication Handler (handlers/auth_handler.go)

```go title="Authentication Handler"
package handlers

import (
	"encoding/json"
	"net/http"
	"user-management-api/middleware"
	"user-management-api/models"
	"user-management-api/repository"
	"user-management-api/utils"
)

type AuthHandler struct {
	userRepo *repository.UserRepository
}

func NewAuthHandler(userRepo *repository.UserRepository) *AuthHandler {
	return &AuthHandler{userRepo: userRepo}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var userCreate models.UserCreate
	if err := json.NewDecoder(r.Body).Decode(&userCreate); err != nil {
		middleware.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := userCreate.Validate(); err != nil {
		middleware.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	// Check whether the user already exists
	existingUser, _ := h.userRepo.GetUserByUsername(userCreate.Username)
	if existingUser != nil {
		middleware.SendErrorResponse(w, http.StatusConflict, "Username already exists")
		return
	}

	// Create the user
	user, err := h.userRepo.CreateUser(&userCreate)
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	// Generate the JWT token
	token, err := utils.GenerateToken(user.ID, user.Username, []string{})
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	response := map[string]interface{}{
		"user":  user.ToResponse(),
		"token": token,
	}

	middleware.SendJSONResponse(w, http.StatusCreated, response, "User registered successfully")
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var loginData models.UserLogin
	if err := json.NewDecoder(r.Body).Decode(&loginData); err != nil {
		middleware.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if loginData.Username == "" || loginData.Password == "" {
		middleware.SendErrorResponse(w, http.StatusBadRequest, "Username and password are required")
		return
	}

	// Get the user
	user, err := h.userRepo.GetUserByUsername(loginData.Username)
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	if !user.IsActive {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "User account is deactivated")
		return
	}

	// Verify the password
	if !user.CheckPassword(loginData.Password) {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	// Generate the JWT token
	token, err := utils.GenerateToken(user.ID, user.Username, []string{})
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	response := map[string]interface{}{
		"user":  user.ToResponse(),
		"token": token,
	}

	middleware.SendJSONResponse(w, http.StatusOK, response, "Login successful")
}
```

## Middlewares

### 1. Authentication Middleware (middleware/auth.go)

```go title="Authentication Middleware"
package middleware

import (
	"context"
	"net/http"
	"user-management-api/utils"
)

type contextKey string

const (
	UserContextKey contextKey = "user"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/health" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		token, err := utils.GetTokenFromHeader(authHeader)
		if err != nil {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		claims, err := utils.ValidateToken(token)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserFromContext(ctx context.Context) *utils.Claims {
	if user, ok := ctx.Value(UserContextKey).(*utils.Claims); ok {
		return user
	}
	return nil
}

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func SendJSONResponse(w http.ResponseWriter, statusCode int, data interface{}, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := Response{
		Success: statusCode < 400,
		Message: message,
		Data:    data,
	}

	if statusCode >= 400 {
		response.Success = false
		response.Error = message
		response.Message = ""
	}

	json.NewEncoder(w).Encode(response)
}

func SendErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	SendJSONResponse(w, statusCode, nil, message)
}
```

### 2. CORS Middleware (middleware/cors.go)

```go title="CORS Middleware (middleware/cors.go)"
package middleware

import "net/http"

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
```

### 3. Logging Middleware (middleware/logging.go)

```go title="Logging Middleware"
package middleware

import (
	"log"
	"net/http"
	"time"
)

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(rw, r)
		
		duration := time.Since(start)
		log.Printf("%s %s %d %v", r.Method, r.URL.Path, rw.statusCode, duration)
	})
}
```

## Tests

### 1. Authentication Test (tests/auth_test.go)

```go title="Authentication Test"
package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"user-management-api/handlers"
	"user-management-api/models"
	"user-management-api/repository"
)

func TestRegister(t *testing.T) {
	// Setup
	userRepo := &repository.UserRepository{} // Mock repository
	authHandler := handlers.NewAuthHandler(userRepo)

	// Test data
	userCreate := models.UserCreate{
		Username:  "testuser",
		Email:     "test@example.com",
		Password:  "password123",
		FirstName: "Test",
		LastName:  "User",
	}

	jsonData, _ := json.Marshal(userCreate)
	req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(authHandler.Register)

	// Execute
	handler.ServeHTTP(rr, req)

	// Assert
	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("Expected status %d, got %d", http.StatusCreated, status)
	}
}
```

## Endpoint Examples

### 1. User Registration

```bash title="User Registration"
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 2. Login

```bash title="Login"
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 3. Get Users (with token)

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Running the Project

### 1. Configure the Database

```bash title="Configure the Database"
# Create the database
createdb user_management

# Or using psql
psql -U postgres -c "CREATE DATABASE user_management;"
```

### 2. Run the Server

```bash title="Run the Server"
# Development
go run main.go

# Build
go build -o bin/user-management-api main.go

# Run the binary
./bin/user-management-api
```

### 3. Utility Scripts

**run.sh (Linux/macOS):**
```bash title="Utility Scripts"
#!/bin/bash
export DATABASE_URL="postgres://postgres:password@localhost:5432/user_management?sslmode=disable"
export JWT_SECRET="your-secret-key"
export PORT="8080"
go run main.go
```

**run.bat (Windows):**
```batch title="Utility Scripts (2)"
@echo off
set DATABASE_URL=postgres://postgres:password@localhost:5432/user_management?sslmode=disable
set JWT_SECRET=your-secret-key
set PORT=8080
go run main.go
```

## Deployment

### 1. Dockerfile

```dockerfile title="Dockerfile"
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

### 2. docker-compose.yml

```yaml title="docker-compose.yml"
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/user_management?sslmode=disable
      - JWT_SECRET=your-secret-key
      - PORT=8080
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=user_management
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Production Deployment

**Heroku:**
```bash title="Production Deployment"
# Install the Heroku CLI
# Create the app
heroku create your-app-name

# Set variables
heroku config:set DATABASE_URL=your-database-url
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main
```

**Railway:**
```bash title="Production Deployment (2)"
# Install the Railway CLI
npm install -g @railway/cli

# Log in and deploy
railway login
railway init
railway up
```

## Best Practices

### 1. Code Versioning

```bash title="Code Versioning"
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Create feature branches
git checkout -b feature/user-authentication
git checkout -b feature/role-management
```

### 2. API Documentation

Use Swagger/OpenAPI:

```go title="API Documentation"
//go:generate swag init
// @title User Management API
// @version 1.0
// @description API for user management with JWT authentication

// @host localhost:8080
// @BasePath /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
```

### 3. Testing

```bash title="Testing"
# Run all tests
go test ./...

# With coverage
go test -cover ./...

# Specific tests
go test ./handlers -v
```

### 4. Linting and Formatting

```bash title="Linting and Formatting"
# Install tools
go install golang.org/x/lint/golint@latest
go install golang.org/x/tools/cmd/goimports@latest

# Format code
go fmt ./...

# Linting
golint ./...
```

### 5. Production Configuration

```env title=".env.production"
# .env.production
DATABASE_URL=postgres://user:password@prod-db:5432/user_management?sslmode=require
JWT_SECRET=very-secure-secret-key-for-production
PORT=8080
ENV=production
LOG_LEVEL=error
```

## Conclusion

This guide gives you a solid foundation for building REST APIs in Go. The project includes:

- JWT authentication
- Role-based access control
- PostgreSQL database
- Middlewares for CORS, logging and authentication
- Organized project structure
- Unit tests
- Complete documentation
- Deployment scripts

To keep developing, you can add:
- Rate limiting
- Redis caching
- Structured logging
- Metrics with Prometheus
- Automatic documentation with Swagger
- Integration tests
- CI/CD with GitHub Actions

Happy coding!
