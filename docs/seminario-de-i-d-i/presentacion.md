---
sidebar_position: 1
---

# Presentación del curso

Bienvenido al espacio de documentación de **Seminario de I+d+i** (Seminario de Ingeniería de Software) de la Universidad Icesi.

Esta etapa del curso abarca de la **semana 9 a la semana 16** (sesiones 17 a 32), articulando de forma integrada las **Unidades de Aprendizaje 3 y 4**. Durante este periodo se trabaja en el desarrollo asistido por agentes de inteligencia artificial en consola, la ingeniería guiada por especificaciones (*Spec Driven Development*), el diseño de interfaces multiplataforma con Flutter y la integración con servicios cloud mediante Supabase.

---

## Propósito general de la etapa

Capacitar en el flujo contemporáneo de desarrollo de software asistido por IA: desde la configuración del entorno, agentes en consola, gestión de contexto y *skills*, pasando por la construcción de interfaces declarativas y reactivas en Flutter, hasta la integración de servicios cloud (autenticación, base de datos Postgres y storage), culminando con la entrega y sustentación de un producto funcional y auditable.

---

## Unidades que se articulan en esta etapa

### Unidad 3: Fundamentos de desarrollo de soluciones asistido por IA
* **Resultado de Aprendizaje (RA3)**: Configurar asistentes inteligentes, archivos de contexto, herramientas y protocolos de extensión para desarrollar soluciones de software de forma productiva y controlada.
* **Ejes principales**:
  * Asistentes de IA en consola y modos de operación (niveles de autonomía, confirmación manual y planeación).
  * Construcción y mantenimiento de archivos de contexto (`CLAUDE.md` / `AGENTS.md`) como contratos vivos del proyecto.
  * Creación, instalación y uso de *skills* (ej. *skill* de Flutter).
  * Especificaciones técnicas como contrato antes del código (*Spec Driven Development - SDD*).
  * Arquitectura cliente-servidor con servidores MCP (*Model Context Protocol*).

### Unidad 4: Fundamentos de desarrollo Frontend asistido por IA
* **Resultado de Aprendizaje (RA4)**: Desarrollar una aplicación frontend multiplataforma asistida por IA e integrada con servicios backend en la nube, aplicando patrones de diseño, componentes declarativos y manejo de estado.
* **Ejes principales**:
  * Paradigma declarativo en Flutter (la interfaz como función del estado).
  * Estructura de componentes *Stateless* y *Stateful*, ciclo de vida y gestión de controladores.
  * Elevación de estado (*lifting state up*), *callbacks*, modelos inmutables y mitigación de *prop drilling*.
  * Navegación declarativa, rutas nombradas y navegación por pestañas (*BottomNavigationBar*).
  * Integración con backend cloud (Supabase SDK): autenticación de usuarios, operaciones CRUD en Postgres y almacenamiento de archivos.

---

## Planeación semanal y cronograma de sesiones

A continuación se detalla la distribución de contenidos y actividades de las semanas 9 a 16 conforme al planeador del curso:

### Semana 9: Entorno, Hola Mundo y Componentes Básicos
* **Sesión 17 (U4)**: 
  * Presentación general de las unidades 3 y 4.
  * Fundamentos de desarrollo frontend multiplataforma.
  * Instalación y verificación del SDK, editor, emulador y entorno Supabase.
  * Primera aplicación y ejecución de Hola Mundo.
  * *Trabajo independiente*: Verificación del entorno y ejecución de la aplicación en emulador o dispositivo físico.
* **Sesión 18 (U4)**: 
  * Anatomía de `main.dart` y estructura de carpetas.
  * Paradigma declarativo frente a imperativo.
  * Widgets básicos (`Text`, `Image`, botones) y concepto de componente reutilizable *Stateless*.
  * *Taller*: Construcción de componentes *Stateless* individuales.
  * *Trabajo independiente*: Finalización de componentes base para la siguiente sesión.

