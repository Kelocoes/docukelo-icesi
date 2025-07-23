---
sidebar_position: 5
---

# Ejercicio: Colaboración con Git y GitHub

Este ejercicio tiene como objetivo que los estudiantes trabajen en equipo para practicar un flujo de trabajo colaborativo utilizando Git y GitHub. Se desarrollará una historia de forma colaborativa, aplicando buenas prácticas en el uso de ramas, pull requests, revisiones y merges.

## 1. Creación del repositorio en GitHub

Uno de los estudiantes debe crear un nuevo repositorio en [GitHub](https://github.com/). El nombre del repositorio debe ser:

```
historia-colaborativa-grupoX
```

> Donde `X` representa el número de grupo asignado.

El repositorio debe ser público.

## 2. Agregar colaboradores

El estudiante que creó el repositorio debe ir a **Settings > Collaborators** y añadir a 2 o 3 compañeros más (mínimo 3 estudiantes, máximo 4 en total).

Los colaboradores deben aceptar la invitación para poder participar en el proyecto.

## 3. Clonar el repositorio en la máquina local

Cada estudiante debe clonar el repositorio en su máquina:

```bash
git clone https://github.com/usuario/historia-colaborativa-grupoX.git
cd historia-colaborativa-grupoX
```

## 4. Crear una rama de trabajo

Cada estudiante debe crear una nueva rama a partir de `main` con su nombre:

```bash
git checkout -b nombre-estudiante
```

## 5. Escribir una historia breve

Cada estudiante debe crear un archivo Markdown con el nombre:

```
nombre-estudiante.md
```

Dentro del archivo, escribir una breve historia ficticia, real o inventada (de al menos 4-5 líneas).

Ejemplo de contenido para `juan.md`:

```markdown
# El misterio del bosque encantado

Una mañana, Juan decidió explorar el bosque cercano a su casa. 
Mientras caminaba, escuchó un susurro que lo guiaba hacia un árbol antiguo. 
Al tocar el árbol, apareció un portal brillante. 
Sin pensarlo, cruzó y se encontró en un mundo donde los animales hablaban.
```

## 6. Hacer un commit

Después de crear y guardar el archivo:

```bash
git add juan.md
git commit -m "Historia inicial"
```

## 7. Subir la rama al repositorio remoto

```bash
git push origin nombre-estudiante
```

## 8. Crear un Pull Request (PR)

Desde GitHub, crear un Pull Request desde la rama `nombre-estudiante` hacia la rama `main`. 

> Título sugerido: “Historia de nombre-estudiante”  
> Descripción: Breve descripción del contenido del archivo.

## 9. Asignar revisores

Asignar al menos 2 compañeros como revisores del Pull Request.

## 10. Revisar y comentar el Pull Request

Los revisores deben leer la historia y hacer comentarios si encuentran errores gramaticales, de formato o si desean sugerir mejoras.

## 11. Resolver comentarios

Quien hizo el PR debe revisar los comentarios, hacer las modificaciones necesarias en el archivo `.md` correspondiente.

## 12. Hacer un nuevo commit con los cambios

```bash
git add nombre-estudiante.md
git commit -m "Correcciones en historia"
```

## 13. Hacer push nuevamente

```bash
git push origin nombre-estudiante
```

## 14. Actualizar el Pull Request

GitHub actualizará automáticamente el Pull Request con los nuevos cambios. Verifica que se hayan solucionado los comentarios.

## 15. Merge a `main`

Una vez que los revisores hayan aprobado el PR, se puede hacer **Merge** a la rama `main`. Esto debe hacerlo el autor del PR o un miembro autorizado del equipo.
