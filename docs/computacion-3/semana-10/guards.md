---
sidebar_position: 1
---

# Guards y Passport

Para trabajar con los Guards en Nest existen varias estrategias, una de las más comunes es usar la librería [Passport](https://www.passportjs.org/), que es un middleware de autenticación para Node.js. Passport proporciona una forma sencilla de implementar diferentes estrategias de autenticación, como JWT, OAuth, entre otras.

Primero necesitas instalar las siguientes dependencias:

```bash
npm install @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

Estas dependencias te permitirán usar Passport con JWT en tu aplicación NestJS, por defecto Nest ofrece el sistema de Guards, pero Passport facilita la implementación de estrategias de autenticación.


Además de eso, crearemos un script para poblar la base de datos con ususarios, roles y permisos iniciales por medio de un archivo `seed.ts` en la carpeta `src`:

```typescript
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';
import { RolePermission } from '../auth/entities/role-permission.entity';
dotenv.config();

type SupportedDbTypes =
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'mongodb'
    | 'oracle';

const AppDataSource = new DataSource({
    type: (process.env.DB_TYPE as SupportedDbTypes) || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'test',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
});

async function seed() {
    await AppDataSource.initialize();

    await AppDataSource.query('DELETE FROM users');
    await AppDataSource.query('DELETE FROM role_permissions');
    await AppDataSource.query('DELETE FROM roles');
    await AppDataSource.query('DELETE FROM permissions');

    const adminRole = AppDataSource.manager.create(Role, {
        name: 'admin',
        description: 'Administrador con todos los permisos',
    });
    const userRole = AppDataSource.manager.create(Role, {
        name: 'user',
        description: 'Usuario estándar con permisos limitados',
    });
    await AppDataSource.manager.save([adminRole, userRole]);

    const permissions = [
        {
            name: 'user_create',
            description: 'Permiso para crear usuarios',
        },
        {
            name: 'user_read',
            description: 'Permiso para leer usuarios',
        },
        {
            name: 'user_update',
            description: 'Permiso para actualizar usuarios',
        },
        {
            name: 'user_delete',
            description: 'Permiso para borrar usuarios',
        },
    ].map((perm) => AppDataSource.manager.create(Permission, perm));
    await AppDataSource.manager.save(permissions);

    // Asignar permisos al admin (todos)
    const adminRolePermissions = permissions.map((perm) =>
        AppDataSource.manager.create(RolePermission, {
            role: adminRole,
            permission: perm,
        }),
    );

    // Asignar permisos al usuario (solo leer y actualizar)
    const userRolePermissions = permissions
        .filter(
            (perm) => perm.name === 'user_read' || perm.name === 'user_update',
        )
        .map((perm) =>
            AppDataSource.manager.create(RolePermission, {
                role: userRole,
                permission: perm,
            }),
        );

    await AppDataSource.manager.save([
        ...adminRolePermissions,
        ...userRolePermissions,
    ]);

    const saltRounds = 10;
    const hashedPassword1 = await bcrypt.hash('password123', saltRounds);
    const hashedPassword2 = await bcrypt.hash('userpass456', saltRounds);

    const users = [
        {
            username: 'admin',
            email: 'admin@mail.com',
            passwordHash: hashedPassword1,
            role: adminRole,
        },
        {
            username: 'user',
            email: 'user@mail.com',
            passwordHash: hashedPassword2,
            role: userRole,
        },
    ];
    await AppDataSource.manager.save(User, users);

    console.log('Seed completo');
    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error('Error en el seed:', error);
    void AppDataSource.destroy();
});

