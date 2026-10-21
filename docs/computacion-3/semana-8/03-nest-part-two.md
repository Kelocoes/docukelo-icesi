---
sidebar_position: 3
---

# NestJS y TypeORM

Guía detallada para iniciar un proyecto con NestJS y TypeORM.

## 1. Instalación de TypeORM y dependencias

TypeORM es un ORM (Object-Relational Mapper) que facilita la interacción con bases de datos en aplicaciones Node.js. Para usar TypeORM con NestJS, primero instala las siguientes dependencias:

```bash
npm install --save @nestjs/typeorm typeorm @nestjs/config pg
```

## 2. Configuración de TypeORM en NestJS

Para configurar TypeORM en tu aplicación NestJS, importa el módulo `TypeOrmModule` en tu módulo principal (usualmente `AppModule`). Aquí tienes un ejemplo de configuración básica:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

type SupportedDbTypes =
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'mongodb'
    | 'oracle';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        RolesModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<SupportedDbTypes>('DB_TYPE') ?? 'mysql',
                host: configService.get<string>('DB_HOST') ?? 'localhost',
                port: configService.get<number>('DB_PORT') ?? 5432,
                username: configService.get<string>('DB_USERNAME') ?? 'root',
                password: configService.get<string>('DB_PASSWORD') ?? 'root',
                database: configService.get<string>('DB_DATABASE') ?? 'test',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE') ?? false,
            }),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```

La configuración se realiza de manera asíncrona usando `forRootAsync`, lo que permite inyectar el `ConfigService` para obtener las variables de entorno necesarias. Aunque podrías usar `process.env` directamente, `ConfigService` es la opción recomendada en NestJS para manejar configuraciones de forma estructurada y segura.

La propiedad `synchronize` controla si TypeORM sincroniza automáticamente el esquema de la base de datos con tus entidades cada vez que la aplicación inicia. Es útil durante el desarrollo, pero en producción debe estar en `false` para evitar cambios inesperados en la base de datos.

## 3. Definición de la entidad Usuario con TypeORM

TypeORM ofrece herramientas similares a JPA en Java. Así defines una entidad `User`:

```typescript
import { Role } from 'src/roles/entities/role.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true })
    bio: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
```

Explicación de los decoradores principales:
- `@Entity('users')`: Indica que la clase representa la tabla `users`.
- `@PrimaryGeneratedColumn()`: Columna primaria autogenerada.
- `@Column()`: Define una columna en la tabla.
- `@CreateDateColumn()`: Fecha de creación automática.
- `@ManyToOne()`: Relación muchos a uno con la entidad `Role`.
- `@JoinColumn()`: Especifica la columna de la relación.

## 4. Definición de la entidad Role con TypeORM

Para cerrar la relación entre usuario y rol, define la entidad `Role` así:

```typescript
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
```

- `@OneToMany()`: Relación uno a muchos con la entidad `User`.

## 5. Modificación del servicio de roles para usar TypeORM

Ahora el servicio de roles utiliza el repositorio de TypeORM en lugar de un arreglo en memoria:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const newRole = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(newRole);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async findOne(id: number): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ id });
    }

    async update(
        id: number,
        updateRoleDto: UpdateRoleDto,
    ): Promise<Role | null> {
        await this.roleRepository.update(id, updateRoleDto);
        return await this.roleRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.roleRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }

    async findByName(name: string): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ name });
    }
}
```

Ahora puedes aprovechar todas las capacidades de TypeORM para manejar entidades y relaciones.

### Métodos avanzados del repositorio de TypeORM

Además de los métodos básicos (`create`, `save`, `find`, `findOneBy`, `update`, `delete`), el repositorio de TypeORM ofrece muchas funcionalidades útiles:

#### 1. `find` con opciones avanzadas

```typescript
const users = await userRepository.find({
    where: { role: { name: 'admin' } },
    order: { createdAt: 'DESC' },
    skip: 0,
    take: 10,
    relations: ['role'],
});
```

