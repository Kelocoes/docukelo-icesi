---
sidebar_position: 4
---

# Temas avanzados de git y github

Pull Requests, Merge Conflicts, Squash, Stash y demás.

## Pull Requests

Los Pull Requests (PR) son una forma de proponer cambios en un repositorio. Permiten a los desarrolladores revisar, discutir y aprobar cambios antes de que se integren en la rama principal.

### Cómo crear un Pull Request

1. Realiza cambios en una rama separada.
2. Sube tus cambios al repositorio remoto.
3. Ve a la página del repositorio en GitHub.
4. Haz clic en el botón "Pull Request".

<img src="/img/pull-request.png" alt="Pull Request" width="1000" />

5. Selecciona la opción "New Pull Request".
6. Elige la rama base y la rama de comparación, teniendo en cuenta la dirección de la flecha, indicando que los cambios de la rama de comparación se integrarán en la rama base.
7. Revisa los cambios y agrega un título y una descripción para el Pull Request.
8. Haz clic en "Create Pull Request".
9. Una vez creado, puedes asignar revisores, etiquetas y proyectos al Pull Request.

<img src="/img/pull-request-2.png" alt="Pull Request 2" width="1000" />

10. Los revisores pueden comentar, solicitar cambios o aprobar el Pull Request.

<img src="/img/pull-request-3.png" alt="Pull Request 3" width="1000" />

11. Una vez aprobado, puedes hacer clic en "Merge Pull Request" para integrar los cambios en la rama base.

## Merge conflicts

Los merge conflicts ocurren cuando dos ramas tienen cambios incompatibles en las mismas líneas de un archivo. Git no puede resolver automáticamente estos conflictos y requiere intervención manual.

<img src="/img/merge-conflict.png" alt="Merge Conflict" width="700" />

### Cómo resolver un Merge Conflict

