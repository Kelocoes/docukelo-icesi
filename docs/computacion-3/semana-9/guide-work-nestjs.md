---
sidebar_position: 3
---

# Guía de trabajo con NestJS

Esta guía te ayudará a comprender cómo trabajar con algunas de las herramientas que proporciona NestJS para crear aplicaciones web robustas y escalables. Aprenderás a crear y configurar los siguientes apartados de una aplicación web usando NestJS:

- Sistema de logs
- Interceptors

## Sistema de Logs

NestJS proporciona un sistema de logging integrado que facilita la gestión y el registro de mensajes en tu aplicación. Puedes utilizar el logger incorporado o crear tu propio servicio personalizado. A continuación, te muestro cómo usar el logger integrado:

```typescript
import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    // Instancia del logger con el nombre de la clase
    private readonly logger = new Logger(AppService.name);

    getHello(): string {
        // Log de información
        this.logger.log('getHello method called');
        return 'Hello World!';
    }
}
```

NestJS ofrece diferentes niveles de logs según la importancia del mensaje:
- `log()`: Mensajes informativos generales.
- `error()`: Mensajes de error.
- `warn()`: Mensajes de advertencia.
- `debug()`: Mensajes de depuración.
- `verbose()`: Mensajes detallados.

Para integrar el sistema de logs en toda la aplicación, crearemos nuestro propio módulo de logs. Crea un recurso llamado `logger` dentro de una carpeta `common`:

```bash
nest g resource common/logger --no-spec
```

Luego, crea un servicio de logger inyectable en el archivo `logger.service.ts` dentro de la carpeta `common/logger`:

```typescript
import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLogger implements LoggerService {
        private logStream: fs.WriteStream;

        constructor() {
                // Obtiene la fecha actual para el nombre del archivo de log
                const timestamp = new Date().toISOString().split('T')[0];
                const logDir = path.join(process.cwd(), 'logs');

                // Crea el directorio de logs si no existe
                if (!fs.existsSync(logDir)) {
                        fs.mkdirSync(logDir, { recursive: true });
                }

                // Define el archivo de log con la fecha actual
                const logFile = path.join(logDir, `logs-${timestamp}.log`);
                this.logStream = fs.createWriteStream(logFile, { flags: 'a' });
        }

        // Métodos para cada nivel de log
        log(message: string) {
                this.write('LOG', message);
        }

        error(message: string, trace?: string) {
                this.write('ERROR', message, trace);
        }

        warn(message: string) {
                this.write('WARN', message);
        }

        debug(message: string) {
                this.write('DEBUG', message);
        }

        verbose(message: string) {
                this.write('VERBOSE', message);
        }

        // Método privado para escribir en el archivo de log
        private write(level: string, message: string, trace?: string) {
                const log = `[${new Date().toISOString()}] [${level}] ${message}${
                        trace ? '\n' + trace : ''
                }\n`;

                this.logStream.write(log);
                // También imprime el log en consola
                console.log(log.trim());
        }

        // Cierra el stream de log al destruir el módulo
        onModuleDestroy() {
                if (this.logStream) {
                        this.logStream.end();
                }
        }
}
```

Recuerda registrar el servicio en el módulo `logger.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Module({
        providers: [AppLogger],
        exports: [AppLogger],
})
export class LoggerModule {}
```

Mantendremos esta dependencia como global dentro del contexto de la aplicación, registrándola en el `app.module.ts`:

```typescript
@Module({
        imports: [LoggerModule /* otros módulos */],
        controllers: [AppController],
        providers: [AppService],
})
export class AppModule {}
```

Para que el sistema general de la aplicación use este logger, indícalo en el `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppLogger } from './common/logger/logger.service';

async function bootstrap() {
        // bufferLogs: true almacena logs generados antes de la inicialización completa
        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
                bufferLogs: true,
        });
        app.useLogger(app.get(AppLogger));
        app.useGlobalPipes(new ValidationPipe());
        await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

De esta manera, cualquier servicio que inyecte el `AppLogger` podrá usar el sistema de logs personalizado.  
¿Por qué se utiliza `bufferLogs: true`? Para que cualquier log generado antes de que la aplicación esté completamente inicializada se almacene en un búfer y se procese una vez que el logger esté configurado.

¿Cómo lo usamos en un servicio? Ejemplo:

```typescript
@Injectable()
export class UsersService {
        constructor(
                @InjectRepository(User)
                private readonly userRepository: Repository<User>,
                private rolesService: RolesService,
                private readonly logger: AppLogger,
        ) {}

        async create(createUserDto: CreateUserDto) {
                // Log de depuración al crear usuario
                this.logger.debug(`Creating user with email: ${createUserDto.email}`);
                const role = await this.rolesService.findByName(createUserDto.roleName);
                if (!role) {
                        this.logger.debug(
                                `Role not found: ${createUserDto.roleName} while creating user with email: ${createUserDto.email}`,
                        );
                        throw new RoleNotFoundException(createUserDto.roleName);
                }
                this.logger.debug(
                        `Role found: ${role.name} for user with email: ${createUserDto.email}`,
                );
                const newUser = this.userRepository.create({
                        ...createUserDto,
                        role,
                });
                return await this.userRepository.save(newUser);
        }