#### 2. `findOne` y `findOneByOrFail`

```typescript
const user = await userRepository.findOne({ where: { email: 'correo@ejemplo.com' } });
const user = await userRepository.findOneByOrFail({ id: 1 });
```

#### 3. `count`

```typescript
const count = await userRepository.count({ where: { role: { name: 'admin' } } });
```

#### 4. `query` para SQL personalizado

```typescript
const rawUsers = await userRepository.query('SELECT * FROM users WHERE email LIKE $1', ['%@gmail.com']);
```

#### 5. `findAndCount`

```typescript
const [users, total] = await userRepository.findAndCount({
    where: { role: { name: 'admin' } },
    skip: 0,
    take: 10,
});
```

#### 6. `save` con arreglos

```typescript
const roles = await roleRepository.save([
    { name: 'admin', description: 'Administrador' },
    { name: 'user', description: 'Usuario estándar' },
]);
```

#### 7. Relaciones y consultas anidadas

```typescript
const users = await userRepository.find({
    relations: ['role', 'posts', 'posts.comments'],
});
```

Consulta la [documentación oficial de TypeORM](https://typeorm.io/repository-api) para más detalles.

## 6. Adaptación de los tests del servicio de roles

Para probar el servicio de roles con TypeORM, utiliza un repositorio simulado (mock):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
};

describe('RolesService', () => {
    let service: RolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesService,
                {
                    provide: getRepositoryToken(Role),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
```

Así puedes probar el servicio sin una base de datos real, facilitando las pruebas unitarias.

Para el controlador de roles:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
    let controller: RolesController;
    const mockRolesService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [{ provide: RolesService, useValue: mockRolesService }],
        }).compile();

        controller = module.get<RolesController>(RolesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
```

Se utiliza un mock del servicio para probar el controlador de manera aislada.

## 7. Modificación del servicio de usuarios para usar TypeORM

El servicio de usuarios también debe usar el repositorio de TypeORM:

```typescript
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private rolesService: RolesService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const role = await this.rolesService.findByName(createUserDto.roleName);
        if (!role) {
            throw new Error('Role not found');
        }

        const newUser = this.userRepository.create({
            ...createUserDto,
            role,
        });
        return await this.userRepository.save(newUser);
    }

    findAll() {
        return this.userRepository.find();
    }

    findOne(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const result = await this.userRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }
}
```

Los tests para este servicio deben adaptarse de manera similar, usando mocks para los repositorios.

## 8. Importación de repositorios en los módulos

Asegúrate de importar `TypeOrmModule.forFeature` en los módulos donde uses los repositorios:

```typescript
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}
```

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from 'src/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [RolesModule, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
```

## 9. Resumen

Para migrar de un sistema en memoria a uno con base de datos relacional usando TypeORM en NestJS, sigue estos pasos:

1. **Instala las dependencias** necesarias (`@nestjs/typeorm`, `typeorm`, `@nestjs/config`, y el driver de base de datos).
2. **Configura TypeORM** en el módulo principal usando `forRootAsync` y `ConfigService`.
3. **Define las entidades** (`User` y `Role`) con los decoradores de TypeORM.
4. **Modifica los servicios** para usar repositorios de TypeORM en vez de arreglos en memoria.
5. **Actualiza los tests** para usar mocks de los repositorios.
6. **Importa los repositorios** en los módulos correspondientes con `TypeOrmModule.forFeature`.
7. **Maneja correctamente las relaciones** entre entidades.
8. **Utiliza buenas prácticas de configuración** con `ConfigService`.
9. **Aprovecha los métodos avanzados** de los repositorios de TypeORM para consultas y operaciones complejas.

## 10. Further Reading

- [Documentación oficial de NestJS - TypeORM](https://docs.nestjs.com/techniques/database)
- [Documentación oficial de TypeORM](https://typeorm.io/)

## 11. TODO

- [ ] Añadir las entidades de Permisos y la relación muchos a muchos con Roles.
- [ ] Añadir la entidad de Games y su relación con Users.