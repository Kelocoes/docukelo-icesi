---
sidebar_position: 3
---

# Guía Completa: API REST con Go desde Cero

Esta guía te enseñará a crear una API REST completa en Go con autenticación JWT, control de acceso basado en roles (RBAC) y base de datos PostgreSQL.

## Tabla de Contenidos

1. [Requerimientos Previos](#requerimientos-previos)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Inicialización del Proyecto](#inicialización-del-proyecto)
4. [Configuración Base](#configuración-base)
5. [Modelos y Base de Datos](#modelos-y-base-de-datos)
6. [Controladores y Rutas](#controladores-y-rutas)
7. [Middlewares](#middlewares)
8. [Pruebas](#pruebas)
9. [Ejemplos de Endpoints](#ejemplos-de-endpoints)
10. [Ejecución del Proyecto](#ejecución-del-proyecto)
11. [Despliegue](#despliegue)
12. [Buenas Prácticas](#buenas-prácticas)

## Requerimientos Previos

### 1. Instalación de Go

**Versión recomendada:** Go 1.21 o superior

**Windows:**
```bash
# Descargar desde https://golang.org/dl/
# O usar Chocolatey
choco install golang

# Verificar instalación
go version
```

**Linux/macOS:**
```bash
# Usar el instalador oficial o package manager
# Ubuntu/Debian
sudo apt update
sudo apt install golang-go

# macOS con Homebrew
brew install go

# Verificar instalación
go version
```

### 2. Instalación de Dependencias

**PostgreSQL:**
```bash
# Windows
# Descargar desde https://www.postgresql.org/download/windows/

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Iniciar servicio
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

**Git:**
```bash
# Windows: https://git-scm.com/download/win
# Linux: sudo apt install git
# macOS: brew install git
```

### 3. Configuración de Variables de Entorno

Crear archivo `.env`:
```env
# Base de datos
DATABASE_URL=postgres://postgres:password@localhost:5432/user_management?sslmode=disable

# JWT
JWT_SECRET=tu-clave-secreta-muy-segura-cambiar-en-produccion

# Servidor
PORT=8080

# Entorno
ENV=development
```

## Estructura del Proyecto

```
user-management-api/
├── main.go                    # Punto de entrada del servidor
├── go.mod                     # Módulo de Go
├── go.sum                     # Checksums de dependencias
├── .env                       # Variables de entorno
├── .gitignore                 # Archivos a ignorar en Git
├── README.md                  # Documentación del proyecto
├── models/                    # Modelos de datos
│   ├── user.go
│   ├── role.go
│   └── permission.go
├── repository/                # Capa de acceso a datos
│   ├── user_repository.go
│   ├── role_repository.go
│   └── permission_repository.go
├── handlers/                  # Controladores HTTP
│   ├── auth_handler.go
│   ├── user_handler.go
│   ├── role_handler.go
│   └── permission_handler.go
├── middleware/                # Middlewares HTTP
│   ├── auth.go
│   ├── cors.go
│   └── logging.go
├── utils/                     # Utilidades
│   └── jwt.go
├── tests/                     # Pruebas
│   ├── auth_test.go
│   └── user_test.go
├── scripts/                   # Scripts de utilidad
│   ├── init_db.sql
│   └── seed_data.sql
├── Dockerfile                 # Para contenedores
├── docker-compose.yml         # Orquestación de servicios
└── docs/                      # Documentación adicional
    └── api.md
```

## Inicialización del Proyecto

### 1. Crear el Módulo

```bash
# Crear directorio del proyecto
mkdir user-management-api
cd user-management-api

# Inicializar módulo de Go
go mod init user-management-api
```

### 2. Instalar Dependencias

```bash
# Dependencias principales
go get github.com/gorilla/mux@v1.8.1
go get github.com/lib/pq@v1.10.9
go get github.com/golang-jwt/jwt/v5@v5.2.1
go get github.com/joho/godotenv@v1.5.1
go get golang.org/x/crypto@v0.26.0

# Dependencias de desarrollo
go get github.com/stretchr/testify@v1.8.4
go get github.com/gorilla/mux@v1.8.1
```

### 3. Crear Estructura de Carpetas

```bash
mkdir models repository handlers middleware utils tests scripts docs
```

## Configuración Base

### 1. Archivo Principal (main.go)

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
	// Cargar variables de entorno
	err := godotenv.Load()
	if err != nil {
		log.Printf("No se pudo cargar .env: %v", err)
	}

	// Inicializar base de datos
	db, err := initDB()
	if err != nil {
		log.Fatal("Error conectando a la base de datos:", err)
	}
	defer db.Close()

	// Inicializar repositorios
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	permissionRepo := repository.NewPermissionRepository(db)

	// Inicializar handlers
	userHandler := handlers.NewUserHandler(userRepo, roleRepo, permissionRepo)
	authHandler := handlers.NewAuthHandler(userRepo)
	roleHandler := handlers.NewRoleHandler(roleRepo)
	permissionHandler := handlers.NewPermissionHandler(permissionRepo)

	// Configurar router
	router := mux.NewRouter()

	// Middlewares globales
	router.Use(middleware.LoggingMiddleware)
	router.Use(middleware.CORSMiddleware)

	// Rutas públicas
	router.HandleFunc("/api/auth/register", authHandler.Register).Methods("POST")
	router.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST")

	// Rutas protegidas
	protected := router.PathPrefix("/api").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	// Rutas de usuarios
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

	// Inicializar tablas
	if err := initTables(db); err != nil {
		log.Fatal("Error inicializando tablas:", err)
	}

	// Crear datos por defecto
	if err := createDefaultData(db); err != nil {
		log.Fatal("Error creando datos por defecto:", err)
	}

	// Configurar servidor
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

	// Iniciar servidor
	go func() {
		log.Printf("Servidor iniciado en puerto %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Error iniciando servidor:", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Cerrando servidor...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Error cerrando servidor:", err)
	}
}

func initDB() (*sql.DB, error) {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		return nil, fmt.Errorf("DATABASE_URL no configurada")
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	// Configurar pool de conexiones
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db, nil
}

func initTables(db *sql.DB) error {
	// Crear tabla de usuarios
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
	// Crear usuario admin por defecto
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

### 2. Archivo .gitignore

```gitignore
# Binarios
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
bin/

# Archivos de Go
go.work
go.work.sum

# Variables de entorno
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

# Base de datos
*.db
*.sqlite

# OS
.DS_Store
Thumbs.db
```

## Modelos y Base de Datos

### 1. Modelo de Usuario (models/user.go)

```go
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

### 2. Utilidades JWT (utils/jwt.go)

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

## Controladores y Rutas

### 1. Handler de Autenticación (handlers/auth_handler.go)

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

	// Verificar si el usuario ya existe
	existingUser, _ := h.userRepo.GetUserByUsername(userCreate.Username)
	if existingUser != nil {
		middleware.SendErrorResponse(w, http.StatusConflict, "Username already exists")
		return
	}

	// Crear usuario
	user, err := h.userRepo.CreateUser(&userCreate)
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	// Generar token JWT
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

	// Obtener usuario
	user, err := h.userRepo.GetUserByUsername(loginData.Username)
	if err != nil {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	if !user.IsActive {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "User account is deactivated")
		return
	}

	// Verificar contraseña
	if !user.CheckPassword(loginData.Password) {
		middleware.SendErrorResponse(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	// Generar token JWT
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

### 1. Middleware de Autenticación (middleware/auth.go)

```go
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

### 2. Middleware de CORS (middleware/cors.go)

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

### 3. Middleware de Logging (middleware/logging.go)

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

## Pruebas

### 1. Prueba de Autenticación (tests/auth_test.go)

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

## Ejemplos de Endpoints

### 1. Registro de Usuario

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

### 3. Obtener Usuarios (con token)

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Ejecución del Proyecto

### 1. Configurar Base de Datos

```bash
# Crear base de datos
createdb user_management

# O usando psql
psql -U postgres -c "CREATE DATABASE user_management;"
```

### 2. Ejecutar el Servidor

```bash
# Desarrollo
go run main.go

# Compilar
go build -o bin/user-management-api main.go

# Ejecutar binario
./bin/user-management-api
```

### 3. Scripts de Utilidad

**run.sh (Linux/macOS):**
```bash
#!/bin/bash
export DATABASE_URL="postgres://postgres:password@localhost:5432/user_management?sslmode=disable"
export JWT_SECRET="your-secret-key"
export PORT="8080"
go run main.go
```

**run.bat (Windows):**
```batch
@echo off
set DATABASE_URL=postgres://postgres:password@localhost:5432/user_management?sslmode=disable
set JWT_SECRET=your-secret-key
set PORT=8080
go run main.go
```

## Despliegue

### 1. Dockerfile

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

### 2. docker-compose.yml

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

### 3. Despliegue en Producción

**Heroku:**
```bash
# Instalar Heroku CLI
# Crear app
heroku create your-app-name

# Configurar variables
heroku config:set DATABASE_URL=your-database-url
heroku config:set JWT_SECRET=your-secret-key

# Desplegar
git push heroku main
```

**Railway:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y desplegar
railway login
railway init
railway up
```

## Buenas Prácticas

### 1. Versionado del Código

```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit"

# Crear ramas para features
git checkout -b feature/user-authentication
git checkout -b feature/role-management
```

### 2. Documentación de API

Usar Swagger/OpenAPI:

```go
//go:generate swag init
// @title User Management API
// @version 1.0
// @description API para gestión de usuarios con autenticación JWT

// @host localhost:8080
// @BasePath /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
```

### 3. Testing

```bash
# Ejecutar todas las pruebas
go test ./...

# Con cobertura
go test -cover ./...

# Pruebas específicas
go test ./handlers -v
```

### 4. Linting y Formateo

```bash
# Instalar herramientas
go install golang.org/x/lint/golint@latest
go install golang.org/x/tools/cmd/goimports@latest

# Formatear código
go fmt ./...

# Linting
golint ./...
```

### 5. Configuración de Producción

```env
# .env.production
DATABASE_URL=postgres://user:password@prod-db:5432/user_management?sslmode=require
JWT_SECRET=very-secure-secret-key-for-production
PORT=8080
ENV=production
LOG_LEVEL=error
```

## Conclusión

Esta guía te proporciona una base sólida para crear APIs REST en Go. El proyecto incluye:

- ✅ Autenticación JWT
- ✅ Control de acceso basado en roles
- ✅ Base de datos PostgreSQL
- ✅ Middlewares para CORS, logging y autenticación
- ✅ Estructura de proyecto organizada
- ✅ Pruebas unitarias
- ✅ Documentación completa
- ✅ Scripts de despliegue

Para continuar desarrollando, puedes agregar:
- Rate limiting
- Caché con Redis
- Logging estructurado
- Métricas con Prometheus
- Documentación automática con Swagger
- Pruebas de integración
- CI/CD con GitHub Actions

¡Feliz programación! 🚀