### Semana 10: Maquetación de Pantallas y Primeros Pasos Agénticos
* **Sesión 19 (U4)**: 
  * Andamiaje de pantallas con `Scaffold` y `SafeArea`.
  * Composición de layouts: `Column`, `Row`, `Expanded`, `Container`, `Padding`, `SingleChildScrollView`.
  * Convención arquitectural: `Screen` (pantalla navegable con `Scaffold`) vs. `Page` (vista hospedada).
  * *Taller*: Ensamble de pantallas a partir de componentes propios.
  * *Trabajo independiente*: Lectura sobre construcción de archivos de contexto para agentes (`CLAUDE.md` / `AGENTS.md`).
* **Sesión 20 (U3)**: 
  * Asistentes de IA en consola: operación, modos de ejecución y niveles de autonomía.
  * Gestión de la ventana de contexto.
  * Creación del archivo de contexto (`CLAUDE.md` / `AGENTS.md`) con convenciones y reglas de equipo.
  * Introducción conceptual a los 3 servicios cloud básicos: Data, Storage y Auth.
  * *Trabajo independiente*: Consolidación del archivo `CLAUDE.md` en el repositorio del equipo.

### Semana 11: Skills del Agente, Prototipado y Manejo de Estado
* **Sesión 21 (U3)**: 
  * *Skills*: concepto, instalación e invocación. Instalación y uso de la *skill* de Flutter.
  * *Taller*: Generación asistida de interfaces y auditoría del código generado contra el contrato del `CLAUDE.md`.
  * *Trabajo independiente*: Propuesta de aplicación del reto y diseño no funcional en Stitch/Figma.
* **Sesión 22 (U4)**: 
  * *StatelessWidget* vs. *StatefulWidget*: ubicación y ciclo de vida del estado (`initState`, `dispose`).
  * Reconstrucción del árbol de widgets con `setState`.
  * Manejo de entradas con `TextEditingController`.
  * *Taller (Parte 1)*: Construcción de pantalla con formulario y estado local.
  * *Trabajo independiente*: Implementación de estado y controladores en el formulario del proyecto.

### Semana 12: Elevación de Estado y Navegación entre Pantallas
* **Sesión 23 (U4)**: 
  * Elevación de estado (*State Lifting*): centralización del estado en la `Screen` anfitriona.
  * Comunicación hijo-padre mediante funciones como parámetro (*callbacks*).
  * Análisis de *prop drilling* y modelos con método `copyWith`.
  * *Taller (Parte 2)*: Refactorización de componentes desacoplados con comunicación por *callbacks*.
  * *Trabajo independiente*: Reorganización de la arquitectura de estado de la aplicación.
* **Sesión 24 (U4)**: 
  * Navegación con `Navigator` y tabla de rutas nombradas en `MaterialApp`.
  * Métodos `pushNamed`, `pop` y `pushNamedAndRemoveUntil`.
  * Paso de parámetros entre pantallas y retorno de resultados.
  * *Trabajo independiente*: Implementación del flujo de navegación completo del prototipo con datos simulados.

### Semana 13: Navegación por Tabs y Spec Driven Development
* **Sesión 25 (U4)**: 
  * **Entrega Parcial 1**: Sustentación de maqueta / prototipo no funcional con pantallas, estado y navegación (3 minutos por equipo).
  * Navegación horizontal con `BottomNavigationBar`. Criterios de diseño: cambio de *tab* (`setState`) vs. apertura de detalle (`push`).
  * *Trabajo independiente*: Conclusión de la navegación seccional de la aplicación.
* **Sesión 26 (U3)**: 
  * *Spec Driven Development (SDD)*: la especificación técnica como contrato previo a la codificación.
  * Ecosistema agéntico completo: arquitectura, agentes, *skills*, servidores MCP y flujos de trabajo.
  * *Skills* para generación y auditoría/crítica de *specs*.
  * *Trabajo independiente*: Diseño del modelo de datos mínimo y diagramación técnica.

