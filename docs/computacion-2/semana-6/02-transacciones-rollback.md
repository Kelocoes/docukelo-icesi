---
sidebar_position: 2
---

# Gestión de Transacciones con @Transactional y Rollback

En aplicaciones backend que gestionan operaciones críticas (como pagos bancarios, órdenes de compra o inventarios), múltiples sentencias SQL deben tratarse como una única unidad lógica indivisible. Si alguna parte de la operación falla, **todas las modificaciones previas deben revertirse (Rollback)** para evitar estados inconsistentes en la base de datos. En Spring Framework, esta orquestación se gestiona de manera declarativa con la anotación `@Transactional`.

---

## 1. Conceptos y Fundamentos Teóricos

<div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
  <img 
    src="/img/computacion-2/spring-transactions-rollback.svg" 
    alt="Ciclo de vida de una transacción en Spring Boot: Commit versus Rollback" 
    style={{width: '90%', maxWidth: '820px'}}
  />
</div>

### Propiedades ACID

Las transacciones garantizan cuatro principios fundamentales en la base de datos:

1. **Atomicidad (Atomicity)**: La operación se completa en su totalidad o no se ejecuta nada ("todo o nada").
2. **Consistencia (Consistency)**: La base de datos pasa de un estado válido a otro estado válido, respetando llaves foráneas, checks y restricciones.
3. **Aislamiento (Isolation)**: Las transacciones concurrentes se ejecutan sin interferir entre sí ni leer datos parciales sucios.
4. **Durabilidad (Durability)**: Una vez confirmada (`COMMIT`), los cambios persisten permanentemente, incluso ante caídas del servidor.

### ¿Cómo opera el Proxy Transaccional de Spring?

Spring utiliza el patrón de diseño **Proxy** (mediante Spring AOP). Cuando anotas una clase o método con `@Transactional`, Spring no invoca directamente el método real, sino un proxy intermediario:

<div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
  <img 
    src="/img/computacion-2/spring-proxy-transactional.svg" 
    alt="Diagrama de secuencia de la interceptación del Spring Transactional Proxy y TransactionManager" 
    style={{width: '100%', maxWidth: '880px'}}
  />
</div>

#### Explicación Paso a Paso del Proxy Transaccional

1. **Cliente / Controlador Web**: El cliente o controlador HTTP invoca el método del servicio pensando que se comunica directamente con él.
2. **Spring AOP Proxy (Interceptor)**: Intercepta la llamada antes de que llegue al código real de tu clase.
3. **`PlatformTransactionManager`**: Abre la transacción en la fuente de datos JDBC y desactiva el `autocommit` automático (`SET autocommit = false`).
4. **Target Service (Tu Bean Real)**: Se ejecuta la lógica interna (`transferMoney`) realizando los débitos, créditos y operaciones DML en la base de datos.
5. **Decisión de Cierre**:
   - **Caso A (Éxito)**: Si el método retorna normalmente, el Proxy solicita a `TransactionManager` que ejecute `COMMIT TRANSACTION;`.
   - **Caso B (Falla / Rollback)**: Si se dispara una excepción configurada (`RuntimeException` o las clases especificadas en `rollbackFor`), el Proxy captura el error y solicita ejecutar `ROLLBACK TRANSACTION;`, descartando cualquier modificación en la base de datos.

### Reglas de Rollback por Defecto vs. rollbackFor

:::danger[Comportamiento Crítico por Defecto]
Por defecto en Spring, **únicamente** las excepciones no verificadas (hijas de `RuntimeException` y `Error`) desencadenan un rollback automático. Si tu método lanza una excepción verificada (`Exception` o `IOException`), Spring **NO revertirá** los cambios en la base de datos a menos que se configure explícitamente.
:::

Para garantizar que cualquier excepción (incluyendo excepciones de negocio verificadas) revierta la transacción, se utiliza el atributo `rollbackFor`:

```java
@Transactional(rollbackFor = Exception.class)
```

