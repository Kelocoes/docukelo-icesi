---
sidebar_position: 3
---

# Git organization

Organizar y trabajar con repositorios usando Git.

## Git Flow y Git Trunk

### Git Flow

Git Flow es un modelo de ramificación que define un conjunto de reglas para gestionar el desarrollo de software. Se basa en dos ramas principales:
- **`main` o `master`:** Contiene el código en producción.
- **`develop`:** Contiene el código en desarrollo.

Además, se utilizan ramas adicionales para características (`feature`), correcciones (`hotfix`) y lanzamientos (`release`).

<img src="/img/git-flow.webp" alt="Git Flow Diagram" width="600" />

### Git Trunk

Git Trunk es un enfoque más simple que se centra en una única rama principal, a menudo llamada `trunk` o `main`. En este modelo, todo el desarrollo se realiza directamente en la rama principal, lo que simplifica el flujo de trabajo y reduce la complejidad de las ramas.

<img src="/img/git-trunk.png" alt="Git Flow Diagram" width="600" style={{ backgroundColor: 'white', padding: '8px'}} />

## Comparación entre Git Flow y Git Trunk

| Característica       | Git Flow                          | Git Trunk                        |
|----------------------|-----------------------------------|----------------------------------|
| Complejidad          | Alta (múltiples ramas)            | Baja (una sola rama principal)   |
| Uso de ramas         | Sí (feature, release, hotfix)     | No (todo en `main` o `trunk`)    |
| Integración continua | Más complicado (requiere más configuración) | Más sencillo (menos ramas)       |
| Despliegue           | Más controlado (lanzamientos específicos) | Más ágil (despliegue continuo)   |


## Git conventions

Las convenciones de Git son prácticas recomendadas para mantener un código limpio y organizado.

<iframe src="https://midu.dev/buenas-practicas-escribir-commits-git" width="100%" height="500"></iframe>


## Recomendaciones

- **Para proyectos grandes y complejos:** Considera usar Git Flow para tener un control más granular sobre el desarrollo y las versiones.
- **Para proyectos pequeños o en desarrollo continuo:** Git Trunk puede ser más adecuado, ya que simplifica el flujo de trabajo y permite una integración continua más fluida, no obstante, presenta varias falencias al trabajar en equipos grandes sin un esquema robusto de integración y despliegue continuo.

## Notas adicionales

Para aprender más sobre buenas prácticas al escribir mensajes de commit, puedes consultar [https://cbea.ms/git-commit/#separate](https://cbea.ms/git-commit/#separate).