```

Luego, puedes ejecutar este script con `ts-node` para poblar tu base de datos:

```bash
npx ts-node src/scripts/seed.ts
```

## Configuración del módulo Auth

Ahora, vamos a configurar el módulo de autenticación (`AuthModule`) para usar Passport con JWT. Primero, crea un servicio de autenticación (`AuthService`) que maneje la lógica de validación de usuarios y generación de tokens JWT.

```typescript
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        return rest;
    }

    async login(userEntity: any) {
        return { access_token: this.jwtService.sign(payload) };
    }
}
```

En el código anterior, `validateUser` verifica las credenciales del usuario y `login` genera un token JWT si las credenciales son válidas.

Para realizar la validación de usuarios, puedes usar `bcrypt` para comparar la contraseña proporcionada con el hash almacenado en la base de datos. Aquí tienes una implementación completa del método `validateUser`:

```typescript
async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) throw new UnauthorizedException('Invalid credentials');
    /* Deberías omitir el password al retornarselo al usuario o,o */
    return user;
}
```

Asegúrate de que tu `UsersService` tenga un método `findByEmail` para buscar usuarios por su correo electrónico:

```typescript
async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
        where: { email },
        relations: [
            'role',
            'role.rolePermissions',
            'role.rolePermissions.permission',
        ],
    });
}
```

Por último realiza el método de login:

```typescript
async login(userLoginDto: UserLoginDto) {
    const user = await this.validateUser(
        userLoginDto.email,
        userLoginDto.password,
    );

    const permissions = user.role.rolePermissions.map(
        (rp) => rp.permission.name,
    );
    const payload = { sub: user.id, email: user.email, permissions };
    return { access_token: this.jwtService.sign(payload) };
}
```

### Configuración del JwtStrategy

Passport utiliza estrategias para manejar diferentes métodos de autenticación. En este caso, usaremos la estrategia JWT. Crea un archivo `jwt.strategy.ts` en el módulo de autenticación:

```typescript
interface JwtPayload {
    sub: number;
    email: string;
    permissions: string[];
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config: ConfigService,
        private usersService: UsersService,
    ) {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error(
                'JWT_SECRET is not defined in environment variables',
            );
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findOne(payload.sub);
        if (!user) return new NotFoundException('User not found');
        return user;
    }
}
```

¿Por qué es necesario el método `validate`? Este método es llamado automáticamente por Passport cuando un token JWT es verificado. El propósito de este método es validar el contenido del token y, en este caso, buscar al usuario correspondiente en la base de datos utilizando el ID (`sub`) presente en el payload del token. Si el usuario existe, se retorna el objeto del usuario, que luego estará disponible en los controladores protegidos por el guard. Si el usuario no existe, se retorna `null`, lo que indica que la autenticación ha fallado.

### Configuración del AuthController

También necesitamos crear un controlador para manejar las solicitudes de autenticación. Aquí tienes un ejemplo básico de un `AuthController`:

```typescript
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() body: UserLoginDto) {
        return this.authService.login(body);
    }
}
```

### Configuración del AuthModule

Finalmente, configura el módulo de autenticación (`AuthModule`) para importar los módulos necesarios y proporcionar los servicios y estrategias:

```typescript
@Module({
    controllers: [
        RolesController,
        PermissionsController,
        RolePermissionController,
        AuthController,
    ],
    providers: [
        RolesService,
        PermissionsService,
        RolePermissionService,
        AuthService,
        JwtStrategy,
    ],
    imports: [
        TypeOrmModule.forFeature([Role, Permission, RolePermission]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || 'defaultSecret',
                signOptions: {
                    expiresIn:
                        config.get<string | number>('JWT_EXPIRES_IN') || '1h',
                },
            }),
        }),
        forwardRef(() => UsersModule),
    ],
    exports: [RolesService, PermissionsService],
})
export class AuthModule {}
```

Como puedes ver, hice una modificación en la relación de `UsersModule` para evitar dependencias circulares usando `forwardRef`. Deberás hacer lo mismo en el `UsersModule`:

```typescript
@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        forwardRef(() => AuthModule), // Evitar dependencia circular
        TypeOrmModule.forFeature([User]),
        LoggerModule,
    ],
    exports: [UsersService], // Exportar UsersService para usarlo en AuthService
})
export class UsersModule {}
```

Recuerda también agregar las variables de entorno necesarias en tu archivo `.env`:

```
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=3600s
```

## Configuración del decorador Permissions

Para manejar los permisos de manera más sencilla, puedes crear un decorador personalizado llamado `Permissions`. Este decorador se utilizará para especificar qué permisos son necesarios para acceder a ciertos endpoints en tus controladores.

Crea un archivo `permissions.decorator.ts` en una carpeta adecuada:

```typescript
import { SetMetadata } from '@nestjs/common';

export const Permissions = (...perms: string[]) =>
    SetMetadata('permissions', perms);
```

## Configuración del PermissionsGuard

Ahora, crea un guardia personalizado llamado `PermissionsGuard` que verificará si el usuario autenticado tiene los permisos necesarios para acceder a un endpoint específico. Este guardia utilizará el decorador `Permissions` que acabamos de crear.
Crea un archivo `permissions.guard.ts` en una carpeta adecuada:

```typescript
interface AuthenticatedRequest extends Request {
    user?: User;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );
        if (!required || required.length === 0) return true;
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const user = req.user as User;
        if (!user) throw new ForbiddenException('No autenticado');

        const userPerms = user.role.rolePermissions.map(
            (rp) => rp.permission.name,
        );
        const hasEnoughPermissions = required.every((p: string) =>
            userPerms.includes(p),
        );
        if (!hasEnoughPermissions)
            throw new ForbiddenException('Permisos insuficientes');
        return true;
    }
}

```

## Uso de los Guards en los Controladores

Ahora puedes usar los guards `AuthGuard` y `PermissionsGuard` en tus controladores para proteger tus endpoints. Aquí tienes un ejemplo de cómo hacerlo en el `UsersController`:

```typescript
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('users')
// @UseInterceptors(CryptoInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Permissions('user_create')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Permissions('user_read')
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.usersService.findAll();
    }


    // Otros endpoints...
}
```