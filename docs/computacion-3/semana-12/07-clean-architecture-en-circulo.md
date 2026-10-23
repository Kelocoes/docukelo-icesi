---
sidebar_position: 7
description: "Recorre de forma interactiva el círculo de Clean Architecture con Next.js y Redux Toolkit: capas, regla de dependencia y el viaje completo de una solicitud y su respuesta."
---

# Clean Architecture en círculo

Durante las últimas semanas construimos la arquitectura pieza por pieza: entidades, casos de uso, repositorios, mappers, inyección de dependencias y, esta semana, Redux Toolkit. Es normal que ahora tengas muchas piezas en la cabeza y no tengas claro **cómo encajan**. Este documento junta todo en un solo gráfico para que lo recorras, lo toques y lo repitas con distintos nombres de feature hasta que la forma te resulte familiar.

La idea central es la que ya conoces: **las dependencias solo apuntan hacia adentro**. Lo que cambia es que ahora la vemos dibujada como anillos concéntricos.

---

## 1. El gráfico

Usa los botones del reproductor para avanzar por las cinco fases. Mientras tanto, observa tres cosas: el anillo que se ilumina, las flechas que aparecen y el código que se resalta a la derecha.

<iframe
  src="/interactive/computacion-3/semana-12/clean-architecture-circular/index.html"
  title="Círculo de Clean Architecture con Next.js y Redux Toolkit"
  style={{ width: '100%', height: 780, border: 0 }}
  loading="lazy"
/>
