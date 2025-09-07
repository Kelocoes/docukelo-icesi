---
sidebar_position: 1
---

# Pruebas en Spring Boot

Esta guía está diseñada para que puedan comprender cómo funcionan las pruebas en **Spring Boot** usando **JUnit** y **Mockito**, incluyendo pruebas de integración y unitarias, así como el uso de un `application.properties` separado para pruebas.


## Diferencias entre pruebas unitarias e integración

### Pruebas unitarias
- **Definición:** Evalúan el funcionamiento de una unidad de código aislada (por ejemplo, un método de una clase de servicio o utilería), sin depender de otros componentes del sistema ni de recursos externos (como bases de datos).
- **Ventajas:**
    - Son rápidas de ejecutar.
    - Permiten detectar errores en lógica interna de manera precisa.
    - Fáciles de mantener y refactorizar.
- **Desventajas:**
    - No detectan problemas de integración entre componentes.
    - Pueden requerir mocks para simular dependencias.

### Pruebas de integración
- **Definición:** Evalúan cómo interactúan varios componentes del sistema entre sí y con recursos externos (por ejemplo, servicios, repositorios, bases de datos, etc.).
- **Ventajas:**
    - Detectan errores en la interacción entre capas o módulos.
    - Permiten validar la configuración y el wiring de Spring.
- **Desventajas:**
    - Son más lentas que las unitarias.
    - Pueden ser más difíciles de depurar si fallan.

### ¿Por qué es útil el sistema de capas en Spring?
Spring promueve una arquitectura en capas (modelo, repositorio, servicio, controlador), lo que permite:
- Probar cada capa de forma independiente (por ejemplo, probar la lógica de negocio sin depender de la base de datos real).
- Reemplazar dependencias por mocks o stubs en pruebas unitarias.
- Facilitar el mantenimiento y la escalabilidad del código.

**Ejemplo de capas:**
- **Modelo:** Representa los datos (clases Java simples, entidades JPA).
- **Repositorio:** Acceso a datos (interfaces que extienden JpaRepository, etc.).
- **Servicio:** Lógica de negocio (clases con @Service).
- **Controlador:** Manejo de peticiones HTTP (clases con @RestController).


## 1. Pruebas con JUnit en Spring Boot

### 1.1 Configuración básica
Para empezar a escribir pruebas en Spring Boot, necesitamos incluir las dependencias en `pom.xml`, esto solamente es necesario si no estás usando el **Spring Boot Starter Parent** que por defecto se incluye al trabajar con el **Spring Initializr**.

```xml
<dependencies>
    <!-- Spring Boot Starter Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 1.2 Ejemplo de prueba unitaria
Supongamos que tenemos un servicio que suma dos números:

```java
@Service
public class CalculatorService {
    public int sum(int a, int b) {
        return a + b;
    }
}
```


La prueba unitaria sería (sin contexto de Spring, solo la clase):

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorServiceTest {
    @Test
    void testSum() {
        CalculatorService service = new CalculatorService();
        assertEquals(5, service.sum(2, 3));
    }
}
```

### Ejemplo más realista: Servicio de transferencia bancaria

Supón que tienes un servicio que transfiere dinero entre cuentas y depende de un repositorio:

```java
@Service
public class BankService {
    @Autowired
    private AccountRepository accountRepository;

    public boolean transfer(Long fromId, Long toId, double amount) {
        Account from = accountRepository.findById(fromId).orElseThrow();
        Account to = accountRepository.findById(toId).orElseThrow();
        if (from.getBalance() < amount) return false;
        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);
        accountRepository.save(from);
        accountRepository.save(to);
        return true;
    }
}
```

Prueba unitaria usando Mockito:

```java
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class BankServiceTest {
    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private BankService bankService;

    @Test
    void testTransferSuccess() {
        Account from = new Account(1L, 100.0);
        Account to = new Account(2L, 50.0);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(from));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(to));

        boolean result = bankService.transfer(1L, 2L, 30.0);

        assertTrue(result);
        assertEquals(70.0, from.getBalance());
        assertEquals(80.0, to.getBalance());
        verify(accountRepository).save(from);
        verify(accountRepository).save(to);
    }
}
```

