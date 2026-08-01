---
sidebar_position: 4
---

# Linux Commands

## Basic Commands

Basic Linux commands useful when working with web application deployments or servers:

- `ls`: List files and directories in current folder.
    ```bash
    ls
    file1.txt  folder1  script.sh
    ```
- `cd`: Change current directory.
    ```bash
    cd folder1
    ```
- `pwd`: Print current working directory.
    ```bash
    pwd
    /home/user/folder1
    ```
- `mkdir`: Create a new directory.
    ```bash
    mkdir new_folder
    ```
- `rm`: Remove files or directories.
    ```bash
    rm file1.txt
    rm -r folder1
    ```
- `cp`: Copy files or directories.
    ```bash
    cp file1.txt copy.txt
    cp -r folder1 copy_folder
    ```
- `mv`: Move or rename files or directories.
    ```bash
    mv file1.txt folder1/
    mv file1.txt file2.txt
    ```
- `cat`: Output contents of a file.
    ```bash
    cat file1.txt
    ```
- `tail`: Output last lines of a file.
    ```bash
    tail file1.txt 
    tail -f file1.txt  # Follow additions in real time
    tail -n 10 file1.txt  # Show last 10 lines
    ```
- `head`: Output first lines of a file.
    ```bash
    head file1.txt
    ```
- `grep`: Search patterns in files.
    ```bash
    grep "word" file1.txt
    ```
- `ssh`: Securely connect to a remote server.
    ```bash
    ssh user@server.com
    ```
- `scp`: Securely copy files between hosts.
    ```bash
    scp file.txt user@server.com:/dest/path/
    scp user@server.com:/src/path/file.txt . # Copy from remote server to local
    ```
