---
sidebar_position: 1
---

# Contenedores

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

<img src="/img/desarrollo-entornos-digitales-web/docker-architecture.png" alt="Contenedor" width="600" />

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

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-containers-quiz">
  <Question title="¿Cuál es el rol del computador denominado 'host' en la virtualización clásica?">
    <Option>Es una máquina virtual que emula componentes de hardware.</Option>
    <Option correct>Es el equipo físico sobre el cual se ejecutan el hipervisor y las máquinas virtuales (guests).</Option>
    <Option>Es el software que distribuye paquetes de red hacia los contenedores.</Option>
    <Option>Es la imagen base desde la cual se instancian los sistemas invitados.</Option>
  </Question>
  <Question title="¿Cuál es la característica distintiva de un Hipervisor Tipo 1 (bare-metal)?">
    <Option>Se instala sobre un sistema operativo comercial como Windows 11 o macOS.</Option>
    <Option correct>Se ejecuta directamente sobre el hardware físico sin necesidad de un sistema operativo subyacente.</Option>
    <Option>Funciona únicamente dentro de navegadores web modernos mediante WebAssembly.</Option>
    <Option>Requiere que cada contenedor incluya su propio núcleo de kernel de Linux.</Option>
  </Question>
  <Question title="¿Cuál de las siguientes herramientas es un ejemplo de Hipervisor Tipo 2?">
    <Option>VMware ESXi.</Option>
    <Option>Microsoft Hyper-V bare-metal.</Option>
    <Option correct>Oracle VirtualBox.</Option>
    <Option>Docker Engine Daemon.</Option>
  </Question>
  <Question title="¿En qué se diferencian principalmente los contenedores respecto a las máquinas virtuales en términos de arquitectura?">
    <Option>Los contenedores emulan todo el conjunto de instrucciones de la CPU física.</Option>
    <Option correct>Los contenedores comparten el núcleo (kernel) del sistema operativo del host en lugar de emular hardware completo.</Option>
    <Option>Las máquinas virtuales no pueden ejecutar aplicaciones con dependencias binarias.</Option>
    <Option>Los contenedores requieren la instalación obligatoria de una VM tipo Guest OS por aplicación.</Option>
  </Question>
  <Question title="¿Cuál es una ventaja principal de la tecnología de contenedores según la lectura?">
    <Option>Ofrece un aislamiento de kernel 100% independiente garantizado a nivel de hardware.</Option>
    <Option>Permite ejecutar múltiples kernels de diferentes arquitecturas sin hipervisor.</Option>
    <Option correct>Proporciona alta portabilidad y rapidez de inicio en cuestión de segundos.</Option>
    <Option>Elimina automáticamente la necesidad de bases de datos y almacenamiento persistente.</Option>
  </Question>
  <Question title="¿Qué sucede con los datos almacenados internamente en un contenedor cuando este es eliminado?">
    <Option>Se respaldan automáticamente en la nube de Docker Hub.</Option>
    <Option correct>Pueden perderse definitivamente a menos que se utilicen volúmenes o servicios externos.</Option>
    <Option>Se convierten en una nueva imagen base dentro del registro local.</Option>
    <Option>Se migran automáticamente a una máquina virtual bare-metal.</Option>
  </Question>
  <Question title="¿Cuál de las siguientes es considerada una desventaja de los contenedores frente a las VMs tradicionales?">
    <Option>Mayor tiempo de inicio al requerir varios minutos para iniciar servicios.</Option>
    <Option>Incapacidad para empaquetar librerías o dependencias de la aplicación.</Option>
    <Option correct>Menor aislamiento de seguridad en comparación con las VMs, al compartir el núcleo del SO host.</Option>
    <Option>Imposibilidad de ejecutarse en entornos cloud o servidores remotos.</Option>
  </Question>
  <Question title="¿Qué solución se menciona para gestionar y orquestar grandes cantidades de contenedores en producción?">
    <Option>Herramientas de orquestación como Kubernetes.</Option>
    <Option>Hipervisores de tipo 2 como VirtualBox.</Option>
    <Option>Reemplazar los contenedores por imágenes ISO monolíticas.</Option>
    <Option>Scripts manuales de inicio en cada máquina física.</Option>
  </Question>
  <Question title="¿Por qué las máquinas virtuales siguen siendo útiles a pesar de la popularidad de los contenedores?">
    <Option>Porque los contenedores no pueden ejecutar aplicaciones desarrolladas en lenguajes compilados.</Option>
    <Option correct>Porque las VMs son ideales en escenarios que requieren un sistema operativo completo o aislamiento de seguridad crítico.</Option>
    <Option>Porque las VMs consumen menos recursos de memoria RAM que los contenedores.</Option>
    <Option>Porque los contenedores no permiten mapear puertos de red.</Option>
  </Question>
  <Question title="¿Qué componente de Docker se encarga de empaquetar la aplicación y sus dependencias en una unidad portable?">
    <Option>El Hipervisor de nivel 1.</Option>
    <Option correct>La Imagen de Docker.</Option>
    <Option>El Guest OS de Windows.</Option>
    <Option>El archivo de memoria de intercambio SWAP.</Option>
  </Question>
</Quiz>
