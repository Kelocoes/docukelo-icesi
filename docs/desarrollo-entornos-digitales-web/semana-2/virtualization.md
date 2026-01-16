---
sidebar_position: 1
---

# Fundamentos de Virtualización

Antes de profundizar en los contenedores, es útil entender primero el concepto de máquinas virtuales (VMs), ya que los contenedores evolucionan a partir de esta tecnología.

## Máquinas virtuales

Las máquinas virtuales permiten ejecutar sistemas operativos y aplicaciones en un entorno virtualizado, separado del hardware físico. Por ejemplo, si tienes Linux instalado pero necesitas ejecutar una aplicación exclusiva de Windows, puedes crear una VM con Windows dentro de tu sistema Linux. En este contexto, el computador físico se denomina "host" y cada máquina virtual es un "guest". Es posible tener múltiples guests en un mismo host, compartiendo los recursos físicos.

### Hipervisor

El hipervisor es el software responsable de gestionar las máquinas virtuales. Su función principal es asignar recursos (CPU, memoria, almacenamiento) entre el host y los guests. Existen dos tipos principales:

- **Hipervisor tipo 1 ("bare-metal")**: Se ejecuta directamente sobre el hardware, sin necesidad de un sistema operativo subyacente. Ofrece mayor rendimiento y eficiencia. Ejemplos: VMware ESXi, Microsoft Hyper-V.
- **Hipervisor tipo 2**: Se instala sobre un sistema operativo existente, lo que facilita su uso pero puede afectar el rendimiento. Ejemplos: Oracle VirtualBox, VMware Workstation.

### Tipos de máquinas virtuales

- **VMs completas**: Emulan todo el hardware, permitiendo ejecutar sistemas operativos completos. Son ideales para aplicaciones que requieren aislamiento total, pero consumen más recursos.
- **VMs ligeras (contenedores)**: Comparten el núcleo del sistema operativo del host, lo que las hace más eficientes. Son ideales para ejecutar aplicaciones específicas.
- **VMs de propósito específico**: Optimizadas para tareas concretas, sacrificando versatilidad por rendimiento.

### Ventajas y desventajas de las máquinas virtuales

**Ventajas:**
- Aislamiento total entre entornos.
- Flexibilidad para ejecutar múltiples sistemas operativos.
- Útiles para pruebas y desarrollo en diferentes plataformas.

**Desventajas:**
- Alto consumo de recursos.
- Gestión compleja de múltiples VMs.
- Menor rendimiento comparado con la ejecución directa en hardware.

## Contenedores

Los contenedores representan una evolución en la virtualización, enfocándose en la eficiencia y portabilidad. A diferencia de las VMs, los contenedores no emulan hardware completo, sino que comparten el núcleo del sistema operativo del host. Esto permite iniciar aplicaciones de forma rápida y consumir menos recursos.

Un contenedor encapsula una aplicación y sus dependencias, asegurando que se ejecute de manera consistente en cualquier entorno. Para gestionar contenedores, se utilizan plataformas como Docker, que simplifican la creación, despliegue y administración de estos entornos aislados.

<img src="/img/docker-architecture.png" alt="Contenedor" width="600" />

### Docker

Docker es la plataforma de contenedores más popular. Permite empaquetar aplicaciones junto con sus dependencias en imágenes portables, facilitando el despliegue en cualquier sistema compatible. Docker utiliza un motor de contenedores que gestiona la ejecución y el aislamiento de las aplicaciones.

**Razones de popularidad:**
- **Portabilidad:** Las imágenes Docker pueden ejecutarse en cualquier sistema con Docker instalado, desde laptops hasta servidores en la nube.
- **Aislamiento:** Cada contenedor es independiente, evitando conflictos entre aplicaciones.
- **Eficiencia:** Los contenedores son ligeros y permiten ejecutar más aplicaciones en el mismo hardware.

### Diferencias clave entre contenedores y máquinas virtuales

- **Arquitectura:** Las VMs emulan hardware completo; los contenedores comparten el núcleo del host.
- **Consumo de recursos:** Los contenedores son más ligeros y eficientes.
- **Velocidad de inicio:** Los contenedores se inician en segundos, mientras que las VMs pueden tardar minutos.
- **Portabilidad:** Los contenedores facilitan el despliegue en diferentes entornos sin cambios en la configuración.

### Ventajas y desventajas de los contenedores

**Ventajas:**
- Portabilidad y consistencia entre entornos de desarrollo, pruebas y producción.
- Aislamiento de aplicaciones, evitando conflictos de dependencias.
- Eficiencia en el uso de recursos y rapidez en el despliegue.

**Desventajas:**
- Menor aislamiento de seguridad comparado con las VMs, ya que comparten el núcleo del host.
- Gestión compleja en entornos con muchos contenedores (solucionable con herramientas como Kubernetes).
- Persistencia de datos: Los datos dentro de un contenedor pueden perderse al eliminarlo; se recomienda usar volúmenes o servicios externos para almacenamiento persistente.

---

**Información que puede ser de interés**

- Los contenedores han impulsado prácticas modernas como DevOps y microservicios, permitiendo desarrollar, probar y desplegar aplicaciones de manera ágil y escalable.
- Herramientas como Kubernetes permiten orquestar y gestionar grandes cantidades de contenedores, automatizando tareas como escalado, balanceo de carga y recuperación ante fallos, aunque para ejercicios de pequeña-mediana escala no es necesario complicarse con estas herramientas.
- Los contenedores no sustituyen a las VMs en todos los casos; cada tecnología tiene su lugar dependiendo de los requisitos de aislamiento, seguridad y compatibilidad. Por ejemplo, las VMs siguen siendo útiles para ejecutar aplicaciones que requieren un sistema operativo completo o para entornos de alta seguridad donde el aislamiento es crítico.

