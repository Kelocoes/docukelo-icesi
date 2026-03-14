---
sidebar_position: 1
---

# Security en NestJS

En este documento encontrarás los aspectos básicos de la seguridad en NestJS, incluyendo la autenticación, autorización y protección de las rutas. Además, se mencionarán algunas de las mejores prácticas para asegurar tu aplicación NestJS.

## Prerequisitos

Antes de comenzar, asegúrate de tener una comprensión básica de NestJS y de haber configurado un proyecto NestJS. Después de haber creado una gestión básica de usuarios, roles y permisos (también llamaods authorities), puedes seguir los siguientes pasos para implementar la seguridad en tu aplicación.

### Hashing de contraseñas

Hasta este momento, es posible que tu creación de usuarios haya almacenado las contraseñas en texto plano, lo cual es una mala práctica de seguridad. Para proteger las contraseñas de los usuarios, es importante utilizar un algoritmo de hashing como bcrypt.

Por el momento tendríamos un servicio de usuarios con un método `create` que se ve algo así:

```typescript
async create(createUserDto: CreateUserDto) {
        const role = await this.roleService.findByName(createUserDto.roleName);
        if (!role) {
            throw new Error('Role not found');
        }

        const newUser = this.userRepository.create({
            ...createUserDto,
            role,
        });
        return await this.userRepository.save(newUser);
    }
```

Para mejorar la seguridad, podemos modificar este método para que utilice bcrypt para hashear la contraseña antes de guardarla en la base de datos:

Instala la dependencia de bcrypt:

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

Luego, agrega entre tus variables de entorno una variable `SALT_ROUNDS` que indique el número de rondas de sal para bcrypt (por ejemplo, 10)

```env
SALT_ROUNDS=10
```

Ahora, modifica el método `create` para hashear la contraseña:

```typescript
async create(createUserDto: CreateUserDto) {
        const role = await this.roleService.findByName(createUserDto.roleName);
        if (!role) {
            throw new Error('Role not found');
        }

        if (!createUserDto.passwordHash) {
            throw new BadRequestException('Password is required');
        }

        const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS') ?? '10');
        const passwordHash = await bcrypt.hash(createUserDto.passwordHash, saltRounds);

        const newUser = this.userRepository.create({
            ...createUserDto,
            passwordHash,
            role,
        });
        return await this.userRepository.save(newUser);
    }
```

:::tip
Recuerda que el hashing de contraseñas es una parte fundamental de la seguridad de tu aplicación. Nunca almacenes contraseñas en texto plano y siempre utiliza un algoritmo de hashing seguro como bcrypt.
:::

:::tip
El número de rondas de sal (salt rounds) determina la complejidad del hashing. Un número más alto significa que el hashing será más lento, lo que puede mejorar la seguridad pero también puede afectar el rendimiento. Un valor comúnmente recomendado es 10, pero puedes ajustarlo según las necesidades de tu aplicación.
:::

:::warning
Es posible que hasta este punto, si tienes pruebas unitarias para la creación de usuarios, estas pruebas estén fallando debido a que ahora se espera una contraseña hasheada en lugar de una contraseña en texto plano. Asegúrate de actualizar tus pruebas para reflejar este cambio.
:::

Comprueba que al crear un nuevo usuario, la contraseña se almacena de forma segura en la base de datos y no en texto plano. Esto es un paso crucial para proteger la información de los usuarios y mejorar la seguridad de tu aplicación NestJS.

## Autenticación y autorización

Antes de saber su implementación, es importante entender la diferencia entre autenticación y autorización:

- **Autenticación**: Es el proceso de verificar la identidad de un usuario. En otras palabras, es el proceso de asegurarse de que el usuario es quien dice ser. Esto generalmente se hace a través de un sistema de inicio de sesión donde el usuario proporciona sus credenciales (como un nombre de usuario y una contraseña) para autenticarse. Existen diferentes estrategias de autenticación, como JWT (JSON Web Tokens), OAuth, y autenticación basada en sesiones, entre otras.
- **Autorización**: Es el proceso de determinar qué recursos y acciones un usuario autenticado puede acceder o realizar. Esto se basa en los roles y permisos asignados a cada usuario. Por ejemplo, un usuario con el rol de "admin" puede tener acceso a ciertas rutas o funcionalidades que un usuario con el rol de "user" no tiene.

<img src="/img/auth_example.png" alt="Autenticación vs Autorización" width="800"  />

## Guards y Passport en NestJS

Para trabajar con los Guards en Nest existen varias estrategias, una de las más comunes es usar la librería Passport, que es un middleware de autenticación para Node.js. Passport proporciona una forma sencilla de implementar diferentes estrategias de autenticación, como JWT, OAuth, entre otras.

Primero necesitas instalar las siguientes dependencias:

```bash
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install -D @types/passport-jwt
```

