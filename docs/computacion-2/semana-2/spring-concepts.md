---
sidebar_position: 2
---

# Spring Framework

Conceptos generales de Spring

## Funcionamiento de proyectos antes de Spring

Antes de Spring, en aplicaciones Java tradicionales (Java SE o Java EE), el **desarrollador era responsable de crear y gestionar manualmente las dependencias** (objetos) que necesitaban las clases.

Esto implicaba:

- Crear instancias con `new` directamente en el código.
- Configurar las relaciones (dependencias) manualmente.
- Dificultad para cambiar una implementación por otra (alto acoplamiento).
- Complicaciones en pruebas unitarias, ya que no era sencillo reemplazar dependencias por *mocks*.

**Ejemplo sin Spring:**

```java
public class Motor {
    public void encender() {
        System.out.println("Motor encendido");
    }
}

public class Coche {
    private Motor motor;

    public Coche() {
        // Acoplamiento fuerte
        this.motor = new Motor();
    }

    public void arrancar() {
        motor.encender();
    }
}

public class Main {
    public static void main(String[] args) {
        Coche coche = new Coche();
        coche.arrancar();
    }
}
```

🔴 Problema: si queremos cambiar `Motor` por `MotorElectrico`, hay que modificar la clase `Coche` y recompilar el proyecto.

---

## IoC container

**IoC** (*Inversion of Control*) significa que el control de la creación y gestión de los objetos no lo tiene el desarrollador, sino un **contenedor** que se encarga de:

1. Crear los objetos (beans).
2. Inyectarles las dependencias.
3. Gestionar su ciclo de vida.

En Spring, este contenedor se llama **IoC Container**, y se implementa principalmente a través de las clases:

- `ApplicationContext` (más usado).
- `BeanFactory` (nivel más bajo).

**Diagrama ASCII:**

```
[applicationContext.xml / Config Java]
         ↓
   IoC Container (Spring)
         ↓
   Beans creados e inyectados
         ↓
   Usados por la aplicación
```

A continuación se presenta un diagrama que ilustra el concepto de IoC Container en Spring y su relación con los beans y la inyección de dependencias:

<img src="/img/ioc-container.png" alt="IoC Container" />

---

## Beans

En Spring, un **Bean** es cualquier objeto gestionado por el IoC Container.

Características:

- Puede ser definido mediante XML, anotaciones o configuración Java.
- El contenedor los crea, configura e inyecta automáticamente.
- Tienen un ciclo de vida controlado por Spring.

**Ejemplo (definición en XML):**

```xml
<bean id="motor" class="com.ejemplo.Motor" />
<bean id="coche" class="com.ejemplo.Coche">
    <constructor-arg ref="motor" />
</bean>
```

---

## Dependency Injection - XML

La **Inyección de Dependencias (DI)** es el proceso mediante el cual el IoC Container **proporciona** las dependencias que necesita un objeto, en lugar de que el objeto las cree por sí mismo.

En XML se puede hacer principalmente de dos formas:

---

### Constructor Injector

Se inyectan las dependencias a través del **constructor**.

```java
public class Coche {
    private Motor motor;

    public Coche(Motor motor) {
        this.motor = motor;
    }

    public void arrancar() {
        motor.encender();
    }
}
```

**Definición en XML:**
```xml
<bean id="motor" class="com.ejemplo.Motor" />
<bean id="coche" class="com.ejemplo.Coche">
    <constructor-arg ref="motor" />
</bean>
```

---

### Setter Injector

Se inyectan las dependencias a través de **métodos setter**.

```java
public class Coche {
    private Motor motor;

    public void setMotor(Motor motor) {
        this.motor = motor;
    }

    public void arrancar() {
        motor.encender();
    }
}
```

**Definición en XML:**
```xml
<bean id="motor" class="com.ejemplo.Motor" />
<bean id="coche" class="com.ejemplo.Coche">
    <property name="motor" ref="motor" />
</bean>
```

---

## Bean Scopes

El **scope** define cuántas instancias de un bean crea Spring y cómo se comparten.

---

### Singleton

- **Por defecto** en Spring.
- Solo una instancia del bean para todo el contenedor.

```xml
<bean id="motor" class="com.ejemplo.Motor" scope="singleton" />
```

**Ejemplo visual:**
```
[IoC Container]
   motor → instancia única (usada en toda la app)
```

---

### Prototype

- Una nueva instancia **cada vez** que se solicita el bean.

```xml
<bean id="motor" class="com.ejemplo.Motor" scope="prototype" />
```

**Ejemplo visual:**
```
[IoC Container]
   motor → nueva instancia en cada petición
```

---

## Life Cycle Beans

El ciclo de vida de un bean involucra:

1. Creación de la instancia.
2. Inyección de dependencias.
3. Inicialización (métodos `@PostConstruct` y `init-method`).
4. Uso en la aplicación.
5. Destrucción (`@PreDestroy` y `destroy-method`).

---

### PostConstruct

Método ejecutado **después** de la inyección de dependencias, para inicializar recursos.

**Definición en XML:**

```xml
<bean id="coche" class="com.ejemplo.Coche" init-method="init">
    <property name="motor" ref="motor" />
</bean>
```

---

### PreDestroy

Método ejecutado **antes** de destruir el bean, para liberar recursos.

**Definición en XML:**

```xml
<bean id="coche" class="com.ejemplo.Coche" destroy-method="cleanup">
    <property name="motor" ref="motor" />
</bean>
```

**Diagrama ciclo de vida:**

```
Bean creado → Dependencias inyectadas → init-method → (uso) → destroy-method → destrucción
```

---
