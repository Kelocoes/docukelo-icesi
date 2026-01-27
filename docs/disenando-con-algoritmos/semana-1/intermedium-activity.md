---
sidebar_position: 6
---

# Ejercicio: Explorando Merge, Rebase y Manejo de Historial en Git

Este ejercicio está diseñado para que practiques operaciones fundamentales en Git relacionadas con ramas, fusiones (`merge`), reescritura de historial (`rebase`) y gestión de errores (eliminar un commit).

---

## 1. Crear un nuevo repositorio

Crea un nuevo repositorio en GitHub llamado:

```
git-avanzado-ejercicioX
```

Reemplaza `X` por tu número de grupo o nombre. Clónalo en tu máquina:

```bash
git clone https://github.com/usuario/git-avanzado-ejercicioX.git
cd git-avanzado-ejercicioX
```

Crea un archivo llamado `bitacora.md` y agrega una línea que diga:

```markdown
# Bitácora de cambios
Inicio del proyecto.
```

Has commit:

```bash
git add bitacora.md
git commit -m "Inicio del proyecto"
git push origin main
```

---

## 2. Crear una rama y hacer commits (MERGE)

1. Crea una rama llamada `agregar-capitulo-1`:

```bash
git checkout -b agregar-capitulo-1
```

2. Edita `bitacora.md` agregando una sección llamada **Capítulo 1** con 2-3 líneas.

3. Has commit:

```bash
git add bitacora.md
git commit -m "Agregado capítulo 1"
```

4. Regresa a `main`

```bash
git checkout main
```

5. Agrega nuevas lineas en la bitácora y has commit:

```bash
git commit -m "Actualización en main"
```
6. Ahora, integra los cambios de `agregar-capitulo-1` a `main` usando `merge`:

```bash
git merge agregar-capitulo-1
```

7. Resuelve cualquier conflicto si es necesario (Git te indicará si hay conflictos).

8. Una vez resuelto, Has commit:

```bash
git commit -m "Merge de agregar-capitulo-1 a main"
```

9. Sube los cambios a GitHub:

```bash
git push origin main
```

Hasta aquí al observar los commits en GitLens. Podrás observar que hay una bifurcación en el historial, lo que indica que se ha realizado un `merge`.

10. Si quieres ver el historial de commits, puedes usar:

```bash
git log --oneline --graph --all
```

### Ejemplo de historial después de un merge

```bash
*   0cb7494 Resuelto el conflicto
|\
| * 0aa0487 (agregar-capitulo-1) Agregando capítulo 1
* | d53314a Texto nuevo en la bitácora
|/
* 0ea693f Inicio
```

---

## 3. Crear otra rama y aplicar REBASE

1. Crea una nueva rama llamada `agregar-capitulo-2` desde `main`:

```bash
git checkout -b agregar-capitulo-2
```

2. Agrega otra sección a `bitacora.md` titulada **Capítulo 2**.

3. Has commit:

```bash
git add bitacora.md
git commit -m "Agregado capítulo 2"
```

4. Ve a la rama `main` y agrega nuevas lineas en la bitácora en las diferentes secciones, modificando lo que ya existe:

```bash
git checkout main
git add bitacora.md
git commit -m "Actualización en main con cambios previos"
```

5. Ahora, integra los cambios de `agregar-capitulo-2` a `main` usando `rebase`:

```bash
git checkout agregar-capitulo-2
git rebase main
```

6. Resuelve cualquier conflicto que pueda surgir durante el rebase (Git te indicará si hay conflictos).

7. Una vez resuelto, Has commit:

```bash
git add bitacora.md
git rebase --continue
```

8. Regresa a la rama `main` y realiza un merge rápido para integrar los cambios:

```bash
git checkout main
git merge agregar-capitulo-2
```

Si seguiste los pasos correctamente, deberías observar que el historial de commits es lineal y no hay bifurcaciones (a excepción del anterior), lo que indica que se ha realizado un `rebase`.

### Ejemplo de historial después de un rebase

```bash
* 380f775 (HEAD -> master, agregar-capitulo-2) Resolviendo los conflictos de rebase
* 08080db Agregando informació en main
*   0cb7494 Resuelto el conflicto
|\
| * 0aa0487 (agregar-capitulo-1) Agregando capítulo 1
* | d53314a Texto nuevo en la bitácora
|/
* 0ea693f Inicio
```

---

## 4. Crear rama, cometer error y eliminar commit

1. Crea una nueva rama llamada `agregar-capitulo-error`:

```bash
git checkout -b agregar-capitulo-error
```

2. Agrega una sección **Capítulo Error** con contenido ficticio o erróneo.

3. Has commit:

```bash
git add bitacora.md
git commit -m "Capítulo con errores"
```

4. Te das cuenta que el contenido no debería estar. Elimínalo del historial con:

```bash
git reset --soft HEAD~1
# O si quieres eliminarlo completamente:
# git reset --hard HEAD~1
```

5. Elimina el archivo o corrige y Has un nuevo commit correcto:

```bash
# O puedes restaurar el estado original del archivo:
git restore bitacora.md
git add bitacora.md
git commit -m "Corrección de capítulo con errores"
```

6. Sube la rama si quieres conservarla:

```bash
git push origin agregar-capitulo-error
```

> ⚠️ Ten cuidado si usas `--hard`, pues perderás el trabajo no guardado.

---

## ✅ Resultado Esperado

Al final del ejercicio tendrás:

- 1 rama unida con `merge`
- 1 rama integrada usando `rebase`
- 1 rama con un commit eliminado y reescrito
- Un historial claro que puedes observar con:

```bash
git log --oneline --graph --all
```
