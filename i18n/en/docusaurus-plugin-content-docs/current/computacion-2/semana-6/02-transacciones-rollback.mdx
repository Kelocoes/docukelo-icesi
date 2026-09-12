---
sidebar_position: 2
---

# Managing Transactions with @Transactional and Rollback

In backend systems managing mission-critical workflows (such as banking transfers, e-commerce orders, or inventory bookings), multiple SQL statements must execute as an indivisible unit of work. If any part of the operation fails, **all intermediate changes must be reverted (Rollback)** to prevent data corruption. In Spring Framework, this process is managed declaratively using the `@Transactional` annotation.

---

## 1. Concepts and Theoretical Foundations

<div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
  <img 
    src="/img/computacion-2/spring-transactions-rollback.svg" 
    alt="Transaction lifecycle in Spring Boot: Commit versus Rollback" 
    style={{width: '90%', maxWidth: '820px'}}
  />
</div>

### ACID Properties

Database transactions adhere to four essential principles:

1. **Atomicity**: The unit of work executes completely or not at all ("all or nothing").
2. **Consistency**: The database transitions from one valid state to another, enforcing constraints, foreign keys, and rules.
3. **Isolation**: Concurrent transactions execute without mutual interference or reading dirty, intermediate states.
4. **Durability**: Once committed (`COMMIT`), modifications remain permanent, surviving server crashes or restarts.

### How Does the Spring Transactional Proxy Operate?

Spring relies on the **Proxy Pattern** through Spring AOP. When you annotate a class or method with `@Transactional`, callers do not communicate directly with your actual bean, but with an intermediary proxy:

<div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
  <img 
    src="/img/computacion-2/spring-proxy-transactional.svg" 
    alt="Sequence diagram of Spring Transactional Proxy and TransactionManager interception" 
    style={{width: '100%', maxWidth: '880px'}}
  />
</div>

#### Step-by-Step Proxy Flow

1. **Web Controller / Caller**: Calls the service method unaware of the transactional proxy layer.
2. **Spring AOP Proxy**: Intercepts the invocation before it reaches your target bean.
3. **`PlatformTransactionManager`**: Opens a connection from the pool and disables database autocommit (`SET autocommit = false`).
4. **Target Service**: Executes the core business logic (debits, credits, DML operations).
5. **Completion Decision**:
   - **Case A (Success)**: If the method completes normally, the proxy calls `commit()` on the transaction manager.
   - **Case B (Rollback)**: If an eligible exception is thrown (`RuntimeException` or classes defined in `rollbackFor`), the proxy calls `rollback()`, undoing all pending changes.

### Default Rollback Rules vs. rollbackFor

:::danger[Critical Default Behavior]
By default in Spring, **only unchecked exceptions** (subclasses of `RuntimeException` and `Error`) trigger automatic rollbacks. If your code throws a checked exception (`Exception` or `IOException`), Spring **will NOT roll back** changes unless explicitly configured.
:::

To ensure checked business exceptions trigger rollbacks, declare `rollbackFor`:

```java
@Transactional(rollbackFor = Exception.class)
```

Conversely, to prevent specific non-fatal exceptions from canceling a transaction, use `noRollbackFor`:

```java
@Transactional(noRollbackFor = EmailNotificationFailedException.class)
```

### Core `@Transactional` Attributes

| Attribute | Purpose | Default |
| :--- | :--- | :--- |
| `rollbackFor` | Exception classes that force a `ROLLBACK`. | `{RuntimeException.class, Error.class}` |
| `noRollbackFor` | Exception classes that must not trigger a rollback. | `{}` |
| `readOnly` | Optimizes Hibernate/JPA session performance by disabling entity dirty-checking. | `false` |
| `propagation` | Defines how the method behaves relative to existing transactions (e.g., `REQUIRED`, `REQUIRES_NEW`). | `Propagation.REQUIRED` |
| `isolation` | Configures transaction isolation level (preventing dirty or phantom reads). | `Isolation.DEFAULT` |

---

## 2. Practical Guide: Step-by-Step

We will implement an atomic funds transfer: debit the source account, credit the destination account, and record the changes. If balance is insufficient or an account is blocked, the transaction rolls back cleanly.

<StepByStep>
  <Step number="1" title="Define Domain Business Exceptions">
    Create explicit custom exceptions to model business failures.

