---
sidebar_position: 1
---

# Introducción a Git

## ¿Qué es Git?

Git es un sistema de control de versiones distribuido, diseñado para manejar proyectos grandes con velocidad y eficiencia. Te permite rastrear los cambios en archivos, colaborar con otros desarrolladores y revertir archivos o proyectos a estados anteriores.

## ¿Por qué usar Git?

- **Historial de cambios:** Puedes ver qué cambios se han hecho, quién los hizo y cuándo.
- **Colaboración:** Permite que varios desarrolladores trabajen en el mismo proyecto sin sobrescribir el trabajo de los demás.
- **Ramas:** Puedes trabajar en nuevas características sin afectar la rama principal del código.
- **Desempeño:** Git es extremadamente rápido en operaciones locales como commits, diffs y merges.

## ¿Cómo funciona Git?

Git almacena snapshots (capturas) del estado de los archivos en lugar de diferencias. Cada vez que haces un commit, Git guarda una fotografía de todos tus archivos y un puntero al commit anterior. Esto permite una gran eficiencia y rastreo de cambios.

## Instalación de Git

### Windows

1. Ve a [git-scm.com](https://git-scm.com/) y descarga el instalador.
2. Ejecuta el archivo `.exe` y sigue las instrucciones del asistente.
3. Verifica la instalación con:

```bash
git --version
```

### macOS

```bash
brew install git
```

### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install git
```

## Configuración inicial de Git

Después de instalar Git, es importante configurarlo para que registre correctamente la información de tus commits.

### Configuración del nombre de usuario

```bash
git config --global user.name "Tu Nombre"
```

### Configuración del correo electrónico

**Nota:** Intenta que sea el mismo correo que usas en tu cuenta de GitHub o GitLab para facilitar la identificación de tus commits.

```bash
git config --global user.email "tunombre@ejemplo.com"
```

### Configuración del editor de texto

Por defecto, Git usará Vim. Puedes cambiarlo a otro editor como VS Code:

```bash
git config --global core.editor "code --wait"
```

## Comandos básicos de Git

### Crear un repositorio

```bash
git init
```

### Clonar un repositorio

```bash
git clone https://github.com/usuario/repositorio.git
```

### Ver estado de los archivos

```bash
git status
```

### Añadir archivos al área de preparación (staging)

```bash
git add archivo.txt
# o para añadir todos los archivos
git add .
```

### Hacer un commit

```bash
git commit -m "Mensaje del commit"
```

### Ver historial de commits

```bash
git log
```

### Ver cambios antes del commit

```bash
git diff
```

### Ver cambios que están en staging

```bash
git diff --staged
```

### Crear una nueva rama

```bash
git branch nombre-rama
```

### Cambiar de rama

```bash
git checkout nombre-rama
```

### Crear y cambiar a una nueva rama

```bash
git checkout -b nombre-rama
```

### Combinar ramas

```bash
git merge nombre-rama
```

### Ver ramas

```bash
git branch
```

### Eliminar una rama

```bash
git branch -d nombre-rama
```

### Ver remotos

Especialmente útil cuando queremos saber a qué repositorio remoto estamos conectados.

```bash
git remote -v
```

### Subir cambios al repositorio remoto

```bash
git push origin nombre-rama
```

### Traer cambios del repositorio remoto

```bash
git pull origin nombre-rama
```

## Git Cheat Sheet

<iframe 
    src="/files/git-cheat-sheet-education.pdf" 
    width="100%" 
    height="600px" 
    title="Git Cheat Sheet">
    <p>Tu navegador no soporta iframes. <a href="/files/git-cheat-sheet-education.pdf">Descarga el PDF aquí</a>.</p>
</iframe>

## Recursos adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [Pro Git Book (libro gratuito)](https://git-scm.com/book/es/v2)