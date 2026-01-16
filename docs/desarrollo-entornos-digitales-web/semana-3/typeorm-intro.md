---
sidebar_position: 2
---

# Entidades en NestJS con TypeORM

Guía detallada para iniciar un proyecto con NestJS, TypeORM y PostgreSQL, incluyendo la creación de entidades y la configuración del entorno.

## 1. Instalación de TypeORM y dependencias

TypeORM es un ORM (Object-Relational Mapper) que facilita la interacción con bases de datos en aplicaciones Node.js. Para usar TypeORM con NestJS, primero instala las siguientes dependencias:

```bash
npm install --save @nestjs/typeorm typeorm @nestjs/config pg
```

## 2. Configuración de PostgreSQL con Docker

Para facilitar el desarrollo, puedes usar Docker para ejecutar una instancia de PostgreSQL. Crea un archivo `docker-compose.yml` con el siguiente contenido:

```yaml
services:
    db:
        image: postgres:16
        container_name: postgres-db
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
            POSTGRES_DB: mydatabase
        ports:
            - "5433:5432"
        volumes:
            - postgres_data:/var/lib/postgresql/data

volumes:
    postgres_data:
```

Luego, ejecuta el siguiente comando para iniciar el contenedor:

```bash
docker compose up
```

Crea un archivo `.env` en la raíz del proyecto para almacenar las variables de entorno:

```
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mydatabase
```

## 3. Configuración de TypeORM en NestJS

Para configurar TypeORM en tu aplicación NestJS, importa el módulo TypeOrmModule en tu módulo principal (usualmente AppModule). Aquí tienes un ejemplo de configuración básica:

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

type SupportedDbTypes =
    | "mysql"
    | "postgres"
    | "sqlite"
    | "mariadb"
    | "mongodb"
    | "oracle";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        RolesModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<SupportedDbTypes>("DB_TYPE") ?? "mysql",
                host: configService.get<string>("DB_HOST") ?? "localhost",
                port: configService.get<number>("DB_PORT") ?? 5432,
                username: configService.get<string>("DB_USERNAME") ?? "root",
                password: configService.get<string>("DB_PASSWORD") ?? "root",
                database: configService.get<string>("DB_DATABASE") ?? "test",
                entities: [__dirname + "/**/*.entity{.ts,.js}"],
                synchronize:
                    configService.get<boolean>("DB_SYNCHRONIZE") ?? false,
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

## 4. Definición de la entidad Usuario con TypeORM

Crea un módulo de usuarios con el siguiente comando:

```bash
nest generate module users
```

Luego, crea una entidad `User` en el directorio `users/entities/user.entity.ts`:

```typescript
import { Role } from "src/roles/entities/role.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

@Entity("users")
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
    @JoinColumn({ name: "role_id" })
    role: Role;
}
```

Explicación de los decoradores principales:

-   `@Entity('users')`: Indica que la clase representa la tabla `users`.
-   `@PrimaryGeneratedColumn()`: Columna primaria autogenerada.
-   `@Column()`: Define una columna en la tabla.
-   `@CreateDateColumn()`: Fecha de creación automática.
-   `@ManyToOne()`: Relación muchos a uno con la entidad `Role`.
-   `@JoinColumn()`: Especifica la columna de la relación.

## 5. Definición de la entidad Role con TypeORM

Para cerrar la relación entre usuario y rol, define la entidad `Role` en `roles/entities/role.entity.ts`:

