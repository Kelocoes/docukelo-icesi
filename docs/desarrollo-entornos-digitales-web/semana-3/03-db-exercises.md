---
sidebar_position: 3
---

# Ejercicios: del texto al diagrama

La mejor manera de aprender diseño de bases de datos es practicar pasando de la descripción de un problema a un diagrama.

Estos ejercicios aumentan de complejidad de forma progresiva.

Antes de resolver cada uno, intenta identificar las partes fundamentales del problema.

:::tip[Antes de dibujar el diagrama, pregúntate]
- ¿Qué cosas (entidades) aparecen en el texto?
- ¿Qué información tengo de cada una (atributos)?
- ¿Cómo se relacionan entre sí?
- ¿Cuántos de A pueden relacionarse con cuántos de B? (1:1, 1:N, N:M)
- ¿Necesito una tabla puente para alguna relación N:M?
:::

### Ejercicio 1: Blog simple
**Nivel: Principiante**

Un blog tiene autores que escriben artículos. Cada artículo pertenece a un único autor.

:::info[Pista de resolución]
Piensa en cuál es la entidad principal que crea el contenido y cuál es la entidad que representa ese contenido. ¿Dónde deberías poner la clave foránea para conectar ambas?
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    AUTOR ||--o{ ARTICULO : "escribe"
    
    AUTOR {
        int id PK
        string nombre
        string email
    }
    
    ARTICULO {
        int id PK
        string titulo
        text contenido
        date fecha_publicacion
        int id_autor FK
    }
```

En este diagrama vemos una relación de uno a muchos clásica. El autor existe independientemente y el artículo depende del autor.
</details>

### Ejercicio 2: Biblioteca básica
**Nivel: Principiante**

Una biblioteca organiza sus libros por categorías. Cada libro pertenece a una sola categoría, pero una categoría puede tener muchos libros.

:::info[Pista de resolución] 
Identifica qué entidad sirve como agrupación o clasificación para la otra. La entidad de agrupación generalmente cede su identificador a los elementos que clasifica.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    CATEGORIA ||--o{ LIBRO : "agrupa"
    
    CATEGORIA {
        int id PK
        string nombre
        text descripcion
    }
    
    LIBRO {
        int id PK
        string titulo
        string autor
        int anio
        int id_categoria FK
    }
```

Aquí la categoría actúa como un catálogo. Almacenamos el identificador de la categoría dentro de cada libro para saber a dónde pertenece.
</details>

### Ejercicio 3: Tienda con productos y proveedores
**Nivel: Básico**

Una tienda vende productos. Cada producto tiene un proveedor que lo suministra. Un proveedor puede abastecer varios productos, pero cada producto tiene un solo proveedor principal.

:::info[Pista de resolución]
Considera los datos de contacto que podrías necesitar del proveedor y los datos de inventario del producto. La cardinalidad determina en qué tabla guardamos la referencia.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    PROVEEDOR ||--o{ PRODUCTO : "suministra"
    
    PROVEEDOR {
        int id PK
        string nombre
        string telefono
        string pais
    }
    
    PRODUCTO {
        int id PK
        string nombre
        float precio
        int stock
        int id_proveedor FK
    }
```

Como un producto tiene un solo proveedor principal, es seguro poner el identificador del proveedor dentro de la tabla del producto.
</details>

### Ejercicio 4: Red social simple
**Nivel: Básico**

En una red social, los usuarios publican posts. Cada post es escrito por un único usuario. Los posts tienen título, contenido y fecha de publicación.

:::info[Pista de resolución]
Similar al ejercicio del blog, pero con atributos específicos de una red social. Piensa en qué información propia necesitas recolectar del usuario.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    USUARIO ||--o{ POST : "publica"
    
    USUARIO {
        int id PK
        string nombre
        string email
        date fecha_registro
    }
    
    POST {
        int id PK
        string titulo
        text contenido
        date fecha
        int id_usuario FK
    }
```

La estructura fundamental sigue siendo de uno a muchos. El identificador del usuario se encuentra en el post para representar su autoría.
</details>

### Ejercicio 5: Sistema de cursos
**Nivel: Intermedio**

En una plataforma educativa, los profesores imparten cursos. Los estudiantes se inscriben en cursos. Cada curso tiene un único profesor asignado, pero un estudiante puede inscribirse en varios cursos y un curso puede tener varios estudiantes.

:::info[Pista de resolución]
La relación entre profesores y cursos es directa, pero entre estudiantes y cursos es de muchos a muchos. ¿Qué tabla intermedia necesitas para manejar esta inscripción?
:::

:::warning
No intentes guardar una lista de cursos dentro del estudiante, ni una lista de estudiantes en el curso. Recuerda que las bases de datos relacionales requieren tablas puente.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    PROFESOR ||--o{ CURSO : "imparte"
    ESTUDIANTE ||--o{ INSCRIPCION : "realiza"
    CURSO ||--o{ INSCRIPCION : "recibe"
    
    PROFESOR {
        int id PK
        string nombre
    }
    
    CURSO {
        int id PK
        string nombre
        int id_profesor FK
    }
    
    ESTUDIANTE {
        int id PK
        string nombre
        string email
    }
    
    INSCRIPCION {
        int id_estudiante FK
        int id_curso FK
        date fecha_inscripcion
        float calificacion
    }
```

La tabla de inscripciones actúa como puente. Además, nos permite guardar datos como la calificación, que solo tienen sentido en el contexto de esa relación específica.
</details>

### Ejercicio 6: Red social con comentarios
**Nivel: Intermedio**

Los usuarios de una red social crean posts y pueden comentar en cualquier post (incluyendo los propios). Cada comentario pertenece a un post específico y fue escrito por un usuario específico.

:::info[Pista de resolución]
Un comentario es una entidad que depende de otras dos al mismo tiempo. Piensa en cuántas claves foráneas necesitará la tabla para no perder esa información.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    USUARIO ||--o{ POST : "publica"
    USUARIO ||--o{ COMENTARIO : "escribe"
    POST ||--o{ COMENTARIO : "tiene"
    
    USUARIO {
        int id PK
        string nombre
    }
    
    POST {
        int id PK
        text contenido
        int id_usuario FK
    }
    
    COMENTARIO {
        int id PK
        text texto
        int id_usuario FK
        int id_post FK
    }
```

La entidad de comentarios necesita obligatoriamente referenciar tanto al autor del mismo como al post original donde fue publicado.
</details>

### Ejercicio 7: Sistema hospitalario
**Nivel: Avanzado**

Un hospital tiene pacientes que se atienden con médicos en consultorios específicos. Cada cita involucra exactamente un paciente, un médico y un consultorio. Un médico puede tener muchas especialidades.

:::info[Pista de resolución]
La relación entre médicos y especialidades es de muchos a muchos. Por otro lado, la cita es el corazón del sistema y conecta tres entidades distintas.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    MEDICO ||--o{ MEDICO_ESPECIALIDAD : "tiene"
    ESPECIALIDAD ||--o{ MEDICO_ESPECIALIDAD : "pertenece"
    MEDICO ||--o{ CITA : "atiende"
    PACIENTE ||--o{ CITA : "reserva"
    CONSULTORIO ||--o{ CITA : "alberga"
    
    PACIENTE {
        int id PK
        string nombre
    }
    
    MEDICO {
        int id PK
        string nombre
    }
    
    ESPECIALIDAD {
        int id PK
        string nombre
    }
    
    MEDICO_ESPECIALIDAD {
        int id_medico FK
        int id_especialidad FK
    }
    
    CONSULTORIO {
        int id PK
        string numero
    }
    
    CITA {
        int id PK
        datetime fecha_hora
        int id_paciente FK
        int id_medico FK
        int id_consultorio FK
    }
```

Observa cómo la cita centraliza el modelo al contener tres claves foráneas simultáneas. Además, se aísla la relación de especialidades médicas.
</details>

### Ejercicio 8: Tienda online con valoraciones
**Nivel: Avanzado**

Una tienda online organiza sus productos en categorías. Los clientes realizan pedidos que pueden contener varios productos en distintas cantidades. Además, los clientes pueden escribir valoraciones de los productos que han comprado, indicando una puntuación y un comentario.

:::info[Pista de resolución]
Hay dos relaciones de muchos a muchos aquí. Un pedido se desglosa en líneas de detalle para guardar cantidades. La valoración es otra relación separada entre el cliente y el producto.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    CATEGORIA ||--o{ PRODUCTO : "clasifica"
    CLIENTE ||--o{ PEDIDO : "realiza"
    PEDIDO ||--o{ DETALLE_PEDIDO : "contiene"
    PRODUCTO ||--o{ DETALLE_PEDIDO : "incluye"
    CLIENTE ||--o{ VALORACION : "escribe"
    PRODUCTO ||--o{ VALORACION : "recibe"
    
    CATEGORIA {
        int id PK
        string nombre
    }
    
    PRODUCTO {
        int id PK
        string nombre
        float precio_actual
        int id_categoria FK
    }
    
    CLIENTE {
        int id PK
        string nombre
    }
    
    PEDIDO {
        int id PK
        date fecha
        int id_cliente FK
    }
    
    DETALLE_PEDIDO {
        int id_pedido FK
        int id_producto FK
        int cantidad
        float precio_unitario
    }
    
    VALORACION {
        int id_cliente FK
        int id_producto FK
        int puntuacion
        text comentario
    }
```

Es crucial guardar el precio unitario en el detalle del pedido. El precio del producto puede cambiar, pero el pedido debe registrar el monto exacto al momento de la compra.
</details>

### Ejercicio 9: Empresa con empleados y departamentos
**Nivel: Experto**

Una empresa tiene empleados que trabajan en departamentos. Cada departamento tiene un gerente (que también es un empleado). Un empleado pertenece a un único departamento y tiene un único cargo asignado. Los empleados pueden tener un supervisor directo (que también es un empleado del mismo sistema).

:::info[Pista de resolución]
Este ejercicio requiere autorreferencias y normalización de catálogos. ¿Cómo haces que un empleado apunte a otro empleado? El departamento también necesita apuntar a la tabla de empleados, y los cargos deben estar en su propia tabla catálogo.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    DEPARTAMENTO ||--o{ EMPLEADO : "alberga"
    CARGO ||--o{ EMPLEADO : "define"
    EMPLEADO ||--o| EMPLEADO : "supervisa"
    EMPLEADO ||--o| DEPARTAMENTO : "dirige"
    
    DEPARTAMENTO {
        int id PK
        string nombre
        int id_gerente FK
    }
    
    CARGO {
        int id PK
        string nombre
    }
    
    EMPLEADO {
        int id PK
        string nombre
        int id_cargo FK
        int id_departamento FK
        int id_supervisor FK
    }
```

La tabla de empleados usa una clave foránea hacia sí misma para registrar al supervisor, referencia a `CARGO` para su puesto y el departamento referencia al empleado para asignar su gerente.
</details>

### Ejercicio 10: Sistema de gestión de proyectos
**Nivel: Experto**

En una empresa de software, los empleados trabajan en múltiples proyectos asumiendo diferentes roles (Tech Lead, Frontend Dev, QA, etc.). Cada proyecto pertenece a un cliente. Los proyectos se dividen en tareas asignadas a empleados. Algunas tareas solo pueden comenzar cuando otras han sido completadas (dependencias).

:::info[Pista de resolución]
Este es el reto final. Desglosa el problema por partes: clientes y proyectos, empleados en proyectos con roles (usando una tabla catálogo para los roles), tareas asignadas, y finalmente las dependencias entre tareas.
:::

<details>
<summary>Ver solución propuesta</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    CLIENTE ||--o{ PROYECTO : "solicita"
    PROYECTO ||--o{ EMPLEADO_PROYECTO : "involucra"
    EMPLEADO ||--o{ EMPLEADO_PROYECTO : "participa"
    ROL ||--o{ EMPLEADO_PROYECTO : "asigna"
    PROYECTO ||--o{ TAREA : "divide"
    EMPLEADO ||--o{ TAREA : "ejecuta"
    TAREA ||--o{ DEPENDENCIA_TAREA : "requiere"
    TAREA ||--o{ DEPENDENCIA_TAREA : "desbloquea"
    
    CLIENTE {
        int id PK
        string nombre
    }
    
    PROYECTO {
        int id PK
        string nombre
        int id_cliente FK
    }
    
    EMPLEADO {
        int id PK
        string nombre
    }
    
    ROL {
        int id PK
        string nombre
    }
    
    EMPLEADO_PROYECTO {
        int id_empleado FK
        int id_proyecto FK
        int id_rol FK
        date fecha_asignacion
    }
    
    TAREA {
        int id PK
        string descripcion
        int id_proyecto FK
        int id_empleado FK
    }
    
    DEPENDENCIA_TAREA {
        int id_tarea FK
        int id_tarea_previa FK
    }
```

Este modelo aborda asignaciones múltiples con roles catalogados, seguimiento de tareas y dependencias complejas usando una tabla puente autorreferencial.
</details>

:::info[Conclusión]
Si llegaste hasta el Ejercicio 10, ahora tienes las herramientas para diseñar la base de datos de casi cualquier aplicación en el mundo real.
:::
