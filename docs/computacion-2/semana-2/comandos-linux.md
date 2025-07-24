---
sidebar_position: 2
---

# Comandos de Linux

## Comandos básicos

Algunos comandos básicos de linux que podrían ser útiles para cuando se trabaje despliegues de aplicaciones web o servidores:

- `ls`: Lista los archivos y directorios en el directorio actual.
    ```bash
    ls
    archivo1.txt  carpeta1  script.sh
    ```
- `cd`: Cambia el directorio actual.
    ```bash
    cd carpeta1
    ```
- `pwd`: Muestra el directorio de trabajo actual.
    ```bash
    pwd
    /home/usuario/carpeta1
    ```
- `mkdir`: Crea un nuevo directorio.
    ```bash
    mkdir nueva_carpeta
    ```
- `rm`: Elimina archivos o directorios.
    ```bash
    rm archivo1.txt
    rm -r carpeta1
    ```
- `cp`: Copia archivos o directorios.
    ```bash
    cp archivo1.txt copia.txt
    cp -r carpeta1 copia_carpeta
    ```
- `mv`: Mueve o renombra archivos o directorios.
    ```bash
    mv archivo1.txt carpeta1/
    mv archivo1.txt archivo2.txt
    ```
- `cat`: Muestra el contenido de un archivo.
    ```bash
    cat archivo1.txt
    ```
- `tail`: Muestra las últimas líneas de un archivo.
    ```bash
    tail archivo1.txt 
    tail -f archivo1.txt  # Muestra en tiempo real las nuevas líneas añadidas
    tail -n 10 archivo1.txt  # Muestra las últimas 10 líneas
    ```
- `head`: Muestra las primeras líneas de un archivo.
    ```bash
    head archivo1.txt
    ```
- `grep`: Busca patrones en archivos.
    ```bash
    grep "palabra" archivo1.txt
    ```
- `ssh`: Conecta a un servidor remoto de forma segura.
    ```bash
    ssh usuario@servidor.com
    ```
- `scp`: Copia archivos entre hosts de forma segura.
    ```bash
    scp archivo.txt usuario@servidor.com:/ruta/destino/
    scp usuario@servidor.com:/ruta/origen/archivo.txt . # Copia desde el servidor remoto al local
    ```