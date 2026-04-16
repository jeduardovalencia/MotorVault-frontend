# 🚗 MotorVault — Sistema de Gestión de Vehículos Personales

> Aplicación fullstack para que los usuarios registren y gestionen su flota de vehículos personales, con autenticación segura mediante JWT y panel de administración completo.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints API](#endpoints-api)
- [Base de Datos](#base-de-datos)
- [Credenciales de Prueba](#credenciales-de-prueba)

---

## 📖 Descripción

**MotorVault** es un sistema web fullstack tipo *garage digital personal*, donde cada usuario puede registrarse, autenticarse y gestionar sus propios vehículos. El sistema cuenta con dos roles: **usuario** y **administrador**, cada uno con su propio panel de control.

---

## 🛠 Tecnologías

### Backend
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6-green)
![JWT](https://img.shields.io/badge/JWT-JJWT%200.12.5-blue)
![JPA](https://img.shields.io/badge/JPA-Hibernate-blue)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-red)
![Lombok](https://img.shields.io/badge/Lombok-✓-yellow)
![MapStruct](https://img.shields.io/badge/MapStruct-✓-yellow)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-green)

### Frontend
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)
![Axios](https://img.shields.io/badge/Axios-✓-blue)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-✓-pink)
![Zod](https://img.shields.io/badge/Zod-✓-blue)

---

## ✨ Características

### 👤 Panel de Usuario
- ✅ Registro e inicio de sesión con JWT
- ✅ CRUD completo de vehículos (marca, modelo, año, placa, color)
- ✅ Subida de foto del vehículo (base64)
- ✅ Búsqueda por placa o modelo
- ✅ Filtrado por año o marca
- ✅ Importación masiva desde archivo CSV / Excel
- ✅ Plantilla CSV descargable
- ✅ Diseño responsive (mobile-first)
- ✅ Modo oscuro / claro

### 👑 Panel de Administración
- ✅ Dashboard con estadísticas globales (usuarios, vehículos, marcas)
- ✅ Gestión de usuarios (activar/bloquear, cambiar roles)
- ✅ Gestión de todos los vehículos del sistema
- ✅ Logs de actividad (login, creación, eliminación)
- ✅ Filtros por fecha, acción y usuario

### 🔐 Seguridad
- ✅ Autenticación stateless con JWT (HS512)
- ✅ Roles: `ROLE_USER` y `ROLE_ADMIN`
- ✅ Control de acceso por propietario del recurso
- ✅ Soft delete (nunca se elimina físicamente)
- ✅ Auditoría automática (`createdAt`, `updatedAt`)

---

## 🏗 Arquitectura

```
motorvault-backend/
├── config/          # SecurityConfig, CorsConfig, OpenApiConfig
├── controller/      # AuthController, VehicleController, AdminController
├── dto/             # Request y Response DTOs
├── entity/          # User, Vehicle, ActivityLog
├── exception/       # GlobalExceptionHandler
├── mapper/          # MapStruct mappers
├── repository/      # JPA Repositories
├── security/        # JWT, UserDetailsService, CustomUserDetails
└── service/         # Lógica de negocio

motorvault-frontend/
├── api/             # axiosConfig, authApi, vehicleApi, adminApi
├── components/      # layout, ui, vehicles, admin
├── context/         # AuthContext, ThemeContext
├── hooks/           # useAuth
├── pages/           # LoginPage, RegisterPage, DashboardPage
└── pages/admin/     # AdminDashboard, AdminUsuarios, AdminVehiculos, AdminLogs
```

---

## 📦 Requisitos Previos

- Java 21+
- Maven 3.8+
- Node.js 18+
- SQL Server 2019+ (con TCP/IP habilitado en puerto 1433)
- Git

---

## 🚀 Instalación

### 1. Clonar repositorios

```bash
git clone https://github.com/jeduardovalencia/MotorVault-backend.git
git clone https://github.com/jeduardovalencia/MotorVault-frontend.git
```

### 2. Base de datos

Ejecutar en SQL Server Management Studio:

```sql
CREATE DATABASE MotorVaultDB COLLATE Latin1_General_CI_AS;
GO

USE MotorVaultDB;

CREATE TABLE users (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    first_name     NVARCHAR(80)         NOT NULL,
    last_name      NVARCHAR(80)         NOT NULL,
    email          NVARCHAR(150)        NOT NULL,
    password       NVARCHAR(255)        NOT NULL,
    role           NVARCHAR(20)         NOT NULL DEFAULT 'ROLE_USER',
    enabled        BIT                  NOT NULL DEFAULT 1,
    created_at     DATETIME2            NOT NULL DEFAULT GETDATE(),
    updated_at     DATETIME2            NOT NULL DEFAULT GETDATE(),
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE vehicles (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    placa          NVARCHAR(10)         NOT NULL,
    marca          NVARCHAR(50)         NOT NULL,
    modelo         NVARCHAR(50)         NOT NULL,
    anio           INT                  NOT NULL,
    color          NVARCHAR(30)         NULL,
    foto_url       NVARCHAR(MAX)        NULL,
    activo         BIT                  NOT NULL DEFAULT 1,
    creado_en      DATETIME2            NOT NULL DEFAULT GETDATE(),
    actualizado_en DATETIME2            NOT NULL DEFAULT GETDATE(),
    usuario_id     BIGINT               NOT NULL,
    CONSTRAINT pk_vehicles PRIMARY KEY (id),
    CONSTRAINT fk_vehicles_usuario FOREIGN KEY (usuario_id) REFERENCES users(id)
);

CREATE TABLE activity_logs (
    id            BIGINT IDENTITY(1,1) NOT NULL,
    accion        NVARCHAR(100)        NOT NULL,
    descripcion   NVARCHAR(500)        NULL,
    usuario_id    BIGINT               NOT NULL,
    usuario_email NVARCHAR(150)        NULL,
    ip            NVARCHAR(50)         NULL,
    creado_en     DATETIME2            NOT NULL DEFAULT GETDATE(),
    CONSTRAINT pk_activity_logs PRIMARY KEY (id)
);
```

### 3. Backend

```bash
cd MotorVault-backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### 4. Frontend

```bash
cd MotorVault-frontend
npm install
npm run dev
```

---

## ⚙️ Configuración

### application.yml (perfil dev)

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=MotorVaultDB;encrypt=false;trustServerCertificate=true
    username: sa
    password: TuPassword
  jpa:
    hibernate:
      ddl-auto: update

app:
  jwt:
    secret: motorvault-dev-secret-key-change-in-production-must-be-at-least-64-chars
    expiration-ms: 86400000
  cors:
    allowed-origins: http://localhost:5173
```

---

## 🌐 Endpoints API

La documentación completa está disponible en Swagger:

```
http://localhost:8080/swagger-ui/index.html
```

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Vehículos (requiere JWT)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/vehicles/mis-vehiculos` | Listar mis vehículos |
| POST | `/api/v1/vehicles` | Registrar vehículo |
| PUT | `/api/v1/vehicles/{id}` | Actualizar vehículo |
| DELETE | `/api/v1/vehicles/{id}` | Eliminar vehículo |
| GET | `/api/v1/vehicles/buscar` | Buscar con filtros |

### Administración (requiere ROLE_ADMIN)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/admin/stats` | Estadísticas globales |
| GET | `/api/v1/admin/usuarios` | Listar usuarios |
| PATCH | `/api/v1/admin/usuarios/{id}/toggle` | Activar/bloquear |
| PATCH | `/api/v1/admin/usuarios/{id}/rol` | Cambiar rol |
| GET | `/api/v1/admin/vehiculos` | Todos los vehículos |
| GET | `/api/v1/admin/logs` | Logs de actividad |

---

## 🗄️ Base de Datos

**Motor:** SQL Server  
**Base de datos:** `MotorVaultDB`

### Diagrama de tablas

```
users (1) ──────────── (N) vehicles
  id                         id
  first_name                 placa
  last_name                  marca
  email                      modelo
  password                   anio
  role                       color
  enabled                    foto_url
  created_at                 activo
  updated_at                 creado_en
                             actualizado_en
                             usuario_id (FK)

activity_logs
  id
  accion
  descripcion
  usuario_id
  usuario_email
  ip
  creado_en
```

---

## 🔑 Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@motorvault.com | Admin123! | ROLE_ADMIN |
| juan@motorvault.com | Test123! | ROLE_USER |

> ⚠️ Cambiar las contraseñas en producción.

---

## 👨‍💻 Autor

**Juan Eduardo Valencia**  
GitHub: [@jeduardovalencia](https://github.com/jeduardovalencia)

---

## 📄 Licencia

Este proyecto fue desarrollado como prueba Ufinet.