Si por el contrario deseas que una excepción específica no cancele la transacción (por ejemplo, fallo en el envío de una notificación por correo secundaria), se utiliza `noRollbackFor`:

```java
@Transactional(noRollbackFor = EmailNotificationFailedException.class)
```

### Parámetros Esenciales de `@Transactional`

| Atributo | Propósito | Valor por Defecto |
| :--- | :--- | :--- |
| `rollbackFor` | Tipos de excepciones que fuerzan un `ROLLBACK`. | `{RuntimeException.class, Error.class}` |
| `noRollbackFor` | Excepciones que no deben cancelar la transacción. | `{}` |
| `readOnly` | Optimiza la sesión de Hibernate/JPA desactivando el dirty-checking de entidades. | `false` |
| `propagation` | Define cómo interactúa el método con transacciones existentes (ej. `REQUIRED`, `REQUIRES_NEW`). | `Propagation.REQUIRED` |
| `isolation` | Define el nivel de aislamiento de lectura (evitar lecturas sucias o lecturas fantasma). | `Isolation.DEFAULT` |

---

## 2. Guía Práctica: Paso a Paso

Implementaremos un escenario bancario clásico: transferir saldo entre dos cuentas, descontar el valor, acreditar a la cuenta destino y registrar una bitácora de auditoría. Si el saldo es insuficiente o la cuenta de destino está inactiva, se revierte todo.

<StepByStep>
  <Step number="1" title="Definir las Excepciones de Negocio">
    Creamos excepciones específicas para modelar los posibles fallos en las reglas del dominio bancario.

```java title="src/main/java/com/icesi/bank/exception/InsufficientFundsException.java" showLineNumbers
package com.icesi.bank.exception;

// Excepción no verificada (desencadena rollback por defecto)
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}
```

```java title="src/main/java/com/icesi/bank/exception/AccountBlockedException.java" showLineNumbers
package com.icesi.bank.exception;

// Excepción verificada (requiere rollbackFor explícito)
public class AccountBlockedException extends Exception {
    public AccountBlockedException(String message) {
        super(message);
    }
}
```
  </Step>

  <Step number="2" title="Modelar la Entidad Cuenta Bancaria">
    Creamos la entidad `BankAccount` con validaciones de saldo y estado activo.

```java title="src/main/java/com/icesi/bank/model/BankAccount.java" showLineNumbers
package com.icesi.bank.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bank_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Número de cuenta bancaria
    private String accountNumber;

    // Nombre del titular de la cuenta
    private String ownerName;

    // Saldo disponible
    private Double balance;

    // Estado de la cuenta (bloqueada o activa)
    private Boolean active;
}
```
  </Step>

  <Step number="3" title="Crear el Repositorio JPA">
    Definimos las consultas necesarias en el repositorio.

```java title="src/main/java/com/icesi/bank/repository/BankAccountRepository.java" showLineNumbers
package com.icesi.bank.repository;

import com.icesi.bank.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    // Busca una cuenta por su número único
    Optional<BankAccount> findByAccountNumber(String accountNumber);
}
```
  </Step>

  <Step number="4" title="Implementar el Servicio Transaccional con Rollback">
    Anotamos el método con `@Transactional(rollbackFor = {AccountBlockedException.class, Exception.class})` para asegurar que ante cualquier falla, el débito realizado no quede guardado a medias.