1. Identifica los archivos en conflicto. Git te lo indicará al intentar hacer un merge.
2. Abre los archivos en conflicto en tu editor de texto.
3. Busca las secciones marcadas por Git, que indican los cambios en conflicto. Estas secciones estarán rodeadas por `<<<<<<<`, `=======` y `>>>>>>>`.
4. Revisa los cambios y decide cómo resolver el conflicto. Puedes elegir uno de los cambios, combinarlos o modificarlos.
5. Elimina las marcas de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`) y guarda el archivo.
6. Una vez resuelto el conflicto, añade el archivo a la etapa de cambios con `git add <archivo>`.
7. Completa el merge con `git commit`. Git abrirá un editor para que puedas escribir un mensaje de commit, o puedes usar `git commit -m "Mensaje del commit"` para hacerlo directamente.
8. Si estás trabajando en un Pull Request, GitHub actualizará automáticamente el Pull Request con los cambios resueltos.

## Rebase

El rebase es una técnica que permite integrar cambios de una rama a otra de manera lineal, reescribiendo el historial de commits. Es útil para mantener un historial limpio y evitar merges innecesarios.

### Cómo hacer un Rebase

1. Asegúrate de estar en la rama que deseas rebasear.
2. Ejecuta el comando `git fetch` para obtener los últimos cambios del repositorio remoto.
3. Ejecuta `git rebase <rama-base>` para aplicar los cambios de la rama base a tu rama actual.
4. Si hay conflictos, Git te lo indicará. Resuélvelos como se explicó anteriormente.
5. Una vez resueltos los conflictos, usa `git rebase --continue` para continuar con el proceso de rebase.
6. Si deseas abortar el rebase en cualquier momento, puedes usar `git rebase --abort`.

## Cherry-pick

El cherry-pick es una técnica que permite aplicar un commit específico de una rama a otra. Es útil cuando deseas llevar un cambio específico sin hacer un merge completo de la rama.

### Cómo hacer un Cherry-pick
1. Identifica el hash del commit que deseas cherry-pickear. Puedes encontrarlo con `git log`.
2. Asegúrate de estar en la rama donde deseas aplicar el commit.
3. Ejecuta el comando `git cherry-pick <hash-del-commit>`.
4. Si hay conflictos, resuélvelos como se explicó anteriormente.
5. Una vez resueltos los conflictos, usa `git cherry-pick --continue` para completar el cherry-pick.

## Revert

El revert es una técnica que permite deshacer un commit específico creando un nuevo commit que invierte los cambios del commit original. Es útil para deshacer cambios sin alterar el historial de commits.

### Cómo hacer un Revert

1. Identifica el hash del commit que deseas revertir. Puedes encontrarlo con `git log`.
2. Asegúrate de estar en la rama donde deseas aplicar el revert.
3. Ejecuta el comando `git revert <hash-del-commit>`.
4. Git creará un nuevo commit que invierte los cambios del commit original.
5. Si hay conflictos, resuélvelos como se explicó anteriormente.

## Squash

El squash es una técnica que permite combinar varios commits en uno solo. Es útil para limpiar el historial de commits antes de hacer un merge o un Pull Request.

### Cómo hacer un Squash

1. Asegúrate de estar en la rama que deseas squashar xd.
2. Ejecuta el comando `git rebase -i HEAD~<número-de-commits>`, donde `<número-de-commits>` es el número de commits que deseas combinar.
3. En el editor que se abre, cambia `pick` a `squash` (o `s`) para los commits que deseas combinar con el commit anterior.
4. Guarda y cierra el editor.
5. Git te pedirá que escribas un nuevo mensaje de commit para el commit combinado. Edita el mensaje según sea necesario.

## Stash

Stash es uno de los métodos más útiles de Git para guardar temporalmente los cambios no confirmados en tu directorio de trabajo. Es especialmente útil cuando necesitas cambiar de rama sin hacer un commit de tus cambios actuales.

### Cómo usar Stash

1. Para guardar tus cambios actuales, usa el comando `git stash`. Esto guardará tus cambios y limpiará tu directorio de trabajo.
2. Si deseas guardar tus cambios con un mensaje descriptivo, puedes usar `git stash save "Mensaje descriptivo"`.
3. Para ver una lista de tus stashes guardados, usa `git stash list`.
4. Para aplicar el stash más reciente, usa `git stash apply`. Si deseas aplicar un stash específico, usa `git stash apply stash@{n}`, donde `n` es el índice del stash en la lista.
5. Si deseas eliminar el stash después de aplicarlo, puedes usar `git stash pop`, que aplica el stash y lo elimina de la lista.
6. Si deseas eliminar un stash específico, usa `git stash drop stash@{n}`.
7. Si deseas eliminar todos los stashes, usa `git stash clear`.

## Forks

Un fork es una copia de un repositorio que te permite hacer cambios sin afectar el repositorio original. Es útil para contribuir a proyectos de código abierto o para experimentar con cambios sin comprometer el repositorio original.

<img src="/img/fork.png" alt="Fork" width="1000" />

## Configurar tu access token de Github

Para configurar tu access token de desarrollo en Github, sigue estos pasos:

1. En la esquina superior derecha de cualquier página de GitHub, haz clic en tu foto de perfil y luego en **Settings**.
2. En el menú de la izquierda, haz clic en **Developer Settings**.
3. Haz clic en **Personal access tokens** y luego en **Tokens (classic)**.
4. Haz clic en **Generate new token**.
5. Asigna un nombre descriptivo al token y selecciona las casillas de verificación para los permisos que deseas otorgar (Puedes seleccionar todos).
6. Haz clic en **Generate token**.
7. Copia el token generado y guárdalo en un lugar seguro, ya que no podrás verlo nuevamente.
8. Para usar el token en la línea de comandos, puedes configurarlo como tu contraseña al hacer push o pull desde el repositorio. Cuando Git te pida tu nombre de usuario y contraseña, usa tu nombre de usuario de GitHub y el token como contraseña.