### 1.3 Assert más comunes en JUnit
Aquí una tabla con los **asserts** más usados en JUnit:


| Assert                                | Descripción                                                      | Ejemplo |
|----------------------------------------|------------------------------------------------------------------|---------|
| assertEquals(expected, actual)         | Verifica que los valores sean iguales                            | `assertEquals(5, sum);` |
| assertNotEquals(expected, actual)      | Verifica que los valores no sean iguales                         | `assertNotEquals(4, sum);` |
| assertTrue(condition)                  | Verifica que la condición sea verdadera                          | `assertTrue(isActive);` |
| assertFalse(condition)                 | Verifica que la condición sea falsa                              | `assertFalse(isDeleted);` |
| assertNull(object)                     | Verifica que el objeto sea null                                  | `assertNull(user);` |
| assertNotNull(object)                  | Verifica que el objeto no sea null                               | `assertNotNull(user);` |
| assertArrayEquals(expected, actual)    | Compara dos arrays                                               | `assertArrayEquals(new int[]{1,2}, arr);` |
| assertThrows(expectedType, executable) | Verifica que se lance una excepción específica                   | `assertThrows(IllegalArgumentException.class, () -> service.doWork(null));` |
| assertAll(executables...)              | Agrupa varios asserts y ejecuta todos, mostrando todos los fallos | `assertAll(() -> assertTrue(x), () -> assertEquals(2, y));` |
| assertIterableEquals(expected, actual) | Compara dos iterables                                            | `assertIterableEquals(list1, list2);` |
| assertLinesMatch(expected, actual)     | Compara listas de strings con patrones                           | `assertLinesMatch(expectedLines, actualLines);` |
| assertTimeout(duration, executable)    | Falla si el código tarda más de lo esperado                      | `assertTimeout(Duration.ofMillis(100), () -> foo());` |
| assertSame(expected, actual)           | Verifica que ambos objetos sean la misma instancia                | `assertSame(obj1, obj2);` |
| assertNotSame(expected, actual)        | Verifica que ambos objetos no sean la misma instancia             | `assertNotSame(obj1, obj2);` |

### 1.4 Pruebas de integración
Para pruebas de integración, normalmente necesitamos levantar parte del contexto de Spring y, a veces, conectarnos a una base de datos de prueba.


```java
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test") // Utiliza application-test.properties
public class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Test
    public void testCreateUser() {
        User user = new User(null, "Juan", "juan@example.com");
        User saved = userService.saveUser(user);
        assertNotNull(saved.getId());
        assertEquals("Juan", saved.getName());
    }

    @Test
    public void testFindUserByEmail() {
        userService.saveUser(new User(null, "Ana", "ana@example.com"));
        User found = userService.findUserByEmail("ana@example.com");
        assertNotNull(found);
        assertEquals("Ana", found.getName());
    }
}
```

**Ejemplo de integración con base de datos en memoria:**

```java
@SpringBootTest
@ActiveProfiles("test")
public class AccountRepositoryIntegrationTest {
    @Autowired
    private AccountRepository accountRepository;

    @Test
    void testSaveAndFind() {
        Account acc = new Account(null, 200.0);
        Account saved = accountRepository.save(acc);
        assertNotNull(saved.getId());
        Account found = accountRepository.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals(200.0, found.getBalance());
    }
}
```

### 1.5 Application.properties separado para pruebas
Puedes crear un archivo `application-test.properties` en `src/test/resources` y añadir propiedades específicas para pruebas, como base de datos en memoria:

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
```

Para indicarle a Spring que use este archivo durante las pruebas, usa la anotación `@ActiveProfiles("test")` en tu clase de prueba.


## 2. Pruebas con Mockito

Mockito permite **mockear** dependencias, para que no se ejecuten métodos reales y podamos aislar la unidad que estamos probando. Usualmente también viene incluido en el `spring-boot-starter-test`.


### 2.1 Dependencias necesarias
Si usas Spring Boot Starter Test, ya tienes Mockito incluido. Si no, agrega:
```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.0.0</version>
    <scope>test</scope>
