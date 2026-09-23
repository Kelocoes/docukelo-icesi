---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Reto Práctico: App de Rutinas y Ejercicios (FitTrack)

En este reto pondrás en práctica tus habilidades de maquetación y arquitectura en Flutter construyendo la interfaz de **FitTrack**, una aplicación móvil de entrenamiento físico diseñada bajo los estándares de **Google Material Design 3** con el color semilla Deep Purple (`#6750A4`).

---

## 1. Vistas de Referencia

A continuación tienes las dos pantallas móviles generadas en Stitch que debes maquetar con fidelidad:

<Tabs>
<TabItem value="pantalla1" label="Pantalla 1: Rutina Diaria" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/fittrack-rutina-diaria.png" 
    alt="FitTrack - Pantalla de Rutina Diaria MD3" 
    style={{ maxWidth: '380px', width: '100%', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} 
  />
</div>

</TabItem>
<TabItem value="pantalla2" label="Pantalla 2: Detalle de Ejercicio">

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/fittrack-detalle-ejercicio.png" 
    alt="FitTrack - Pantalla de Detalle de Ejercicio y Series MD3" 
    style={{ maxWidth: '380px', width: '100%', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} 
  />
</div>

</TabItem>
</Tabs>

---

## 2. Requerimientos de Arquitectura

Tu solución debe cumplir estrictamente con las siguientes reglas de diseño:

1. **Separación `Screen` frente a `Page`:**
   * Las **`Screens`** son las únicas autorizadas a definir el **`Scaffold`** (con su `AppBar`, `NavigationBar` o barra persistente).
   * Las **`Pages`** contienen el lienzo visual dentro del `body`. **Nunca deben devolver un `Scaffold`**.
2. **100% `StatelessWidget`:**
   * La aplicación debe ser puramente declarativa. Cero `StatefulWidget` y cero llamadas a `setState`.
   * Toda la información debe fluir desde modelos inmutables pasados como argumentos en los constructores (`props`).
3. **Layout Responsivo y Hardware:**
   * Protege las vistas con **`SafeArea`** para respetar el notch y la barra de gestos del sistema.
   * Evita desbordes (*RenderFlex overflow*) envolviendo el contenido desplazable con **`SingleChildScrollView`**.
   * Usa **`Expanded`** y **`flex`** para que las filas y textos largos se adapten a cualquier ancho sin cálculos manuales de pantalla.

---

## 3. Misión: Descomposición y Componentización

Como ingeniero de software, debes analizar visualmente las dos pantallas y extraer componentes reutilizables en `lib/widgets/`:

```
lib/
├── models/       # Modela aquí las entidades inmutables (ejercicios, series, resúmenes)
├── widgets/      # Componentes modulares que tú debes identificar y diseñar
├── pages/        # WorkoutDashboardPage y ExerciseDetailPage (Lienzos sin Scaffold)
├── screens/      # WorkoutDashboardScreen y ExerciseDetailScreen (Scaffold y barras)
└── main.dart
```

### Elementos que debes especificar:
* **Átomos y Chips:** Identifica los chips de estadísticas (tiempo, calorías, repeticiones) y las insignias tonales de grupo muscular o estado.
* **Moléculas e Información:** Diseña la tarjeta modular de ejercicio para el listado y el banner tonal de recomendaciones y técnica.
* **Componentes de Estado:** Diseña la tarjeta de serie (*set*) capaz de renderizar sus diferentes estados visuales (completada con check, en curso con borde destacado y temporizador, o pendiente).
* **Botones de Acción:** Crea botones estilo píldora (*stadium border*) reutilizables para las acciones principales.

---

## 4. Criterios de Evaluación

| Criterio | Descripción |
| :--- | :--- |
| **Arquitectura Limpia** | Separación estricta entre `Screen` (Scaffold) y `Page` (Lienzo). Cero Scaffolds anidados. |
| **Componentización Propia** | Desacoplamiento de widgets atómicos en `lib/widgets/` con parámetros tipados e inmutables. |
| **Responsividad y Hardware** | Uso correcto de `Expanded`, `SafeArea` y erradicación total del *RenderFlex overflow* con `SingleChildScrollView`. |
| **Fidelidad y Estilos MD3** | Respeto a las maquetas visuales, bordes redondeados y uso de `BoxDecoration` sin incurrir en conflictos de color. |
