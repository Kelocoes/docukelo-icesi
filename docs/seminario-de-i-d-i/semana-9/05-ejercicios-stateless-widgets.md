---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ejercicios Prácticos: Colección de StatelessWidgets

En esta guía pondrás a prueba tu capacidad para estructurar componentes visuales desacoplados en Flutter mediante **10 ejercicios progresivos**, desde elementos atómicos básicos hasta tarjetas compuestas complejas.

Cada ejercicio incluye dos pestañas:
1. **Componente & Vista**: Muestra la captura visual del componente diseñado bajo lineamientos de **Google Material Design 3 (Material You)** y una breve explicación de lo que representa.
2. **Consejos & Guía**: Despliega recomendaciones sobre el nombre del archivo, propósito pedagógico, paleta tonal, parámetros sugeridos para el constructor y widgets base de Flutter para su maquetación.

---

## Nivel 1: Átomos Visuales

### 01. Botón de Acción con Icono

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-01-action-button.png" 
    alt="Botón de Acción con Icono MD3" 
    style={{ maxWidth: '420px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

Un botón de acción prominente en forma de píldora (*pill shape*) con un icono a la izquierda y un texto claro, diseñado para desencadenar la descarga o guardado de un recurso en la aplicación.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/action_button.dart`
* **Propósito:** Encapsular un botón reutilizable con forma de píldora y responder a un evento de pulsación configurable.
* **Paleta M3 sugerida:** Fondo primario índigo (`#6750A4`) con texto e icono en color `on-primary` blanco (`#FFFFFF`).
* **Parámetros sugeridos para el constructor (props):** `final String label;` (ej. *"Descargar Guía"*), `final IconData icon;` (ej. `Icons.download`), `final VoidCallback onPressed;`
* **Widgets base sugeridos:** `ElevatedButton.icon` o `FilledButton.icon` con `style: ElevatedButton.styleFrom(shape: const StadiumBorder())`.

</TabItem>
</Tabs>

---

### 02. Insignia de Estado Tonal

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-02-status-badge.png" 
    alt="Insignia de Estado Tonal MD3" 
    style={{ maxWidth: '420px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

Una pequeña píldora tonal de estado con un indicador circular brillante y una etiqueta de texto, ideal para informar el progreso o condición de una tarea en un listado.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/status_badge.dart`
* **Propósito:** Crear una etiqueta compacta de estado operativo con un punto luminoso que denote estado activo o completado.
* **Paleta M3 sugerida:** Fondo `secondary-container` lavanda suave (`#E8DEF8`), texto en `on-secondary-container` y punto en esmeralda/verde (`#10B981`).
* **Parámetros sugeridos para el constructor (props):** `final String text;` (ej. *"En Progreso"*), `final Color dotColor;`
* **Widgets base sugeridos:** `Container` con `BoxDecoration` redondeado (`BorderRadius.circular(999)`), anidando un `Row(mainAxisSize: MainAxisSize.min)` con un pequeño `Container` circular y un `Text`.

</TabItem>
</Tabs>

---

### 03. Banner Informativo Tonal

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-03-notification-banner.png" 
    alt="Banner Informativo Tonal MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

Un banner de aviso institucional con fondo tonal tenue, un icono circular de información, título en negrita, texto descriptivo y botón de cierre en la esquina derecha.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/notification_banner.dart`
* **Propósito:** Presentar un comunicado destacado en la parte superior de las pantallas con opción de cierre voluntario.
* **Paleta M3 sugerida:** Fondo `surface-container-low` (`#F9F1FD`) con borde sutil en `outline-variant` (`#CBC4D2`) e icono contenedor en `primary-container` (`#6750A4`).
* **Parámetros sugeridos para el constructor (props):** `final String title;` (ej. *"Aviso Académico"*), `final String message;`, `final IconData icon;` (por defecto `Icons.info`), `final VoidCallback? onDismiss;`
* **Widgets base sugeridos:** `Container` con radio de 16px, `Row` con `CircleAvatar`, `Expanded` envolviendo un `Column` de textos, y un `IconButton` con `Icons.close`.

</TabItem>
</Tabs>

---

## Nivel 2: Moléculas Modulares

### 04. Tarjeta de Perfil de Usuario

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-04-user-profile-card.png" 
    alt="Tarjeta de Perfil de Usuario MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

Fila horizontal que agrupa el avatar circular del usuario con punto de conectividad, nombre, etiqueta tonal "En línea", rol académico y botón de mensajería instantánea.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/user_profile_card.dart`
* **Propósito:** Renderizar datos resumidos de instructores, monitores o estudiantes en listados y paneles de contacto.
* **Paleta M3 sugerida:** Fondo `surface-container` (`#F3EBF7`), badge en `primary-fixed` y punto de estado en verde esmeralda.
* **Parámetros sugeridos para el constructor (props):** `final String name;` (ej. *"Sofia Martinez"*), `final String role;` (ej. *"Monitora SIS • Flutter GDE"*), `final String avatarUrl;`, `final bool isOnline;`, `final VoidCallback onMessage;`
* **Widgets base sugeridos:** `Card` o `Container`, `Row` principal, `Stack` sobre el `CircleAvatar` para el indicador de conexión, `Column` para el nombre y rol, y un `IconButton` con `Icons.chat`.

</TabItem>
</Tabs>

---

### 05. Tarjeta de Métrica Analítica

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-05-metric-card.png" 
    alt="Tarjeta de Métrica Analítica Bento MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

Tarjeta informativa estilo bento que presenta una métrica cuantitativa destacada en gran tamaño tipográfico, acompañada de su tendencia porcentual e indicador de racha de estudio.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/metric_card.dart`
* **Propósito:** Desplegar indicadores clave de rendimiento (KPIs) en tableros de estudiante o resúmenes semanales.
* **Paleta M3 sugerida:** Superficie en `surface-container-lowest` blanca (`#FFFFFF`), icono en contenedor tonal primario al 10% y tendencia en verde esmeralda.
* **Parámetros sugeridos para el constructor (props):** `final String title;` (ej. *"Tiempo de Estudio"*), `final String value;` (ej. *"2,840 hrs"*), `final String trendText;` (ej. *"+14.2% este mes"*), `final String streakDays;` (ej. *"28d"*), `final IconData icon;`
* **Widgets base sugeridos:** `Card` con bordes redondeados pronunciados (radio 24px), `Row` que separa la columna de estadísticas y un `Container` cuadrado para el badge de racha.

</TabItem>
</Tabs>

---

### 06. Elemento de Lista Multimedia

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-06-audio-track-item.png" 
    alt="Elemento de Lista Multimedia MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

Elemento de lista con carátula cuadrada redondeada, título del podcast, duración con autor y un botón circular tonal para reproducción inmediata.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/audio_track_item.dart`
* **Propósito:** Construir filas interactivas para bibliotecas de audio, episodios de podcast o lecciones grabadas.
* **Paleta M3 sugerida:** Fondo `surface-container-low` (`#F9F1FD`) con botón de acción en `secondary-container` (`#E8DEF8`).
* **Parámetros sugeridos para el constructor (props):** `final String title;` (ej. *"Podcast Flutter: State Management"*), `final String subtitle;` (ej. *"DevCommunity Radio • 14:20 min"*), `final String imageUrl;`, `final VoidCallback onPlay;`
* **Widgets base sugeridos:** `Container` con padding, `ClipRRect` para la miniatura de la imagen (radio de 12px), `Expanded` para evitar desbordes en textos largos, e `IconButton.filledTonal` con `Icons.play_arrow`.

</TabItem>
</Tabs>

---

### 07. Mini Reproductor Flotante

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-07-mini-music-player.png" 
    alt="Mini Reproductor Flotante MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
  />
</div>

Widget flotante con carátula de episodio, textos descriptivos, barra de progreso con marcas de tiempo (02:45 / 05:30) y controles de reproducción compactos.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/mini_music_player.dart`
* **Propósito:** Emular la barra persistente de reproducción que flota sobre la interfaz del usuario.
* **Paleta M3 sugerida:** Fondo elevado en `surface-container-high` (`#EDE6F1`), barra de progreso y botón principal en `primary` (`#4F378A`).
* **Parámetros sugeridos para el constructor (props):** `final String title;` (ej. *"Ep. 42: Clean Architecture"*), `final String channel;` (ej. *"Flutter Latam Network"*), `final String imageUrl;`, `final double progress;` (valor entre 0.0 y 1.0), `final bool isPlaying;`, `final VoidCallback onPlayPause;`, `final VoidCallback onNext;`
* **Widgets base sugeridos:** `Card` con elevación nivel 3 (radio 24px), `Column` que aloja una fila superior con imagen, títulos y botones de control, y una sección inferior con `LinearProgressIndicator` y textos de tiempo.

</TabItem>
</Tabs>

---

## Nivel 3: Organismos Complejos

### 08. Ficha Comercial de Catálogo

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-08-product-card.png" 
    alt="Ficha Comercial de Catálogo MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
  />
</div>

Tarjeta vertical de catálogo educativo que integra imagen de cabecera con badge flotante de certificación, botón de guardado, calificación por estrellas, precio tachado con descuento y botón de compra.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/product_card.dart`
* **Propósito:** Diseñar la pieza principal de un catálogo de cursos, productos digitales o lecciones premium.
* **Paleta M3 sugerida:** Fondo `surface-container-lowest` blanco, badge de categoría en color primario, estrellas en tono ámbar y botón en color primario índigo.
* **Parámetros sugeridos para el constructor (props):** `final String title;` (ej. *"Curso Flutter Avanzado: De Cero a Experto con MD3"*), `final String category;` (ej. *"Certificación"*), `final String imageUrl;`, `final double rating;` (ej. `4.9`), `final String reviewsCount;` (ej. *"(1.2k reseñas)"*), `final String currentPrice;` (ej. *"$29.99 USD"*), `final String originalPrice;` (ej. *"$59.99 USD"*), `final VoidCallback onBuy;`, `final VoidCallback onBookmark;`
* **Widgets base sugeridos:** `Card` vertical con `ClipRRect` superior, `Stack` para superponer el chip y botón sobre la imagen, y un `Padding` inferior con `Column` que distribuya los textos de calificación, precios y el `ElevatedButton.icon`.

</TabItem>
</Tabs>

---

### 09. Tarjeta de Tarea Académica

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-09-course-task-card.png" 
    alt="Tarjeta de Tarea Académica MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} 
  />
</div>

Tarjeta de actividad con borde lateral izquierdo resaltado, checkbox de marcado, etiqueta de prioridad de alta urgencia, código de asignatura y fecha límite de entrega.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/course_task_card.dart`
* **Propósito:** Gestionar entregables de laboratorio y sprints dentro de un listado de tareas pendientes.
* **Paleta M3 sugerida:** Fondo `surface-container-low` (`#F9F1FD`), borde izquierdo en `primary` (`#6750A4`) de 4px, y badge de prioridad en `error-container` (`#FFDAD6`).
* **Parámetros sugeridos para el constructor (props):** `final String title;` (ej. *"Módulo 4: Custom Painters en Flutter"*), `final String courseCode;` (ej. *"FLT-302"*), `final String dueDate;` (ej. *"Vence: 18 Oct"*), `final String priority;` (ej. *"Alta Prioridad"*), `final bool isCompleted;`, `final ValueChanged<bool?> onToggle;`
* **Widgets base sugeridos:** `Container` con `BoxDecoration(border: Border(left: BorderSide(color: ..., width: 4)))`, `Checkbox` para el estado y `Row` anidando badges con `Icons.code` y `Icons.calendar_today`.

</TabItem>
</Tabs>

---

### 10. Publicación Completa de Feed Social

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widget-10-activity-feed-post.png" 
    alt="Publicación Completa de Feed Social MD3" 
    style={{ maxWidth: '460px', width: '100%', borderRadius: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
  />
</div>

El componente más completo de la serie: un post social con cabecera de autor y timestamp, cuerpo textual con interlineado legible, fotografía adjunta enmarcada y barra de interacciones con contadores de likes, comentarios, compartir y guardar.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `lib/components/activity_feed_post.dart`
* **Propósito:** Ensamblar el componente más completo de la serie: un post de red social académica que combina autor, texto de divulgación, imagen adjunta y barra de reacciones interactivas.
* **Paleta M3 sugerida:** Tarjeta amplia en `surface-container-lowest` con radios de 24px a 28px, divisores sutiles y botones de interacción en gris oscuro / secundario.
* **Parámetros sugeridos para el constructor (props):** `final String authorName;` (ej. *"Carlos Mendoza"*), `final String authorHandle;` (ej. *"@cmendoza_dev"*), `final String authorAvatarUrl;`, `final String timeAgo;` (ej. *"Hace 2 horas"*), `final String content;`, `final String? mediaImageUrl;` (imagen opcional), `final int likesCount;`, `final int commentsCount;`, `final bool isLiked;`, `final VoidCallback onLike;`, `final VoidCallback onComment;`, `final VoidCallback onShare;`, `final VoidCallback onBookmark;`
* **Widgets base sugeridos:** `Card` envolviendo un `Padding` general de 16px, `Row` con `CircleAvatar` para la cabecera, `ClipRRect` de radio 16px para el contenido multimedia opcional, y un `Row` inferior (`MainAxisAlignment.spaceBetween`) con botones de interacción para likes, comentarios, compartir y guardar.

</TabItem>
</Tabs>