### Semana 14: Integración de Base de Datos Cloud (Supabase)
* **Sesión 27 (U3 y U4)**: 
  * Conexión con Supabase mediante el SDK de Flutter (gestión de llaves y variables de entorno).
  * Capa de servicio como frontera entre la UI y la base de datos Postgres.
  * Operaciones CRUD mediante PostgREST (listar, ver detalle, crear, editar, eliminar).
  * Manejo de estados asíncronos en UI: carga (*loading*), éxito y error.
  * *Trabajo independiente*: Ingesta de datos de prueba (*data ingest*).
* **Sesión 28 (U3 y U4)**: 
  * Profundización en capa de persistencia y consultas avanzadas.
  * Refinamiento de la integración entre frontend y backend.

### Semana 15: Autenticación, Storage y Cierre Técnico
* **Sesión 29 (U3 y U4)**: 
  * Autenticación con Supabase Auth: registro, login, logout y persistencia de sesión.
  * Guardas de navegación (*route guards*) para rutas públicas y protegidas.
  * Vinculación de registros y permisos por identificador único de usuario (`UUID`).
  * *Trabajo independiente*: Flujo completo de registro e inicio de sesión funcional.
* **Sesión 30 (U3 y U4)**: 
  * Subida y visualización de archivos mediante Supabase Storage.
  * *Taller*: Implementación de pantalla con carga y visualización de multimedia/archivos.
  * *Trabajo independiente*: Preparación de la sustentación final: repositorio, `CLAUDE.md`, *skills*, *specs* y evidencias del proceso agéntico.

### Semana 16: Sustentaciones y Evaluación Final
* **Sesión 31 (U3 y U4)**: 
  * **Entrega Final - Parte I (Equipos 1 a 3)**: Demostración en vivo de la aplicación multiplataforma y sustentación del proceso asistido por IA (30 min por equipo).
  * *Trabajo independiente*: Preparación de sustentación para equipos restantes.
* **Sesión 32 (U3 y U4)**: 
  * **Entrega Final - Parte II (Equipos 4 a 6)**: Demostración en vivo y sustentación.
  * Cierre del curso, retroalimentación y balance de autonomía y uso ético de IAG.

---

## Hitos de Entrega y Evaluación

| Hito | Sesión / Semana | Descripción | Nivel de IAG |
| :--- | :--- | :--- | :--- |
| **Diseño y Modelo** | Semana 11 / Sesión 21 | Propuesta de la aplicación, diseño no funcional en Stitch/Figma y modelo de datos. | Nivel 5 (Exploración) |
| **Entrega Parcial 1** | Semana 13 / Sesión 25 | Prototipo navegable en Flutter con componentes, pantallas y gestión de estado local (datos simulados). | Nivel 5 (Exploración) |
| **Especificaciones y Backend** | Semanas 14-15 / Sesiones 26 a 30 | Especificaciones técnicas completas (*SDD*) e integración funcional con Supabase (Auth, Postgres CRUD y Storage). | Nivel 4 y 5 |
| **Entrega Final (50%)** | Semana 16 / Sesiones 31 y 32 | Sustentación técnica: Demostración de la aplicación en vivo, repositorio, `CLAUDE.md`, *skills*, *specs* y auditoría del flujo agéntico. | Nivel 5 (Exploración) |

---

## Acuerdos sobre el uso de Inteligencia Artificial

Durante este bloque se fomenta una transición progresiva en el uso de IA:
1. **Nivel 1 (Sin IAG)** en las primeras sesiones para afianzar los conceptos fundamentales de sintaxis y arquitectura de componentes.
2. **Nivel 3 y 4 (Colaboración y Uso Pleno)** en el desarrollo guiado, gestión de estado y consumo de servicios.
3. **Nivel 5 (Exploración con IAG)** en el diseño, generación de especificaciones técnicas, creación de *skills* y dirección autónoma de agentes en el proyecto final.
