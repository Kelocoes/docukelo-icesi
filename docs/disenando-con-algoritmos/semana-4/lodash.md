---
sidebar_position: 3
---

# Ejercicios con Moment.js, Lodash y Faker.js

En este documento encontrarás ejercicios prácticos con **Moment.js**, **Lodash** y **Faker.js**.  
Cada sección incluye una breve explicación de la librería, un enlace a su documentación oficial y 10 ejercicios.  
Las soluciones están ocultas con `<details>` y `<summary>` para que intentes resolverlos antes de ver la respuesta.

---

## 📌 Instalación de librerías

Ejecuta en consola:

```bash
npm init -y
npm install moment lodash @faker-js/faker
```

Luego, en tus archivos Node.js, importa las librerías así:

```js
const moment = require('moment');
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
```

---

## 🕒 Moment.js

**¿Qué es?**  
Moment.js es una librería para manipular, validar, analizar y mostrar fechas y tiempos en JavaScript.

📖 [Documentación oficial](https://momentjs.com/docs/)

### Ejercicios

1. **Obtener la fecha actual en formato YYYY-MM-DD**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    const moment = require('moment');
    console.log(moment().format('YYYY-MM-DD'));
    ```
    </details>

2. **Mostrar la hora actual en formato de 24 horas**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(moment().format('HH:mm:ss'));
    ```
    </details>

3. **Obtener el día de la semana actual**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(moment().format('dddd'));
    ```
    </details>

4. **Sumar 7 días a la fecha actual**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(moment().add(7, 'days').format('YYYY-MM-DD'));
    ```
    </details>

5. **Restar 3 meses a la fecha actual**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(moment().subtract(3, 'months').format('YYYY-MM-DD'));
    ```
    </details>

6. **Calcular cuántos días faltan para el 31 de diciembre del año actual**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    const endYear = moment().endOf('year');
    console.log(endYear.diff(moment(), 'days'));
    ```
    </details>

7. **Verificar si una fecha es válida (2025-02-30)**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(moment('2025-02-30', 'YYYY-MM-DD', true).isValid());
    ```
    </details>

8. **Mostrar el inicio del mes actual**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(moment().startOf('month').format('YYYY-MM-DD'));
    ```
    </details>

9. **Mostrar el final del día actual**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'));
    ```
    </details>

10. **Calcular la diferencia en días entre 2025-01-01 y hoy**
     <details>
     <summary>
     Ver solución
     </summary>

     ```js
     console.log(moment().diff(moment('2025-01-01'), 'days'));
     ```
     </details>

---

## 🔧 Lodash

**¿Qué es?**  
Lodash es una librería de utilidades que facilita trabajar con arrays, objetos y funciones.

📖 [Documentación oficial](https://lodash.com/docs)

### Ejercicios

1. **Obtener el valor máximo de un array `[10, 5, 20, 8]`**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    const _ = require('lodash');
    console.log(_.max([10, 5, 20, 8]));
    ```
    </details>

2. **Obtener el valor mínimo de un array**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(_.min([10, 5, 20, 8]));
    ```
    </details>

3. **Ordenar un array `[3, 1, 4, 2]`**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(_.sortBy([3, 1, 4, 2]));
    ```
    </details>

4. **Eliminar duplicados de `[1, 2, 2, 3, 4, 4, 5]`**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(_.uniq([1, 2, 2, 3, 4, 4, 5]));
    ```
    </details>

5. **Dividir un array en partes de tamaño 2 `[1,2,3,4,5]`**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(_.chunk([1,2,3,4,5], 2));
    ```
    </details>

6. **Combinar arrays `[1,2]` y `[3,4]`**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(_.concat([1,2], [3,4]));
    ```
    </details>

7. **Rellenar un array con un valor `*` entre índices 1 y 3**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(_.fill([1,2,3,4,5], '*', 1, 4));
    ```
    </details>

8. **Encontrar el índice del primer número mayor que 3 `[1,2,3,4,5]`**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(_.findIndex([1,2,3,4,5], n => n > 3));
    ```
    </details>

9. **Agrupar objetos por propiedad `type`**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    const data = [{type: 'a'}, {type: 'b'}, {type: 'a'}];
    console.log(_.groupBy(data, 'type'));
    ```
    </details>

10. **Invertir un objeto `{a:1, b:2}`**
     <details>
     <summary>
     Ver solución
     </summary>

     ```js
     console.log(_.invert({a:1, b:2}));
     ```
     </details>

---

## 🎭 Faker.js

**¿Qué es?**  
Faker.js permite generar datos falsos (nombres, correos, direcciones, etc.), muy útil para pruebas.

📖 [Documentación oficial](https://fakerjs.dev/)

### Ejercicios

1. **Generar un nombre completo aleatorio**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    const { faker } = require('@faker-js/faker');
    console.log(faker.person.fullName());
    ```
    </details>

2. **Generar un correo electrónico falso**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.internet.email());
    ```
    </details>

3. **Generar una dirección falsa**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.location.streetAddress());
    ```
    </details>

4. **Generar un número de teléfono falso**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.phone.number());
    ```
    </details>

5. **Generar una fecha de nacimiento aleatoria**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.date.birthdate());
    ```
    </details>

6. **Generar un nombre de usuario**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.internet.userName());
    ```
    </details>

7. **Generar un país aleatorio**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.location.country());
    ```
    </details>

8. **Generar un producto falso**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.commerce.productName());
    ```
    </details>

9. **Generar una empresa falsa**
    <details>
    <summary>
    Ver solución
    </summary>

    ```js
    console.log(faker.company.name());
    ```
    </details>

10. **Generar una tarjeta de crédito falsa**
     <details>
     <summary>
     Ver solución
     </summary>

     ```js
     console.log(faker.finance.creditCardNumber());
     ```
     </details>