```typescript
import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

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

-   `@OneToMany()`: Relación uno a muchos con la entidad `User`.

## 6. Modificación del servicio de roles para usar TypeORM

Los servicios en NestJS manejan la lógica de negocio. Para utilizar TypeORM en un servicio, necesitamos inyectar el repositorio de la entidad correspondiente en el constructor:

```typescript
@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) {}
}
```

El decorador `@InjectRepository` inyecta el repositorio de la entidad `Role`, lo que nos permite acceder a métodos predefinidos para interactuar con la base de datos.

:::info ¿Qué es un repositorio?

Un **repositorio** es una capa de abstracción que nos permite interactuar con la base de datos de forma sencilla, sin escribir consultas SQL manualmente. Piensa en él como un "asistente" que ya conoce todas las operaciones básicas para gestionar datos: buscar, guardar, actualizar y eliminar. TypeORM nos proporciona repositorios predefinidos con métodos listos para usar, lo que hace que nuestro código sea más limpio y fácil de mantener.

:::

### Métodos principales del repositorio de TypeORM

Los repositorios de TypeORM ofrecen una amplia variedad de métodos para realizar operaciones con la base de datos:

**Métodos de consulta:**

-   `find()`: Obtiene todos los registros que cumplan con los criterios especificados.

    ```typescript
    // Obtener todos los roles
    const allRoles = await this.roleRepository.find();

    // Obtener roles con relaciones
    const rolesWithUsers = await this.roleRepository.find({
        relations: ["users"],
    });

    // Obtener roles con filtros
    const activeRoles = await this.roleRepository.find({
        where: { name: "admin" },
        order: { createdAt: "DESC" },
    });
    ```

-   `findOne()`: Busca un único registro que cumpla con los criterios.

    ```typescript
    // Buscar por ID con relaciones
    const role = await this.roleRepository.findOne({
        where: { id: 1 },
        relations: ["users"],
    });

    // Buscar con múltiples condiciones
    const adminRole = await this.roleRepository.findOne({
        where: { name: "admin", description: "Administrator" },
    });
    ```

-   `findOneBy()`: Busca un registro por criterios específicos de forma simplificada.

    ```typescript
    // Buscar por un campo específico
    const role = await this.roleRepository.findOneBy({ id: 1 });

    // Buscar por nombre
    const adminRole = await this.roleRepository.findOneBy({ name: "admin" });

    // Buscar por múltiples campos
    const specificRole = await this.roleRepository.findOneBy({
        name: "editor",
        description: "Content Editor",
    });
    ```

-   `findAndCount()`: Retorna registros y el conteo total simultáneamente.

    ```typescript
    // Obtener roles paginados con conteo total
    const [roles, total] = await this.roleRepository.findAndCount({
        skip: 0,
        take: 10,
    });

    // Con filtros y paginación
    const [filteredRoles, count] = await this.roleRepository.findAndCount({
        where: { name: Like("%admin%") },
        skip: 10,
        take: 20,
        order: { name: "ASC" },
    });
    ```

-   `count()`: Cuenta los registros que cumplen con los criterios.

    ```typescript
    // Contar todos los roles
    const totalRoles = await this.roleRepository.count();

    // Contar con filtros
    const adminCount = await this.roleRepository.count({
        where: { name: "admin" },
    });

    // Contar con múltiples condiciones
    const specificCount = await this.roleRepository.count({
        where: { name: Like("%user%") },
    });
    ```

**Métodos de escritura:**

-   `save()`: Guarda una o más entidades (crea o actualiza).

    ```typescript
    // Crear un nuevo rol
    const newRole = this.roleRepository.create({
        name: "moderator",
        description: "Forum Moderator",
    });
    await this.roleRepository.save(newRole);

    // Actualizar un rol existente
    const existingRole = await this.roleRepository.findOneBy({ id: 1 });
    existingRole.description = "Updated description";
    await this.roleRepository.save(existingRole);

    // Guardar múltiples roles
    const roles = [
        { name: "viewer", description: "View Only" },
        { name: "contributor", description: "Can Contribute" },
    ];
    await this.roleRepository.save(roles);
    ```

-   `insert()`: Inserta nuevos registros en la base de datos.

    ```typescript
    // Insertar un único rol
    await this.roleRepository.insert({
        name: "guest",
        description: "Guest User",
    });

    // Insertar múltiples roles
    await this.roleRepository.insert([
        { name: "premium", description: "Premium User" },
        { name: "vip", description: "VIP User" },
    ]);
    ```

-   `update()`: Actualiza registros existentes por criterios.

    ```typescript
    // Actualizar por ID
    await this.roleRepository.update(1, {
        description: "New Description",
    });

    // Actualizar múltiples registros
    await this.roleRepository.update(
        { name: "admin" },
        { description: "System Administrator" }
    );

    // Actualizar con múltiples condiciones
    await this.roleRepository.update(
        { name: Like("%user%") },
        { description: "Regular User Role" }
    );
    ```

-   `delete()`: Elimina registros que cumplan con los criterios.

    ```typescript
    // Eliminar por ID
    await this.roleRepository.delete(1);

    // Eliminar por nombre
    await this.roleRepository.delete({ name: "guest" });

    // Eliminar múltiples registros
    await this.roleRepository.delete([1, 2, 3]);

    // Eliminar con condiciones
    await this.roleRepository.delete({ name: Like("%temp%") });
    ```

-   `remove()`: Elimina una o más entidades específicas.

    ```typescript
    // Eliminar una entidad
    const role = await this.roleRepository.findOneBy({ id: 1 });
    await this.roleRepository.remove(role);

    // Eliminar múltiples entidades
    const rolesToRemove = await this.roleRepository.find({
        where: { name: Like("%test%") },
    });
    await this.roleRepository.remove(rolesToRemove);
    ```

**Métodos avanzados:**

-   `createQueryBuilder()`: Permite construir consultas SQL complejas de forma programática.

    ```typescript
    // Consulta básica
    const roles = await this.roleRepository
        .createQueryBuilder("role")
        .where("role.name = :name", { name: "admin" })
        .getMany();

    // Consulta con JOIN
    const rolesWithUsers = await this.roleRepository
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.users", "user")
        .where("role.name = :name", { name: "admin" })
        .getMany();

    // Consulta compleja con múltiples condiciones
    const complexQuery = await this.roleRepository
        .createQueryBuilder("role")
        .leftJoin("role.users", "user")
        .where("role.name LIKE :name", { name: "%admin%" })
        .andWhere("user.createdAt > :date", { date: new Date("2024-01-01") })
        .orderBy("role.name", "ASC")
        .skip(0)
        .take(10)
        .getMany();

    // Consulta con agregación
    const roleStats = await this.roleRepository
        .createQueryBuilder("role")
        .leftJoin("role.users", "user")
        .select("role.name", "roleName")
        .addSelect("COUNT(user.id)", "userCount")
        .groupBy("role.id")
        .getRawMany();
    ```

-   `query()`: Ejecuta consultas SQL personalizadas directamente.

    ```typescript
    // Consulta SQL simple
    const roles = await this.roleRepository.query(
        "SELECT * FROM role WHERE name = $1",
        ["admin"]
    );

    // Consulta con JOIN
    const rolesWithCount = await this.roleRepository.query(`
        SELECT r.*, COUNT(u.id) as user_count
        FROM role r
        LEFT JOIN users u ON u.role_id = r.id
        GROUP BY r.id
    `);

    // Consulta con parámetros
    const filteredRoles = await this.roleRepository.query(
        `SELECT * FROM role 
         WHERE name LIKE $1 AND created_at > $2
         ORDER BY name ASC`,
        ["%admin%", "2024-01-01"]
    );
    ```

Estos métodos hacen que las operaciones CRUD (Create, Read, Update, Delete) sean simples y eficientes, sin necesidad de escribir SQL manualmente.

### Estructura base del servicio

Con el repositorio inyectado, definimos la estructura de métodos que implementarán la lógica de negocio para los roles:

```typescript
@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {}

    async findAll(): Promise<Role[]> {}

    async findOne(id: number): Promise<Role | null> {}

    async update(
        id: number,
        updateRoleDto: UpdateRoleDto
    ): Promise<Role | null> {}

    async remove(id: number): Promise<{ id: number } | null> {}

    async findByName(name: string): Promise<Role | null> {}
}
```

#### Método create

El método create se encarga de crear un nuevo rol en la base de datos. Utiliza el DTO (Data Transfer Object) `CreateRoleDto` para recibir los datos necesarios.

```typescript
async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto); // Crea una nueva instancia de Role
    return await this.roleRepository.save(newRole); // Guarda la nueva entidad en la base de datos
}
```

La creacion de las instancias son importantes ya que permite transformar los datos del DTO en una entidad gestionada por TypeORM, aplicando validaciones y configuraciones definidas en la entidad como restricciones de unicidad o valores por defecto.
El método `save` persiste la entidad en la base de datos y devuelve la entidad guardada, incluyendo cualquier campo generado automáticamente, como el ID.

#### Método findAll

El método findAll recupera todos los roles almacenados en la base de datos.

```typescript
async findAll(): Promise<Role[]> {
    return await this.roleRepository.find(); // Obtiene todos los registros de la tabla Role
}
```

#### Método findOne
El método findOne busca un rol específico por su ID.

```typescript
async findOne(id: number): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ id }); // Busca un rol por su ID
}
```

#### Método update

El método update modifica un rol existente basado en su ID y los datos proporcionados en el DTO `UpdateRoleDto`.

```typescript
async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    await this.roleRepository.update(id, updateRoleDto); // Actualiza el rol con los nuevos datos
    return await this.roleRepository.findOneBy({ id }); // Devuelve el rol actualizado
}
```

#### Método remove

El método remove elimina un rol de la base de datos utilizando su ID.

```typescript
async remove(id: number): Promise<{ id: number } | null> {
    const roleToDelete = await this.roleRepository.findOneBy({ id });
    if (!roleToDelete) {
        return null; // Retorna null si el rol no existe
    }
    await this.roleRepository.remove(roleToDelete); // Elimina el rol de la base de datos
    return { id }; // Retorna el ID del rol eliminado
}
```

#### Método findByName

El método findByName busca un rol por su nombre.

```typescript
async findByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ name }); // Busca un rol por su nombre
}
```

## 7. Modificación del servicio de usuarios para usar TypeORM

Similar al servicio de roles, el servicio de usuarios también necesita inyectar el repositorio de la entidad `User` para manejar las operaciones relacionadas con los usuarios.

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

## 8. Importación de repositorios en los módulos

Para que los repositorios estén disponibles para inyección en los servicios, debes importar el módulo `TypeOrmModule` en los módulos correspondientes y registrar las entidades.

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

Si de casualidad tienes ambas entidades y servicios en el mismo módulo, solo necesitas importar `TypeOrmModule.forFeature` una vez con ambas entidades:

```typescript
@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [UsersController, RolesController],
    providers: [UsersService, RolesService],
})
export class UsersModule {}
```