```java title="src/main/java/com/icesi/bank/service/TransferService.java" showLineNumbers
package com.icesi.bank.service;

import com.icesi.bank.exception.AccountBlockedException;
import com.icesi.bank.exception.InsufficientFundsException;
import com.icesi.bank.model.BankAccount;
import com.icesi.bank.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransferService {

    private final BankAccountRepository accountRepository;

    @Autowired
    public TransferService(BankAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    /**
     * Realiza una transferencia atómica entre dos cuentas.
     * Si ocurre InsufficientFundsException o AccountBlockedException,
     * se cancelan todas las mutaciones realizadas en la sesión.
     */
    @Transactional(rollbackFor = {AccountBlockedException.class, Exception.class})
    public void transferMoney(Long sourceAccountId, Long destinationAccountId, Double amount) 
            throws AccountBlockedException {

        if (amount <= 0) {
            throw new IllegalArgumentException("El monto a transferir debe ser mayor a cero.");
        }

        // 1. Obtener la cuenta de origen
        BankAccount sourceAccount = accountRepository.findById(sourceAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta de origen no encontrada: " + sourceAccountId));

        // 2. Obtener la cuenta de destino
        BankAccount destinationAccount = accountRepository.findById(destinationAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta de destino no encontrada: " + destinationAccountId));

        // 3. Validar estado de la cuenta origen
        if (Boolean.FALSE.equals(sourceAccount.getActive())) {
            throw new AccountBlockedException("La cuenta de origen se encuentra bloqueada.");
        }

        // 4. Validar saldo suficiente (Lanza RuntimeException -> Rollback automático)
        if (sourceAccount.getBalance() < amount) {
            throw new InsufficientFundsException("Saldo insuficiente para transferir $" + amount);
        }

        // 5. Aplicar débito
        sourceAccount.setBalance(sourceAccount.getBalance() - amount);
        accountRepository.save(sourceAccount);

        // 6. Validar estado de la cuenta de destino (Excepción verificada -> Rollback por rollbackFor)
        if (Boolean.FALSE.equals(destinationAccount.getActive())) {
            throw new AccountBlockedException("La cuenta de destino está inactiva o suspendida.");
        }

        // 7. Aplicar crédito
        destinationAccount.setBalance(destinationAccount.getBalance() + amount);
        accountRepository.save(destinationAccount);

        // Al salir del método sin lanzar excepciones, el Proxy ejecuta COMMIT en la BD
    }

    /**
     * Operación de solo lectura para consulta rápida.
     * readOnly = true optimiza el rendimiento evitando que Hibernate registre cambios.
     */
    @Transactional(readOnly = true)
    public Double checkBalance(Long accountId) {
        return accountRepository.findById(accountId)
                .map(BankAccount::getBalance)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada"));
    }
}
```
  </Step>

</StepByStep>

---

## 3. Errores Comunes al Usar @Transactional

:::caution[Cuidado con las Invocaciones Internas (Self-Invocation)]
Si un método dentro de una clase `@Service` llama a otro método de la **misma clase** anotado con `@Transactional`, la transacción **NO se activará**:
```java
public void procesarBatch() {
    // ❌ La llamada es directa a this, omitiendo el Proxy de Spring
    this.ejecutarTransaccion();
}

@Transactional
public void ejecutarTransaccion() {
    // Código transaccional...
}
```
**Solución**: Traslada el método transaccional a otro Bean o inyecta el bean correspondiente para pasar por el Proxy.
:::

:::tip[Buenas Prácticas de Rendimiento]
- Mantén las transacciones lo más cortas posible. No ejecutes llamadas a APIs externas lentas (como pasarelas de pago HTTP) dentro de un bloque `@Transactional`, ya que retendrás conexiones a la base de datos abiertas innecesariamente.
- Utiliza `@Transactional(readOnly = true)` en métodos de consulta para que Hibernate desactive la detección de suciedad (*dirty checking*) y libere recursos más rápido.
:::

---

## 4. Cuestionario de Autoevaluación

