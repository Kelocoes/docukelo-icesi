---
sidebar_position: 2
---

# GitHub

GitHub es una plataforma de desarrollo colaborativo que utiliza Git como sistema de control de versiones. Permite a los desarrolladores trabajar juntos en proyectos, gestionar el código fuente y colaborar en la resolución de problemas.

Realmente existen muchos otros servicios de control de versiones, como GitLab, Bitbucket, etc., pero GitHub es el más popular y ampliamente utilizado.

Crea una cuenta de GitHub en este enlace: [Github Page](https://github.com)

## Repositorios en GitHub

Un repositorio en GitHub es un espacio donde se almacena el código fuente de un proyecto, junto con su historial de cambios. Puedes crear repositorios públicos (visibles para todos) o privados (accesibles solo para ti y las personas que invites).

## Crear un repositorio

Para crear un repositorio en GitHub, sigue estos pasos:

1. Inicia sesión en tu cuenta de GitHub.
2. Haz clic en el botón **New** en la esquina superior derecha de la página principal.
3. Completa el formulario:
    - **Nombre del repositorio:** Escribe el nombre que tendrá tu proyecto.
    - **Descripción (opcional):** Agrega una breve explicación sobre el propósito del repositorio.
    - **Visibilidad:** Elige si el repositorio será público o privado, según tus necesidades.
    - **Inicializar con README:** Marca esta opción si deseas crear un archivo README para documentar tu proyecto.
    - **Agregar archivo `.gitignore`:** Selecciona una plantilla adecuada para tu proyecto para ignorar archivos o carpetas específicas.
4. Haz clic en el botón **Create repository** para finalizar la creación.

<img src="/img/github-repo.png" alt="Crear repositorio en GitHub" width="600" />

5. Una vez creado el repositorio, puedes clonar el repositorio a tu máquina local usando el comando `git clone <URL-del-repositorio>`.
6. O puedes seguir los diferentes pasos según tu situación

<img src="/img/github-repo-config.png" alt="Clonar repositorio en GitHub" width="900" />

7. Puedes empezar a trabajar en tu proyecto localmente y luego hacer push de tus cambios al repositorio remoto en GitHub.
> ⚠️ **Importante:** Siempre crea ramas a partir de una rama principal (por ejemplo, `main` o `master`). Si no lo haces, podrías enfrentar conflictos al combinar cambios, ya que el historial de commits puede volverse no lineal o carecer de un ancestro común. Esto puede dificultar la integración y resolución de problemas en tu proyecto.
