---
sidebar_position: 7
unlisted: true
---

# Taller de Agentes

El objetivo de este taller es poner en práctica el flujo de desarrollo asistido por agentes en consola (`agy` u `opencode`), formalizar la arquitectura de tu aplicación Flutter mediante un contrato agéntico y resolver problemas de interfaz bajo el rol de **Human-in-the-Lead**.

![Ruta del Taller de Agentes en Flutter](/img/seminario-de-i-d-i/taller-flujo-agente-flutter.svg)

---

## Prerrequisitos

* Proyecto Flutter local (por ejemplo, la app base o el reto FitTrack).
* CLI agéntico instalado y autenticado (`agy` u `opencode`).
* Emulador o dispositivo físico listo para comprobar las vistas.

---

## Qué Debes Elaborar

### 1. Estructura del Contrato Agéntico
Debes definir el contrato arquitectónico en tu repositorio para que el agente opere dentro de los límites del proyecto:
* **Carpeta modular `.agents/`:** Crea los directorios de contexto (`memory/`, `conventions/`) y documenta las reglas de oro de la aplicación:
  * Separación estricta entre `Screen` (única responsable del `Scaffold`) y `Page` (lienzo interno sin `Scaffold`).
  * Inmutabilidad estricta: 100% de la UI construida mediante `StatelessWidget`.
  * Integración visual con Google Material 3 (`colorScheme`).
* **Entrypoint `AGENTS.md`:** Crea el archivo raíz que sirva de punto de entrada para el agente, enlazando la documentación modular de `.agents/` y declarando los comandos de verificación (`flutter analyze`, `dart format lib/`).

### 2. Resolución de Problemas en Consola (Human-in-the-Lead)
Utiliza tu agente en consola para interactuar con el código del proyecto:
* Solicita al agente la corrección o implementación de una vista (por ejemplo, resolver un desborde de `RenderFlex overflow` o maquetar un componente de resumen de sesión).
* **Auditoría obligatoria de cambios:** No aceptes diffs a ciegas. Inspecciona que la solución respete la inmutabilidad (`StatelessWidget`), utilice constructores `const` donde aplique y no rompa la estructura de layout.
* Ejecuta `flutter analyze` para verificar que el código resultante no introduzca lints o advertencias.

### 3. Iteración del Contrato (Documento Vivo)
El contrato debe evolucionar con el código:
* Identifica un patrón incorrecto o una regla adicional que desees estandarizar (por ejemplo, sintaxis de botones en Material 3 o nombres de parámetros).
* Actualiza `AGENTS.md` o el archivo correspondiente en `.agents/memory/` con la nueva directriz.
* Solicita al agente que audite o refactorice el código creado para alinearlo a la nueva regla.
* Realiza un commit en Git que incluya tanto el código fuente como los contratos agénticos actualizados.

---

## Criterios de Validación

1. **Contrato funcional:** `AGENTS.md` en raíz referenciando `.agents/` sin sobrecargar el contexto inicial.
2. **Arquitectura respetada:** Todas las vistas cumplen la regla `Screen` vs `Page` y se mantienen como `StatelessWidget`.
3. **Calidad de código:** `flutter analyze` reporta cero problemas (*0 issues found*).
4. **Trazabilidad en Git:** Repositorio con commits que reflejan la evolución conjunta del código y de las reglas agénticas.