</dependency>
```

### 2.2 Ejemplo de uso de Mockito
Supongamos un servicio que depende de un repositorio:

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
```

La prueba con Mockito sería:

```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testFindUserByEmail() {
        User mockUser = new User(1L, "Juan", "juan@example.com");
        Mockito.when(userRepository.findByEmail("juan@example.com")).thenReturn(Optional.of(mockUser));

        User user = userService.findUserByEmail("juan@example.com");

        assertNotNull(user);
        assertEquals("Juan", user.getName());
        Mockito.verify(userRepository).findByEmail("juan@example.com");
    }
}
```


## 3. Explicación de anotaciones y funciones clave

### @SpringBootTest
- Levanta el contexto completo de Spring para pruebas de integración.
- Permite inyectar beans reales con @Autowired.
- Útil para probar la aplicación "como si estuviera corriendo".

### @ExtendWith(MockitoExtension.class)
- Habilita el soporte de Mockito en JUnit 5.
- Permite usar @Mock y @InjectMocks.

### @Mock
- Crea un mock (objeto simulado) de la clase o interfaz indicada.
- Se usa sobre campos de la clase de prueba.
- Ejemplo: `@Mock private UserRepository userRepository;`

### @InjectMocks
- Crea una instancia real de la clase y le inyecta los mocks declarados en la prueba.
- Ejemplo: `@InjectMocks private UserService userService;`

### @ActiveProfiles("test")
- Indica a Spring qué perfil de configuración usar (por ejemplo, para usar una base de datos en memoria en pruebas).

### Mockito.when(...).thenReturn(...)
- Permite definir el comportamiento de un mock: "cuando se llame a este método con estos parámetros, devuelve este valor".
- Ejemplo: `when(userRepository.findByEmail("juan@example.com")).thenReturn(Optional.of(user));`

### Mockito.verify(...)
- Verifica que un método de un mock fue llamado (y cuántas veces, con qué argumentos, etc.).
- Ejemplo: `verify(userRepository).findByEmail("juan@example.com");`
- Útil para asegurar que la lógica de negocio interactúa correctamente con sus dependencias.

## 4. Cheatsheet ampliado de asserts y Mockito

### Asserts de JUnit

| Método | Descripción |
|--------|-------------|
| assertEquals(a, b) | Verifica igualdad |
| assertNotEquals(a, b) | Verifica desigualdad |
| assertTrue(cond) | Verifica que cond es true |
| assertFalse(cond) | Verifica que cond es false |
| assertNull(obj) | Verifica que obj es null |
| assertNotNull(obj) | Verifica que obj no es null |
| assertArrayEquals(a, b) | Compara arrays |
| assertIterableEquals(a, b) | Compara iterables |
| assertLinesMatch(a, b) | Compara listas de strings |
| assertTimeout(d, exec) | Falla si exec tarda más de d |
| assertSame(a, b) | Verifica que son la misma instancia |
| assertNotSame(a, b) | Verifica que no son la misma instancia |
| assertAll(exec...) | Ejecuta varios asserts juntos |
| assertThrows(e, exec) | Verifica que exec lanza excepción e |

### Mockito

| Método | Descripción |
|--------|-------------|
| when(mock.metodo()).thenReturn(valor) | Define el valor de retorno de un mock |
| when(mock.metodo()).thenThrow(ex) | Hace que el mock lance una excepción |
| verify(mock).metodo() | Verifica que se llamó al método |
| verify(mock, times(n)).metodo() | Verifica que se llamó n veces |
| verifyNoMoreInteractions(mock) | Verifica que no hubo más interacciones |
| doThrow(ex).when(mock).metodo() | Hace que el mock lance excepción al llamar |
| doNothing().when(mock).metodo() | Hace que el mock no haga nada |
| reset(mock) | Resetea el mock |


## 5. Buenas prácticas

- Escribe pruebas unitarias para lógica de negocio y pruebas de integración para flujos completos.
- Usa mocks para aislar dependencias externas.
- Mantén tus pruebas rápidas y fáciles de entender.
- Nombra los métodos de prueba de forma descriptiva. Ejemplo: `shouldReturnUserWhenEmailExists()`.