```java title="src/main/java/com/icesi/bank/exception/InsufficientFundsException.java" showLineNumbers
package com.icesi.bank.exception;

// Unchecked exception (triggers rollback by default)
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}
```

```java title="src/main/java/com/icesi/bank/exception/AccountBlockedException.java" showLineNumbers
package com.icesi.bank.exception;

// Checked exception (requires explicit rollbackFor configuration)
public class AccountBlockedException extends Exception {
    public AccountBlockedException(String message) {
        super(message);
    }
}
```
  </Step>

  <Step number="2" title="Model the BankAccount Entity">
    Define the entity with balance and active status fields.

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

    // Unique account identifier
    private String accountNumber;

    // Account owner name
    private String ownerName;

    // Current balance
    private Double balance;

    // Account state flag
    private Boolean active;
}
```
  </Step>

  <Step number="3" title="Define the Spring Data Repository">
    Declare queries for finding accounts by account number.

```java title="src/main/java/com/icesi/bank/repository/BankAccountRepository.java" showLineNumbers
package com.icesi.bank.repository;

import com.icesi.bank.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    Optional<BankAccount> findByAccountNumber(String accountNumber);
}
```
  </Step>

  <Step number="4" title="Implement the Transactional Service with Rollback">
    Annotate with `@Transactional(rollbackFor = {AccountBlockedException.class, Exception.class})` to guarantee atomicity.

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
     * Executes an atomic funds transfer.
     * Reverts all mutations if InsufficientFundsException or AccountBlockedException occurs.
     */
    @Transactional(rollbackFor = {AccountBlockedException.class, Exception.class})
    public void transferMoney(Long sourceAccountId, Long destinationAccountId, Double amount) 
            throws AccountBlockedException {

        if (amount <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive.");
        }

        // 1. Fetch source account
        BankAccount sourceAccount = accountRepository.findById(sourceAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Source account not found: " + sourceAccountId));

        // 2. Fetch destination account
        BankAccount destinationAccount = accountRepository.findById(destinationAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Destination account not found: " + destinationAccountId));

        // 3. Verify source account status
        if (Boolean.FALSE.equals(sourceAccount.getActive())) {
            throw new AccountBlockedException("Source account is suspended.");
        }

        // 4. Validate balance (Throws RuntimeException -> Triggers automatic rollback)
        if (sourceAccount.getBalance() < amount) {
            throw new InsufficientFundsException("Insufficient funds to transfer $" + amount);
        }

        // 5. Apply debit
        sourceAccount.setBalance(sourceAccount.getBalance() - amount);
        accountRepository.save(sourceAccount);

        // 6. Verify destination account status (Checked exception -> Rollback via rollbackFor)
        if (Boolean.FALSE.equals(destinationAccount.getActive())) {
            throw new AccountBlockedException("Destination account is suspended.");
        }

        // 7. Apply credit
        destinationAccount.setBalance(destinationAccount.getBalance() + amount);
        accountRepository.save(destinationAccount);
    }

    /**
     * Read-only query method.
     * readOnly = true optimizes performance by disabling Hibernate dirty checking.
     */
    @Transactional(readOnly = true)
    public Double checkBalance(Long accountId) {
        return accountRepository.findById(accountId)
                .map(BankAccount::getBalance)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
    }
}
```
  </Step>

  <Step number="5" title="Verify Rollback Behavior with Unit Testing">
    Confirm with Mockito that destination save operations are skipped when balance checks fail.

```java title="src/test/java/com/icesi/bank/service/TransferServiceTest.java" showLineNumbers
package com.icesi.bank.service;

import com.icesi.bank.exception.InsufficientFundsException;
import com.icesi.bank.model.BankAccount;
import com.icesi.bank.repository.BankAccountRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock
    private BankAccountRepository accountRepository;

    @InjectMocks
    private TransferService transferService;

    @Test
    @DisplayName("Should throw InsufficientFundsException and leave balance intact when funds are insufficient")
    void shouldAbortTransactionWhenBalanceIsInsufficient() {
        // Arrange
        BankAccount source = BankAccount.builder().id(1L).balance(100.0).active(true).build();
        BankAccount destination = BankAccount.builder().id(2L).balance(50.0).active(true).build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(source));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destination));

        // Act & Assert
        assertThrows(InsufficientFundsException.class, () -> {
            transferService.transferMoney(1L, 2L, 500.0);
        });

        assertEquals(100.0, source.getBalance());
        verify(accountRepository, never()).save(destination);
    }
}
```
  </Step>