<Quiz id="comp2-semana6-transacciones-quiz">
  <Question title="¿Cuál es el principio ACID que garantiza que todas las operaciones de una transacción se completen con éxito o no se aplique ninguna ('todo o nada')?">
    <Option>Consistencia (Consistency)</Option>
    <Option correct>Atomicidad (Atomicity)</Option>
    <Option>Aislamiento (Isolation)</Option>
    <Option>Durabilidad (Durability)</Option>
  </Question>
  <Question title="¿Qué patrón de diseño utiliza Spring AOP para interceptar las llamadas a métodos anotados con @Transactional?">
    <Option>Singleton</Option>
    <Option>Observer</Option>
    <Option correct>Proxy</Option>
    <Option>Factory Method</Option>
  </Question>
  <Question title="Por defecto en Spring Framework, ¿qué tipo de excepciones provocan un Rollback automático de la transacción?">
    <Option>Únicamente las excepciones verificadas que extienden de Exception.</Option>
    <Option correct>Las excepciones no verificadas (hijas de RuntimeException) y los objetos de tipo Error.</Option>
    <Option>Cualquier excepción lanzada, sin importar su tipo o jerarquía.</Option>
    <Option>Solamente NullPointerException y SQLException.</Option>
  </Question>
  <Question title="Si un método lanza una excepción verificada como IOException o una subclase de Exception, ¿cómo se le indica a Spring que debe realizar Rollback?">
    <Option>@Transactional(forceRollback = true)</Option>
    <Option>@Transactional(onException = IOException.class)</Option>
    <Option correct>@Transactional(rollbackFor = Exception.class)</Option>
    <Option>@Transactional(catchAll = true)</Option>
  </Question>
  <Question title="¿Qué atributo de @Transactional permite que una excepción específica NO desencadene un rollback de la base de datos?">
    <Option>ignoreExceptions</Option>
    <Option correct>noRollbackFor</Option>
    <Option>skipRollback</Option>
    <Option>suppressRollback</Option>
  </Question>
  <Question title="¿Por qué falla la activación de la transacción cuando un método dentro de un @Service invoca directamente a otro método @Transactional de la misma clase (Self-Invocation)?">
    <Option>Porque Java no permite la sobrecarga de métodos en servicios.</Option>
    <Option correct>Porque la llamada se realiza internamente sobre 'this', omitiendo el Proxy interceptor de Spring AOP.</Option>
    <Option>Porque la base de datos bloquea las conexiones internas de un mismo hilo.</Option>
    <Option>Porque el garbage collector destruye la transacción.</Option>
  </Question>
  <Question title="¿Qué optimización interna aplica Hibernate cuando se anota un método con @Transactional(readOnly = true)?">
    <Option>Borra todas las entidades de la memoria caché de primer nivel.</Option>
    <Option correct>Desactiva la detección de suciedad (dirty checking) en las entidades consultadas, liberando CPU y memoria.</Option>
    <Option>Convierte las consultas SELECT a operaciones DELETE temporales.</Option>
    <Option>Cierra inmediatamente el pool de conexiones de la base de datos.</Option>
  </Question>
  <Question title="¿Qué componente de Spring Framework se encarga de abrir la conexión, deshabilitar el autocommit y coordinar el commit o rollback físico?">
    <Option>DispatcherServlet</Option>
    <Option>ApplicationContextAware</Option>
    <Option correct>PlatformTransactionManager</Option>
    <Option>BeanPostProcessor</Option>
  </Question>
  <Question title="¿Por qué es una mala práctica incluir llamadas HTTP a servicios externos lentos dentro de un método @Transactional?">
    <Option>Porque Spring Boot arroja un error de sintaxis al compilar.</Option>
    <Option>Porque el cliente HTTP cierra automáticamente el puerto 8080.</Option>
    <Option correct>Porque retiene una conexión abierta del pool de la base de datos durante el tiempo de espera de la red, pudiendo agotar el pool.</Option>
    <Option>Porque HTTP no soporta transacciones en formato JSON.</Option>
  </Question>
  <Question title="¿Qué comando SQL ejecuta la base de datos cuando el método transaccional culmina sin arrojar excepciones no controladas?">
    <Option>ROLLBACK;</Option>
    <Option correct>COMMIT;</Option>
    <Option>SAVEPOINT;</Option>
    <Option>DROP;</Option>
  </Question>
</Quiz>
