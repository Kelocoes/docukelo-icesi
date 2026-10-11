---
sidebar_position: 1
---

import PdfViewer from '@site/src/components/PdfViewer/PdfViewer';

# Contenido del curso

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
* **Sesión 17 (U4)**: Presentación de las unidades 3 y 4. Fundamentos del frontend multiplataforma. Instalación del SDK, editor, emulador y entorno Supabase. Primera aplicación y ejecución de Hola Mundo.
* **Sesión 18 (U4)**: Estructura de carpetas y `main.dart`. Paradigma declarativo vs. imperativo. Widgets básicos (`Text`, `Image`, botones) y componentes *Stateless*.

### Semana 10: Maquetación de Pantallas y Primeros Pasos Agénticos
* **Sesión 19 (U4)**: Andamiaje con `Scaffold` y `SafeArea`. Composición con `Column`, `Row`, `Expanded`, `Container`, `Padding`, `SingleChildScrollView`. Convención `Screen` vs. `Page`.
* **Sesión 20 (U3)**: Asistentes de IA en consola: modos de operación y niveles de autonomía. Gestión de contexto. Creación de `CLAUDE.md` / `AGENTS.md`. Introducción a Data, Storage y Auth.

### Semana 11: Skills del Agente, Prototipado y Manejo de Estado
* **Sesión 21 (U3)**: Concepto, instalación e invocación de *skills* (Skill de Flutter). Auditoría de interfaces generadas con IA contra el contrato de `CLAUDE.md`. Propuesta y diseño no funcional en Stitch/Figma.
* **Sesión 22 (U4)**: *StatelessWidget* vs. *StatefulWidget*: ciclo de vida (`initState`, `dispose`) y `setState`. Manejo de formularios con `TextEditingController`.

### Semana 12: Elevación de Estado y Navegación entre Pantallas
* **Sesión 23 (U4)**: Elevación de estado (*State Lifting*) a la `Screen` anfitriona. Comunicación con *callbacks*, mitigación de *prop drilling* y modelos inmutables con `copyWith`.
* **Sesión 24 (U4)**: Navegación con `Navigator` y rutas nombradas en `MaterialApp` (`pushNamed`, `pop`, `pushNamedAndRemoveUntil`).

### Semana 13: Navegación por Tabs y Spec Driven Development
* **Sesión 25 (U4)**: **Entrega Parcial 1**: Sustentación de maqueta / prototipo no funcional navegable. Navegación horizontal con `BottomNavigationBar`.
* **Sesión 26 (U3)**: *Spec Driven Development (SDD)*: la especificación como contrato previo al código. Ecosistema de agentes, *skills* y servidores MCP. Diseño del modelo de datos.

### Semana 14: Integración de Base de Datos Cloud (Supabase)
* **Sesión 27 (U3 y U4)**: Conexión de Flutter con Supabase mediante SDK. Capa de servicio y operaciones CRUD con PostgREST. Manejo de estados de carga y error en UI.
* **Sesión 28 (U3 y U4)**: Persistencia avanzada, consultas y refinamiento de la integración cliente-servidor.

### Semana 15: Autenticación, Storage y Cierre Técnico
* **Sesión 29 (U3 y U4)**: Autenticación con Supabase Auth: login, registro, logout, persistencia y guardas de rutas.
* **Sesión 30 (U3 y U4)**: Subida y visualización de archivos mediante Supabase Storage. Taller práctico de subida y preparación de la sustentación.

### Semana 16: Sustentaciones y Evaluación Final
* **Sesión 31 (U3 y U4)**: **Entrega Final - Parte I (Equipos 1 a 3)**: Demostración en vivo y sustentación del proceso asistido por IA.
* **Sesión 32 (U3 y U4)**: **Entrega Final - Parte II (Equipos 4 a 6)**: Demostración en vivo, sustentación y cierre reflexivo del curso.

---

## Hitos de Entrega y Evaluación

| Hito | Sesión / Semana | Descripción | Nivel de IAG |
| :--- | :--- | :--- | :--- |
| **Diseño y Modelo** | Semana 11 / Sesión 21 | Propuesta de la aplicación, diseño no funcional en Stitch/Figma y modelo de datos. | Nivel 5 (Exploración) |
| **Entrega Parcial 1** | Semana 13 / Sesión 25 | Prototipo navegable en Flutter con componentes, pantallas y gestión de estado local (datos simulados). | Nivel 5 (Exploración) |
| **Especificaciones y Backend** | Semanas 14-15 / Sesiones 26 a 30 | Especificaciones técnicas completas (*SDD*) e integración funcional con Supabase (Auth, Postgres CRUD y Storage). | Nivel 4 y 5 |
| **Entrega Final (50%)** | Semana 16 / Sesiones 31 y 32 | Sustentación técnica: Demostración de la aplicación en vivo, repositorio, `CLAUDE.md`, *skills*, *specs* y auditoría del flujo agéntico. | Nivel 5 (Exploración) |

---

## Syllabus Oficial de la Asignatura

A continuación puedes consultar y descargar el programa oficial completo del curso:

<PdfViewer src="/files/seminario-de-i-d-i/Syllabus-Seminario-Ingenieria-de-Software.pdf" width="100%" height="700px" title="Syllabus Seminario de Ingeniería de Software" />