Estas dependencias te permitirán usar Passport con JWT en tu aplicación NestJS, por defecto Nest ofrece el sistema de Guards, pero Passport facilita la implementación de estrategias de autenticación.

### JWT (JSON Web Tokens)

Un JWT (JSON Web Token) es un estándar abierto (RFC 7519) que define un método compacto y seguro para transmitir información entre partes como un objeto JSON. Un JWT está compuesto por tres partes separadas por puntos:

- **Header** (encabezado): Indica el tipo de token y el algoritmo de firma utilizado (por ejemplo, HS256).
- **Payload** (carga útil): Contiene los datos (claims) que queremos transmitir, como el identificador del usuario, roles, fecha de expiración, etc. Ejemplo:
    ```json
    {
        "sub": 123,
        "username": "usuario1",
        "role": "admin",
        "exp": 1712345678
    }
    ```
- **Signature** (firma): Es una firma digital generada usando el header, el payload y una clave secreta. Sirve para verificar que el token no ha sido alterado.

Un JWT típico se ve así:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywidXNlcm5hbWUiOiJ1c3VhcmlvMSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcxMjM0NTY3OH0.abc123firma
```

#### ¿Qué problema resuelve JWT?

JWT permite implementar autenticación sin necesidad de mantener sesiones en el servidor. Toda la información relevante viaja en el token, que el cliente almacena (usualmente en localStorage o cookies) y envía en cada petición. El servidor solo necesita validar la firma del token para confiar en la identidad y permisos del usuario, haciendo el sistema escalable y desacoplado de la sesión tradicional.

Para implementar JWT en NestJS, empezaremos por la configuración adecuada del módulo de autenticación.

### Configuración del módulo de authenticación

Ahora, vamos a configurar el módulo de autenticación (AuthModule) para usar Passport con JWT. Primero, crea un servicio de autenticación (AuthService) que maneje la lógica de validación de usuarios y generación de tokens JWT.

```typescript
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        return "validateUser method not implemented yet";
    }

    async login(userEntity: any) {
        return "login method not implemented yet";
    }
}
```

En el código anterior, `validateUser` verifica las credenciales del usuario y `login` genera un token JWT si las credenciales son válidas.

Para realizar la validación de usuarios, puedes usar bcrypt para comparar la contraseña proporcionada con el hash almacenado en la base de datos. Aquí tienes una implementación completa del método `validateUser`:

```typescript
async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email); // Asegúrate de tener un método `findByEmail` en tu servicio de usuarios
    if (!user) throw new NotFoundException('User not found');

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) throw new UnauthorizedException('Invalid credentials');
    /* Deberías omitir el password al retornarselo al usuario o,o */
    return user;
}
```

Asegúrate de que tu UsersService tenga un método `findByEmail` para buscar usuarios por su correo electrónico:

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
async login(userLoginDto: UserLoginDto) { // Asegúrate de tener un DTO para el login que contenga email y password
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

### Configuración del Jwt Strategy

Passport utiliza estrategias para manejar diferentes métodos de autenticación. En este caso, usaremos la estrategia JWT. Crea un archivo `jwt.strategy.ts` en el módulo de autenticación:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config: ConfigService,
        private userService: UserService,
    ) {
        const jwtSecret = config.get<string>("JWT_SECRET");
        if (!jwtSecret) {
            throw new Error(
                "JWT_SECRET is not defined in environment variables",
            );
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findById(payload.sub); // payload.sub is el id del usuario
        if (!user) return new NotFoundException("User not found");
        return user;
    }
}
```

En esta estrategia, se extrae el token JWT del encabezado de autorización, se verifica su validez y se obtiene el usuario correspondiente a partir del payload del token. Si el token es válido y el usuario existe, se devuelve el usuario para que pueda ser utilizado en los Guards y controladores protegidos.

¿Por qué es necesario el método `validate`? Este método es llamado automáticamente por Passport cuando un token JWT es verificado. El propósito de este método es validar el contenido del token y, en este caso, buscar al usuario correspondiente en la base de datos utilizando el ID (`sub`) presente en el payload del token. Si el usuario existe, se retorna el objeto del usuario, que luego estará disponible en los controladores protegidos por el guard. Si el usuario no existe, se retorna `null`, lo que indica que la autenticación ha fallado.

### Configuración del AuthController

También necesitamos crear un controlador para manejar las solicitudes de autenticación. Aquí tienes un ejemplo básico de un `AuthController`:

```typescript
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login")
    async login(@Body() body: UserLoginDto) {
        return this.authService.login(body);
    }
}
```

### Configuración del AuthModule

Finalmente, configura el módulo de autenticación (AuthModule) para importar los módulos necesarios y proporcionar los servicios y estrategias:

```typescript
@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        UserModule,
        RoleModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>("JWT_SECRET") || "defaultSecret",
                signOptions: {
                    expiresIn:
                        config.get<StringValue | number>("JWT_EXPIRES_IN") ||
                        "1h",
                },
            }),
        }),
    ],
})
export class AuthModule {}
```

