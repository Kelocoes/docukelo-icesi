---
sidebar_position: 2
---

# Docker Commands

When working with Docker, we interact across multiple areas when executing code blocks or commands for container configuration. Below are the most common and useful Docker commands.

## Basic Docker Commands

| Command | Description |
|---------|-------------|
| `docker images` | List all downloaded images. |
| `docker pull <image-name>:<tag>` | Download an image from a repository. |
| `docker rmi <image-name>:<tag>` | Delete a downloaded image. |
| `docker create --name <container-name> <image-name>:<tag>` | Create a container from an image. |
| `docker start <id>` | Start an already created container. |
| `docker run <id>` | Create and start a container (equivalent to create + start). |
| `docker rm <container-name>` | Delete a container. |
| `docker stop <container-id>` | Stop a running container. |
| `docker ps -a` | Show all containers, including stopped ones. |
| `docker logs --follow <container-name>` | Output container logs in real time. |
| `docker network ls` | List configured Docker networks. |
| `docker network create <network-name>` | Create a new network. |
| `docker network rm <network-name>` | Delete an existing network. |
| `docker build -t <image-name>:<my-tag>` | Build an image from a Dockerfile. |

## Dockerfile Structure

A Dockerfile is a text file containing instructions to build a Docker image. Below is the basic structure of a Dockerfile:

```bash
# Dockerfile
FROM <base-image-name>:<tag>  # Base image
MAINTAINER <name> <email>  # Maintainer information
RUN <command>  # Command to execute during image build
COPY <source> <destination>  # Copy files into container
ADD <source> <destination>  # Similar to COPY with extra features
EXPOSE <port>  # Expose a container port
CMD ["<command>", "<arguments>"]  # Default command when starting container
ENTRYPOINT ["<command>", "<arguments>"]  # Fixed command executed on start
```

### Difference between CMD and ENTRYPOINT

CMD and ENTRYPOINT define the command executed when a container starts. The main difference is that CMD provides default values that can be overridden at runtime, whereas ENTRYPOINT defines a fixed command that always runs.

## Structure of a `docker-compose.yml`

A `docker-compose.yml` file allows defining and running multi-container applications:

```yaml
version: "3.9"
services:
    backendnode:
        depends_on:
            - mi_postgres
        build: .
        ports: 
            - "3000:3000"
        links:
            - mi_postgres
    mi_postgres:
        image: postgres:14.18
        ports:
            - "5440:5432"
        environment:
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=postgres
            - POSTGRES_DB=test_docker
        volumes:
            - mi_postgres_data:/var/lib/postgresql/data

volumes:
    mi_postgres_data:
```

## Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start services defined in `docker-compose.yml`. |
| `docker-compose down` | Stop and remove containers, networks, and volumes created by `up`. |
| `docker-compose build` | Build images for services defined in `docker-compose.yml`. |
| `docker-compose logs` | View logs for all services. |
| `docker-compose exec <service> <command>` | Execute a command inside a running service container. |

---

## Self-Assessment Quiz

<Quiz id="comp3-docker-commands-quiz">
  <Question title="Which Docker command is used to list all locally stored images?">
    <Option>docker ps -a</Option>
    <Option correct>docker images</Option>
    <Option>docker network ls</Option>
    <Option>docker pull</Option>
  </Question>
  <Question title="Which command combines container creation and startup in a single step?">
    <Option>docker build</Option>
    <Option>docker create</Option>
    <Option correct>docker run</Option>
    <Option>docker start</Option>
  </Question>
  <Question title="What is the FROM instruction used for in a Dockerfile?">
    <Option>To expose TCP ports to the internal network.</Option>
    <Option correct>To specify the base image and tag from which the new image will be built.</Option>
    <Option>To define the default command when stopping the container.</Option>
    <Option>To create a persistent volume on the host system.</Option>
  </Question>
  <Question title="What is the main difference between CMD and ENTRYPOINT in a Dockerfile?">
    <Option>CMD requires admin permissions while ENTRYPOINT runs unprivileged.</Option>
    <Option correct>CMD provides default values that can be overridden at runtime, while ENTRYPOINT sets a fixed command.</Option>
    <Option>ENTRYPOINT executes during image build and CMD only when publishing.</Option>
    <Option>There is no difference; both instructions are identical.</Option>
  </Question>
  <Question title="Which Dockerfile directive copies local files from the host into the container filesystem?">
    <Option>EXPOSE</Option>
    <Option>MAINTAINER</Option>
    <Option correct>COPY</Option>
    <Option>RUN</Option>
  </Question>
  <Question title="In docker-compose.yml, which directive ensures mi_postgres starts before backendnode?">
    <Option>environment</Option>
    <Option correct>depends_on</Option>
    <Option>volumes</Option>
    <Option>ports</Option>
  </Question>
  <Question title="In a docker-compose.yml file, what is the role of the volumes section?">
    <Option>To cap database RAM memory usage.</Option>
    <Option>To map user authentication environment variables.</Option>
    <Option correct>To store database data persistently outside the container's ephemeral lifecycle.</Option>
    <Option>To expose container port 5432 to the public network.</Option>
  </Question>
  <Question title="Which Docker Compose command stops and removes containers, networks, and volumes?">
    <Option>docker-compose stop</Option>
    <Option correct>docker-compose down</Option>
    <Option>docker-compose rmi</Option>
    <Option>docker-compose clear</Option>
  </Question>
  <Question title="Which command allows executing an internal command inside an active Docker Compose service?">
    <Option>docker-compose run &lt;service&gt;</Option>
    <Option correct>docker-compose exec &lt;service&gt; &lt;command&gt;</Option>
    <Option>docker-compose build &lt;service&gt;</Option>
    <Option>docker-compose logs &lt;service&gt;</Option>
  </Question>
  <Question title="Which flag in docker build assigns a name tag to the built image?">
    <Option>-p</Option>
    <Option>-d</Option>
    <Option correct>-t</Option>
    <Option>-v</Option>
  </Question>
</Quiz>
