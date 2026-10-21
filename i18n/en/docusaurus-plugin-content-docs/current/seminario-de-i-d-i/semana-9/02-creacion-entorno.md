---
sidebar_position: 2
description: "Install and configure the Flutter SDK, Dart and Visual Studio Code, and verify your environment with a checklist."
---

# Environment Setup

For the course we will use the **Flutter SDK**, **Dart**, an optimized code editor (**Visual Studio Code**) and emulators or physical devices for real-time debugging and testing.

Below you will find the material and the official guide prepared by **Professor Domiciano Rincón** to install and configure your development environment step by step.

---

## Video Tutorial: Installation and Setup

Watch the following video to download the Flutter SDK, configure the system variables (`PATH`), prepare Android Studio / emulators and validate your installation with `flutter doctor`:

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', borderRadius: '12px', margin: '20px 0' }}>
  <iframe
    src="https://www.youtube-nocookie.com/embed/dUMqg_JQsEc"
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    title="Flutter Installation Tutorial - Prof. Domiciano Rincón"
  ></iframe>
</div>

---

## Step-by-Step Written Guide

If you prefer the written documentation, with direct download links for the packages and detailed commands for your operating system:

<CardGrid cols={1}>
  <Card 
    title="Web Tutorial: Downloading and Setting Up Flutter" 
    description="Complete lesson by Professor Domiciano Rincón: steps to download the SDK, configure the PATH, install the build tools and run diagnostic commands." 
    link="https://domicianorincon.github.io/FlutterApps/lesson/0019#descargar-flutter"
  />
</CardGrid>

---

## Environment Checklist

Once you have completed the guide, make sure you meet the following points before the next class session:

1. **Flutter Doctor with no critical errors**:
   ```bash
   flutter doctor
   ```
2. **Visual Studio Code**: Official *Flutter* and *Dart* extensions installed.
3. **Working Device or Emulator**: Have at least one Android emulator (AVD), iOS simulator or physical device with USB/Wireless debugging configured.
4. **Verified Hello World**: Create and run a base application to check *Hot Reload*:
   ```bash
   flutter create mi_primera_app
   cd mi_primera_app
   flutter run
   ```