Recuerda también agregar las variables de entorno necesarias en tu archivo .env:

```env
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

Hasta este punto, has configurado la autenticación básica utilizando JWT en tu aplicación NestJS. Verifica que puedes iniciar sesión con un usuario válido y que recibes un token JWT en respuesta. Este token se puede usar para acceder a rutas protegidas en tu aplicación, lo cual se implementará utilizando Guards en la siguiente sección.

### Configuración del decorador Permissions

Para manejar los permisos de manera más sencilla, puedes crear un decorador personalizado llamado `@Permissions`. Este decorador se utilizará para especificar qué permisos son necesarios para acceder a ciertos endpoints en tus controladores.

Crea un archivo `permissions.decorator.ts` en una carpeta adecuada:

```typescript
import { SetMetadata } from "@nestjs/common";

export const Permissions = (...perms: string[]) =>
    SetMetadata("permissions", perms);
```

Este decorador utiliza `SetMetadata` para asociar los permisos especificados con el endpoint correspondiente. Luego, en tus controladores, puedes usar este decorador para proteger rutas específicas:

```typescript
@Controller("example")
export class ExampleController {
    @Get("protected")
    @Permissions("read:protected")
    getProtectedResource() {
        return "This is a protected resource";
    }
}
```

### Configuración del PermissionsGuard

Ahora, crea un guardia personalizado llamado `PermissionsGuard` que verificará si el usuario autenticado tiene los permisos necesarios para acceder a un endpoint específico. Este guardia utilizará el decorador `@Permissions` que acabamos de crear. Crea un archivo `permissions.guard.ts` en una carpeta adecuada:

```typescript
interface AuthenticatedRequest extends Request {
    user?: User;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Obtenemos los permisos requeridos del decorador
        const required = this.reflector.get<string[]>(
            "permissions",
            context.getHandler(),
        );
        if (!required || required.length === 0) return true; // Si no se requieren permisos, permitimos el acceso
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>(); // Obtenemos el usuario autenticado del request (establecido por JwtStrategy)
        const user = req.user as User;
        if (!user) throw new ForbiddenException("No autenticado");

        const userPerms = user.role.rolePermissions.map(
            (rp) => rp.permission.name,
        ); // Obtenemos los permisos del usuario a través de su rol
        const hasEnoughPermissions = required.every((p: string) =>
            userPerms.includes(p),
        ); // Verificamos que el usuario tenga todos los permisos requeridos
        if (!hasEnoughPermissions)
            throw new ForbiddenException("Permisos insuficientes");
        return true;
    }
}
```

En este guardia, se obtiene la lista de permisos requeridos para el endpoint utilizando el reflector. Luego, se verifica si el usuario autenticado tiene los permisos necesarios comparando los permisos requeridos con los permisos asociados al rol del usuario. Si el usuario no tiene los permisos necesarios, se lanza una excepción de tipo `ForbiddenException`.

### Uso de Guards en controladores

Ahora puedes usar los guards `AuthGuard` y `PermissionsGuard` en tus controladores para proteger tus endpoints. Aquí tienes un ejemplo de cómo hacerlo en el `UserController`:

```typescript
@Controller("users")
@UseGuards(AuthGuard("jwt"), PermissionsGuard) // Aquí puedes agregar tus guards de autenticación/autorización si es necesario
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(200)
    @Permissions("read") // Aquí especificas el permiso necesario para acceder a este endpoint
    findAll(@Query("username") username?: string) {
        return this.userService.findAll(username);
    }

    /* Otros endpoints protegidos con diferentes permisos */
}
```

En este ejemplo, el endpoint `findAll` está protegido por el guard de autenticación JWT y el guard de permisos. Solo los usuarios autenticados que tengan el permiso 'read' podrán acceder a este endpoint. Puedes agregar diferentes permisos a otros endpoints según las necesidades de tu aplicación.

Para probar la autenticación y autorización, puedes usar herramientas como Postman o Insomnia para enviar solicitudes HTTP a tus endpoints protegidos. Asegúrate de incluir el token JWT en el encabezado de autorización (Authorization: Bearer `<token>`) para acceder a los recursos protegidos.

```bash
curl --location 'http://localhost:3000/users' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoibHVpc0BleGFtcGxlLmNvbSIsInBlcm1pc3Npb25zIjpbImNyZWF0ZSIsImNyZWF0ZSJdLCJpYXQiOjE3NzM1MTc5MDUsImV4cCI6MTc3MzUyMTUwNX0.zgYl_QvgtK08AhjQh6JmbPaiCwKNR_E4S1m2OtwKbeY' \
--data ''
```

:::warning
Es posible que hasta este punto, la aplicación te lance errores de tipo 500, asegurate que la información esté siendo suministrada correctamente al Guard, y que el usuario autenticado tenga un rol con los permisos necesarios para acceder a los endpoints protegidos.
:::
