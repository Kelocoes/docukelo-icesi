---
sidebar_position: 4
---

# Prueba corta: 3 - React

Esta prueba corta tiene como objetivo aplicar los conocimientos adquiridos en la semana sobre React. Puedes apoyarte en tus apuntes y el material visto en clase para resolverla. El propósito es demostrar tu comprensión de los conceptos básicos de React y cómo se emplean para construir interfaces de usuario interactivas.

## Contexto

La Universidad Icesi ha realizado una encuesta a sus estudiantes para conocer su opinión sobre la calidad de los servicios ofrecidos. Se han recopilado datos sobre diferentes aspectos, como la calidad de la enseñanza, las instalaciones, el apoyo académico y la vida estudiantil. Los resultados de la encuesta se han almacenado en un archivo JSON llamado `survey-results.json`.

Te han asignado la tarea de desarrollador una aplicación web utilizando React que permita a los usuarios visualizar los datos de la encuesta de manera interactiva. Las recomiendaciones que te han dado son las siguientes:

- Los interesados desean ver un resumen de los resultados de la encuesta, incluyendo un gráfico en torta que muestre la distribución de las respuestas para cada aspecto evaluado.
- Los usuarios deben poder filtrar los resultados por diferentes criterios, como el año académico, el programa de estudio y la ubicación geográfica.
- En un segundo apartado de la página, los usuarios deben de poder observar en pequeñas tarjetas (cards) los comentarios más relevantes que los estudiantes han dejado en la encuesta, permitiendo filtrar estos comentarios por palabras clave.
- No te han dado más información al respecto, no obstante, te han comentado que el archivo JSON proporcionado contiene toda la información necesaria para cumplir con los requisitos. Su estructura es parecida a este:

```json
[
  {
    "id": 1,
    "year": 2023, // Between 2019 and 2025
    "program": "Computer Science", // Computer Science, Business Administration, Interactive Media Design, Biotechnology
    "location": "Cali", // Cali, Jamundí, Palmira, Yumbo
    "teachingQuality": 4, // 1 a 5
    "facilities": 5, // 1 a 5
    "academicSupport": 3, // 1 a 5
    "studentLife": 4, // 1 a 5
    "comments": "Great experience overall!" // Open text
  },
  {
    "id": 2,
    "year": 2023,
    "program": "Business Administration",
    "location": "Bogotá",
    "teachingQuality": 3,
    "facilities": 4,
    "academicSupport": 4,
    "studentLife": 5,
    "comments": "Good facilities but teaching could be improved."
  }
]
```

## Recomendaciones

- Crea un proyecto vacío utilizando Vite con la plantilla de React con Typescript.
    Puedes hacerlo ejecutando el siguiente comando en tu terminal:
    ```bash
    npm create vite@latest prubea-corta-3-react -- --template react-ts
    cd prubea-corta-3-react
    npm install
    npm run dev
    ```

- Utiliza correctamente el hook `useState` y evita mutar el estado directamente.  
    **Ejemplo incorrecto:**
    ```js
    const [count, setCount] = useState(0);
    count = count + 1; // Esto es incorrecto
    setCount(count); // Esto es incorrecto
    ```
    **Ejemplo correcto:**
    ```js
    const [count, setCount] = useState(0);
    setCount(prevCount => prevCount + 1); // Esto es correcto
    ```

- Usa componentes funcionales y hooks para manejar el estado y los efectos secundarios.

- Especifica correctamente las dependencias en el hook `useEffect` para evitar comportamientos inesperados.

- Revisa la documentación oficial de React para entender mejor cómo funcionan los hooks y otros conceptos clave:  
    [React Documentation](https://react.dev/learn)

- Para el gráfico en torta, puedes utilizar una librería como `recharts` o `chart.js` y más. Asegúrate de instalar la librería que elijas y seguir su documentación para integrarla en tu proyecto.

- Organiza tus archivos como prefieras, pero se recomienda seguir la estructura de carpetas vista en clase.  
    Consulta el archivo [File Structure](./file-structure.md) para ver un ejemplo de organización recomendada.