</StepByStep>

---

## 3. Common Pitfalls with @Transactional

:::caution[Beware of Self-Invocation]
If a method within a `@Service` bean calls another `@Transactional` method in the **same class**, transaction interception **will NOT trigger**:
```java
public void processBatch() {
    // ❌ Direct 'this' invocation bypasses the Spring AOP Proxy
    this.executeTransaction();
}

@Transactional
public void executeTransaction() {
    // Transactional logic...
}
```
**Solution**: Move the transactional method to a separate bean or self-inject the bean to route calls through the proxy.
:::

---

## 4. Self-Assessment Quiz

<Quiz id="comp2-semana6-transacciones-quiz-en">
  <Question title="Which ACID property guarantees that all operations in a transaction either complete entirely or not at all ('all or nothing')?">
    <Option>Consistency</Option>
    <Option correct>Atomicity</Option>
    <Option>Isolation</Option>
    <Option>Durability</Option>
  </Question>
  <Question title="Which design pattern does Spring AOP use to intercept method calls annotated with @Transactional?">
    <Option>Singleton</Option>
    <Option>Observer</Option>
    <Option correct>Proxy</Option>
    <Option>Factory Method</Option>
  </Question>
  <Question title="By default in Spring Framework, which types of exceptions trigger an automatic database rollback?">
    <Option>Only checked exceptions that extend Exception directly.</Option>
    <Option correct>Unchecked exceptions (subclasses of RuntimeException) and Error instances.</Option>
    <Option>Any exception thrown regardless of type.</Option>
    <Option>Only NullPointerException and SQLException.</Option>
  </Question>
  <Question title="If a method throws a checked exception like IOException, how do you instruct Spring to perform a rollback?">
    <Option>@Transactional(forceRollback = true)</Option>
    <Option>@Transactional(onException = IOException.class)</Option>
    <Option correct>@Transactional(rollbackFor = Exception.class)</Option>
    <Option>@Transactional(catchAll = true)</Option>
  </Question>
  <Question title="Which attribute of @Transactional prevents a specific exception from triggering a rollback?">
    <Option>ignoreExceptions</Option>
    <Option correct>noRollbackFor</Option>
    <Option>skipRollback</Option>
    <Option>suppressRollback</Option>
  </Question>
  <Question title="Why does @Transactional fail to activate when called from another method within the same service bean (Self-Invocation)?">
    <Option>Because Java does not allow method overloading in services.</Option>
    <Option correct>Because the call is made directly on 'this', bypassing the Spring AOP interceptor proxy.</Option>
    <Option>Because the database blocks multiple queries on the same thread.</Option>
    <Option>Because garbage collection destroys active transactions.</Option>
  </Question>
  <Question title="What performance optimization does Hibernate apply when a method is annotated with @Transactional(readOnly = true)?">
    <Option>It purges all entities from the first-level cache.</Option>
    <Option correct>It disables dirty checking on queried entities, conserving CPU and memory.</Option>
    <Option>It transforms SELECT statements into temporary DELETE operations.</Option>
    <Option>It closes database connections immediately after query dispatch.</Option>
  </Question>
  <Question title="Which Spring Framework component manages connections, autocommit flags, and executes physical commit or rollback calls?">
    <Option>DispatcherServlet</Option>
    <Option>ApplicationContextAware</Option>
    <Option correct>PlatformTransactionManager</Option>
    <Option>BeanPostProcessor</Option>
  </Question>
  <Question title="Why is it bad practice to include slow third-party HTTP calls inside a @Transactional method?">
    <Option>Because Spring Boot throws a compilation error.</Option>
    <Option>Because the HTTP client shuts down port 8080.</Option>
    <Option correct>Because it keeps an open database connection from the pool throughout network wait times, risking pool exhaustion.</Option>
    <Option>Because HTTP cannot serialize transactions.</Option>
  </Question>
  <Question title="Which SQL command is issued to the database when a transactional method finishes successfully without unhandled errors?">
    <Option>ROLLBACK;</Option>
    <Option correct>COMMIT;</Option>
    <Option>SAVEPOINT;</Option>
    <Option>DROP;</Option>
  </Question>
</Quiz>
