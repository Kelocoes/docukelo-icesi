---
sidebar_position: 3
---

# Complete Guide: REST API with Go from Scratch

This guide teaches you how to build a complete REST API in Go with JWT authentication, Role-Based Access Control (RBAC), and PostgreSQL database persistence.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Project Initialization](#project-initialization)
4. [Base Configuration](#base-configuration)
5. [Models and Database](#models-and-database)
6. [Controllers and Routes](#controllers-and-routes)
7. [Middlewares](#middlewares)
8. [Testing](#testing)
9. [Endpoint Examples](#endpoint-examples)
10. [Running the Project](#running-the-project)
11. [Deployment](#deployment)
12. [Best Practices](#best-practices)

## Prerequisites

### 1. Go Installation

**Recommended version:** Go 1.21 or higher

**Windows:**
```bash
# Download from https://golang.org/dl/
# Or via Chocolatey
choco install golang

# Verify installation
go version
```

**Linux / macOS:**
```bash
# Ubuntu / Debian
sudo apt update
sudo apt install golang-go

# macOS with Homebrew
brew install go

# Verify installation
go version
```

### 2. Dependency Installation

**PostgreSQL:**
```bash
# Windows
# Download from https://www.postgresql.org/download/windows/

# Ubuntu / Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Start service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

**Git:**
```bash
# Windows: https://git-scm.com/download/win
# Linux: sudo apt install git
# macOS: brew install git
```

### 3. Environment Variables Setup

Create a `.env` file:
```env
# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/user_management?sslmode=disable

# JWT Secret
JWT_SECRET=your-very-secure-secret-key-change-in-production

# Server Port
PORT=8080

# Environment
ENV=development
```

## Project Structure

```
user-management-api/
├── main.go                    # Server entry point
├── go.mod                     # Go module file
├── go.sum                     # Dependency checksums
├── .env                       # Environment variables
├── .gitignore                 # Files ignored by Git
├── README.md                  # Project documentation
├── models/                    # Data models
│   ├── user.go
│   ├── role.go
│   └── permission.go
├── repository/                # Data access layer
│   ├── user_repository.go
│   ├── role_repository.go
│   └── permission_repository.go
├── handlers/                  # HTTP Handlers / Controllers
│   ├── auth_handler.go
│   ├── user_handler.go
│   ├── role_handler.go
│   └── permission_handler.go
├── middleware/                # HTTP Middlewares
│   ├── auth.go
│   ├── cors.go
│   └── logging.go
├── utils/                     # Helper utilities
│   └── jwt.go
├── tests/                     # Unit test suites
│   ├── auth_test.go
│   └── user_test.go
├── scripts/                   # SQL Utility scripts
│   ├── init_db.sql
│   └── seed_data.sql
├── Dockerfile                 # Container setup
├── docker-compose.yml         # Container orchestration
└── docs/                      # Additional documentation
    └── api.md
```

## Project Initialization

### 1. Create the Module

```bash
mkdir user-management-api
cd user-management-api
go mod init user-management-api
```

### 2. Install Dependencies

```bash
# Main dependencies
go get github.com/gorilla/mux@v1.8.1
go get github.com/lib/pq@v1.10.9
go get github.com/golang-jwt/jwt/v5@v5.2.1
go get github.com/joho/godotenv@v1.5.1
go get golang.org/x/crypto@v0.26.0

# Development / testing dependencies
go get github.com/stretchr/testify@v1.8.4
```

### 3. Create Folder Structure

```bash
mkdir models repository handlers middleware utils tests scripts docs
```

## Base Configuration

### 1. Main Server Entrypoint (`main.go`)

```go
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
		log.Printf("Could not load .env file: %v", err)
	}

	// Initialize database
	db, err := initDB()
	if err != nil {
		log.Fatal("Error connecting to database:", err)
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

	// Configure router
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

	// Initialize schema tables
	if err := initTables(db); err != nil {
		log.Fatal("Error initializing tables:", err)
	}

	// Seed default data
	if err := createDefaultData(db); err != nil {
		log.Fatal("Error creating default data:", err)
	}

	// Configure server
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

	// Start server asynchronously
	go func() {
		log.Printf("Server listening on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server startup error:", err)
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
		return nil, fmt.Errorf("DATABASE_URL is not set")
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db, nil
}

func initTables(db *sql.DB) error {
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

### 2. `.gitignore` File

```gitignore
# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
bin/

# Go Workspaces
go.work
go.work.sum

# Environment variables
.env
.env.local
.env.production

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Logs & Databases
*.log
*.db
*.sqlite

# OS
.DS_Store
Thumbs.db
```

## Models and Database

### 1. User Model (`models/user.go`)

```go
package models

import (
	"fmt"
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

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

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

### 2. JWT Utilities (`utils/jwt.go`)

```go
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

### Auth Handler (`handlers/auth_handler.go`)

```go
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

	existingUser, _ := h.userRepo.GetUserByUsername(userCreate.Username)
	if existingUser != nil {
		middleware.SendErrorResponse(w, http.StatusConflict, "Username already exists")
		return
	}

	user, err := h.userRepo.CreateUser(&userCreate)
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

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

	user, err := h.userRepo.GetUserByUsername(loginData.Username)
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	if !user.IsActive {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "User account is deactivated")
		return
	}

	if !user.CheckPassword(loginData.Password) {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

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

### 1. Authentication Middleware (`middleware/auth.go`)

```go
package middleware

import (
	"context"
	"encoding/json"
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

### 2. CORS Middleware (`middleware/cors.go`)

```go
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

### 3. Logging Middleware (`middleware/logging.go`)

```go
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

## Testing

### Unit Test (`tests/auth_test.go`)

```go
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
	userRepo := &repository.UserRepository{}
	authHandler := handlers.NewAuthHandler(userRepo)

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

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("Expected status %d, got %d", http.StatusCreated, status)
	}
}
```

## Endpoint Examples

### 1. Register User
```bash
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
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 3. Get Users (Protected Route)
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Running the Project

```bash
# Create PostgreSQL database
createdb user_management

# Development run
go run main.go

# Compile binary
go build -o bin/user-management-api main.go
./bin/user-management-api
```

## Deployment with Docker

### Dockerfile
```dockerfile
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

### docker-compose.yml
```yaml
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

## Summary & Best Practices

- ✅ JWT Authentication & Password Hashing via bcrypt
- ✅ Clean layered architecture (models, repository, handlers, middleware)
- ✅ PostgreSQL database driver (`lib/pq`) with connection pooling
- ✅ CORS, Logging, and Auth Middlewares
- ✅ Unit testing with `httptest`
