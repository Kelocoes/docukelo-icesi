---
sidebar_position: 2
---

# Guía de Testing en NestJS

En NestJS, el testing es super importante para asegurar la calidad y estabilidad de tus aplicaciones. Existen dos tipos principales de pruebas:

- **Pruebas unitarias**: Verifican el funcionamiento de unidades individuales de código (funciones, métodos, servicios).
- **Pruebas de integración**: Evalúan cómo interactúan entre sí los distintos componentes de la aplicación (controladores, servicios, base de datos).

NestJS utiliza [Jest](https://jestjs.io/) como framework de testing por defecto, y para pruebas de integración HTTP se recomienda [Supertest](https://github.com/visionmedia/supertest).

## ¿Por qué hacer testing?

Las pruebas permiten detectar errores antes de que lleguen a producción, facilitan el mantenimiento y la evolución del código, y ayudan a documentar el comportamiento esperado de la aplicación.

### Métricas de cobertura

Cuando ejecutas tus pruebas, obtienes métricas como:

- **% Stmts (Statements)**: Porcentaje de declaraciones ejecutadas.
- **% Branch (Branches)**: Porcentaje de rutas lógicas (if, else, switch) cubiertas.
- **% Funcs (Functions)**: Porcentaje de funciones/métodos llamados.
- **% Lines**: Porcentaje de líneas ejecutables cubiertas.

Un bajo porcentaje indica que hay partes del código sin probar, lo que puede llevar a errores no detectados.

## 1. Pruebas Unitarias en NestJS

Las pruebas unitarias se centran en componentes individuales, como servicios o controladores. El objetivo es aislar la unidad bajo prueba, simulando sus dependencias.

### Primeros pasos

Ejecuta el siguiente comando para ver la cobertura actual de tu proyecto, puedes basarte en [este](https://github.com/Kelocoes/compunet3-20252.git) repositorio de ejemplo:

```bash
npm run test:cov
```

Observa el reporte y analiza qué archivos tienen baja cobertura.

### Ejemplo básico: Servicio de Usuarios

Supón que tienes el servicio `src/users/users.service.ts`. Crea el archivo de pruebas `users.service.spec.ts` en la misma carpeta.

#### Paso 1: Configuración inicial

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppLogger } from '../../common/logger/logger.service';

const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const mockRolesService = { findByName: jest.fn() };
const mockLogger = { debug: jest.fn(), log: jest.fn(), error: jest.fn(), warn: jest.fn() };

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: RolesService, useValue: mockRolesService },
                { provide: getRepositoryToken(User), useValue: mockRepository },
                { provide: AppLogger, useValue: mockLogger },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
```

> **Tip:** Ejecuta este test y verifica que el entorno está correctamente configurado antes de avanzar.

#### Paso 2: Prueba de creación de usuario

Agrega una prueba para el método `create`:

```typescript
it('should create a user successfully when role exists', async () => {
    const createUserDto = { username: 'testuser', email: 'test@example.com', passwordHash: 'hashedpassword', bio: 'Test bio', roleName: 'admin' };
    const mockRole = { id: 1, name: 'admin', description: 'Administrator role' };
    const mockCreatedUser = { id: 1, ...createUserDto, role: mockRole };
    const mockSavedUser = { id: 1, username: 'testuser', email: 'test@example.com', passwordHash: 'hashedpassword', bio: 'Test bio', role: mockRole };

    mockRolesService.findByName.mockResolvedValue(mockRole);
    mockRepository.create = jest.fn().mockReturnValue(mockCreatedUser);
    mockRepository.save.mockResolvedValue(mockSavedUser);

    const result = await service.create(createUserDto);

    expect(mockRolesService.findByName).toHaveBeenCalledWith('admin');
    expect(mockRepository.create).toHaveBeenCalledWith({ ...createUserDto, role: mockRole });
    expect(mockRepository.save).toHaveBeenCalledWith(mockCreatedUser);
    expect(result).toEqual(mockSavedUser);
});
```

> **Ejercicio:** Ejecuta la prueba y verifica que pase. Modifica el DTO y observa cómo cambian los resultados.

#### Paso 3: Prueba de consulta de usuarios

```typescript
it('should return an array of users', async () => {
    const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@example.com', bio: 'Bio 1' },
        { id: 2, username: 'user2', email: 'user2@example.com', bio: 'Bio 2' },
    ];

    mockRepository.find.mockResolvedValue(mockUsers);

    const result = await service.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
});
```

> **Recomendación:** Agrega pruebas para los métodos `findOne`, `update` y `remove` siguiendo el mismo patrón.

## 2. Pruebas de Integración (E2E) en NestJS

Las pruebas de integración verifican que los módulos funcionen correctamente juntos, incluyendo rutas HTTP y acceso a la base de datos.

### Estructura recomendada

Organiza tus pruebas E2E en la carpeta `test/` en la raíz del proyecto:

```
proyecto/
├── src/
├── test/
│   ├── app.e2e-spec.ts
│   ├── users.e2e-spec.ts
│   ├── helpers/
│   └── fixtures/
```

### Instalación de Supertest

```bash
npm install --save-dev supertest
```

### Ejemplo básico: Prueba E2E de usuarios

#### Paso 1: Configuración y login

```typescript
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Users E2E', () => {
    let app: INestApplication;
    let adminToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Login y obtención de token
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@mail.com', password: 'password123' })
            .expect(201);

        adminToken = response.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });
```

#### Paso 2: Crear usuario vía API

```typescript
    it('should create a new user', async () => {
        const createUserDto = {
            username: 'newuser',
            email: 'newuser@test.com',
            passwordHash: 'password123',
            bio: 'New test user',
            roleName: 'admin',
        };

        const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(createUserDto)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(createUserDto.username);
    });
```

#### Paso 3: Consultar usuarios

```typescript
    it('should return all users', async () => {
        const response = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
});
```

> **Sugerencia:** Agrega pruebas para consultar por ID, actualizar y eliminar usuarios.