        // Otros métodos...
```

> **Nota:** Asegúrate de adicionar el módulo `LoggerModule` en el `imports` del módulo donde se encuentra el servicio `UsersService`. También ahora probablemente fallarán los tests de usuario, es tu trabajo arreglarlo :P

## Interceptors

Los interceptors son una característica poderosa en NestJS que te permite interceptar y manipular las solicitudes y respuestas en tu aplicación. Puedes usarlos para transformar datos, manejar errores, agregar lógica personalizada antes o después de la ejecución de un método, entre otros.

En este caso, utilizaremos un interceptor para cifrar y descifrar la información sensible que viaje en el cuerpo de las solicitudes y respuestas HTTP. Crea el archivo `crypto.interceptor.ts` dentro de la carpeta `common/interceptors`:

```typescript
@Injectable()
export class CryptoInterceptor implements NestInterceptor {

        // Método para descifrar texto cifrado
        private decrypt(encryptedText: string): unknown {
        }

        // Método para cifrar un valor
        private encrypt(value: unknown): string {

        }

        // Método principal del interceptor
        intercept(
                context: ExecutionContext,
                next: CallHandler,
        ): Observable<{ encrypted: string }> {
        }

        // Verifica si el cuerpo tiene la propiedad 'encrypted'
        private hasEncryptedProperty(body: unknown): body is { encrypted: string } {
                return typeof body === 'object' && body !== null && 'encrypted' in body;
        }
}
```

El interceptor debe implementar la interfaz `NestInterceptor` y definir el método `intercept`, que recibe el contexto de ejecución y un manejador de llamadas (`CallHandler`). Dentro del método, puedes acceder y manipular la solicitud y respuesta HTTP.

Para cifrar y descifrar, usaremos la librería `crypto` de Node.js. Implementación de los métodos `encrypt` y `decrypt`:

```typescript
export class CryptoInterceptor implements NestInterceptor {
        private readonly algorithm = 'aes-256-cbc';
        private readonly secretKey = Buffer.from(
                '12345678901234567890123456789012',
        ); // 32 bytes
        private readonly iv = Buffer.from('1234567890123456'); // 16 bytes

        // Descifra el texto cifrado usando AES-256-CBC
        private decrypt(encryptedText: string): unknown {
                const decipher = crypto.createDecipheriv(
                        this.algorithm,
                        this.secretKey,
                        this.iv,
                );
                let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
                decrypted += decipher.final('utf8');
                return JSON.parse(decrypted);
        }

        // Cifra el valor usando AES-256-CBC
        private encrypt(value: unknown): string {
                const cipher = crypto.createCipheriv(
                        this.algorithm,
                        this.secretKey,
                        this.iv,
                );
                let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
                encrypted += cipher.final('base64');
                return encrypted;
        }
```

Estos métodos utilizan el algoritmo AES-256-CBC para cifrar y descifrar datos. El `secretKey` y el `iv` (vector de inicialización) son necesarios para el proceso. En producción, gestiona estas claves de manera segura.

Ahora revisemos el método `intercept`, donde aplicamos el cifrado y descifrado a las solicitudes y respuestas HTTP. Ejemplo básico de la documentación oficial:

```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => console.log(`After... ${Date.now() - now}ms`)),
            );
}
```

En esta guía, el método será más completo, usando los métodos de cifrado y descifrado:

```typescript
intercept(
        context: ExecutionContext,
        next: CallHandler,
): Observable<{ encrypted: string }> {
        const request = context.switchToHttp().getRequest<{ body: unknown }>();

        // Si el cuerpo tiene la propiedad 'encrypted', lo descifra
        if (this.hasEncryptedProperty(request.body)) {
                try {
                        request.body = this.decrypt(request.body.encrypted);
                } catch (e) {
                        if (e instanceof Error) {
                                throw new BadRequestException(
                                        'Invalid encrypted body',
                                        e.message,
                                );
                        }
                }
        }

        // Cifra la respuesta antes de enviarla
        return next.handle().pipe(
                map((data: unknown) => {
                        return { encrypted: this.encrypt(data) };
                }),
        );
}
```

**¿Qué hace este código?**
- Obtiene la solicitud HTTP del contexto de ejecución.
- Verifica si el cuerpo de la solicitud contiene la propiedad `encrypted`. Si es así, intenta descifrarla.
- Si la descifrado falla, lanza una excepción de `BadRequestException`.
- Llama al siguiente manejador en la cadena (el controlador).
- Usa el operador `map` de RxJS para transformar la respuesta, cifrándola y devolviéndola en un objeto con la propiedad `encrypted`.

> **¿Por qué usar `map` y no `tap`?**  
> Porque `map` transforma el flujo de datos, mientras que `tap` se utiliza para efectos secundarios sin modificar los datos. Aquí queremos transformar la respuesta.

**¿Cómo usar este interceptor en la aplicación?**  
Puedes agregarlo globalmente en el archivo `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppLogger } from './common/logger/logger.service';
import { CryptoInterceptor } from './common/interceptors/crypto.interceptor';

async function bootstrap() {
        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
                bufferLogs: true,
        });
        app.useLogger(app.get(AppLogger));
        app.useGlobalPipes(new ValidationPipe());
        // Aplica el interceptor globalmente
        app.useGlobalInterceptors(app.get(CryptoInterceptor));
        await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

O a nivel de controlador:

```typescript
@UseInterceptors(CryptoInterceptor)
@Controller('users')
export class UsersController {
        constructor(private readonly usersService: UsersService) {}

        @Post()
        async create(@Body() createUserDto: CreateUserDto) {
                return this.usersService.create(createUserDto);
        }
}
```