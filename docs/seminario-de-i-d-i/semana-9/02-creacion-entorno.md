---
sidebar_position: 2
---

# Creación de entorno

Para el desarrollo del curso utilizaremos el **SDK de Flutter**, **Dart**, un editor de código optimizado (**Visual Studio Code**) y emuladores o dispositivos físicos para depuración y pruebas en tiempo real.

A continuación encontrarás el material y la guía oficial preparados por el **profesor Domiciano Rincón** para realizar la instalación y configuración paso a paso de tu entorno de desarrollo.

---

## Video Tutorial: Instalación y Configuración

Sigue el siguiente video explicativo para descargar el SDK de Flutter, configurar las variables del sistema (`PATH`), preparar Android Studio / emuladores y validar tu instalación con `flutter doctor`:

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', borderRadius: '12px', margin: '20px 0' }}>
  <iframe
    src="https://www.youtube-nocookie.com/embed/dUMqg_JQsEc"
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    title="Tutorial Instalación de Flutter - Prof. Domiciano Rincón"
  ></iframe>
</div>

---

## Guía Escrita Paso a Paso

Si prefieres consultar la documentación textual con enlaces de descarga directa de paquetes y comandos detallados para tu sistema operativo:

<CardGrid cols={1}>
  <Card 
    title="Tutorial Web: Descarga y Configuración de Flutter" 
    description="Lección completa desarrollada por el profesor Domiciano Rincón: pasos para descargar el SDK, configuración del PATH, instalación de herramientas de compilación y comandos de diagnóstico." 
    link="https://domicianorincon.github.io/FlutterApps/lesson/0019#descargar-flutter"
  />
</CardGrid>

---

## Lista de Verificación del Entorno (Checklist)

Una vez completada la guía, asegúrate de cumplir con los siguientes puntos antes de la próxima sesión de clase:

1. **Flutter Doctor sin errores críticos**:
   ```bash
   flutter doctor
   ```
2. **Visual Studio Code**: Extensiones oficiales de *Flutter* y *Dart* instaladas.
3. **Dispositivo o Emulador Funcional**: Tener al menos un emulador Android (AVD), simulador de iOS o dispositivo físico con depuración USB/Inalámbrica configurado.
4. **Hola Mundo Verificado**: Crear y ejecutar una aplicación base para comprobar la recarga rápida (*Hot Reload*):
   ```bash
   flutter create mi_primera_app
   cd mi_primera_app
   flutter run
   ```
