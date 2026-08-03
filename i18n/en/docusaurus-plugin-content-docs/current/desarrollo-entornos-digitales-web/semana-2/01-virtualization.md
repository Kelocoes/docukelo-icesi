---
sidebar_position: 1
---

# Containers

Before diving into containers, it is helpful to first understand virtual machines (VMs), as containers evolved from this technology.

## Virtual Machines

Virtual machines allow running operating systems and applications in a virtualized environment, separated from physical hardware. For example, if you have Linux installed but need to run a Windows-exclusive application, you can create a Windows VM inside your Linux system. In this context, the physical computer is called the "host" and each virtual machine is a "guest". It is possible to have multiple guests on the same host, sharing physical resources.

### Hypervisor

The hypervisor is the software responsible for managing virtual machines. Its main function is to allocate resources (CPU, memory, storage) between the host and guests. There are two main types:

- **Type 1 Hypervisor ("bare-metal")**: Runs directly on physical hardware without an underlying operating system. Offers higher performance and efficiency. Examples: VMware ESXi, Microsoft Hyper-V.
- **Type 2 Hypervisor**: Installs on an existing operating system, making it easier to use but potentially impacting performance. Examples: Oracle VirtualBox, VMware Workstation.

### Types of Virtual Machines

- **Full VMs**: Emulate all hardware, running full operating systems. Ideal for applications requiring total isolation, but consume more resources.
- **Lightweight VMs (Containers)**: Share the host operating system kernel, making them more efficient. Ideal for specific applications.
- **Special-Purpose VMs**: Optimized for specific tasks, sacrificing versatility for performance.

### Advantages and Disadvantages of Virtual Machines

**Advantages:**
- Complete isolation between environments.
- Flexibility to run multiple operating systems.
- Useful for testing and development across different platforms.

**Disadvantages:**
- High resource consumption.
- Complex management of multiple VMs.
- Lower performance compared to running directly on hardware.

## Containers

Containers represent an evolution in virtualization, focusing on efficiency and portability. Unlike VMs, containers do not emulate full hardware; instead, they share the host operating system kernel. This allows applications to start quickly while consuming fewer resources.

A container encapsulates an application and its dependencies, ensuring consistent execution across any environment. To manage containers, platforms like Docker are used, simplifying the creation, deployment, and administration of these isolated environments.

<img src="/img/desarrollo-entornos-digitales-web/docker-architecture.png" alt="Container" width="600" />

### Docker

Docker is the most popular container platform. It allows packaging applications along with their dependencies into portable images, facilitating deployment on any compatible system. Docker uses a container engine that manages execution and isolation.

**Key Reasons for Popularity:**
- **Portability:** Docker images can run on any system with Docker installed, from laptops to cloud servers.
- **Isolation:** Each container is independent, preventing dependency conflicts.
- **Efficiency:** Containers are lightweight, enabling more applications to run on the same hardware.

### Key Differences Between Containers and Virtual Machines

- **Architecture:** VMs emulate full hardware; containers share the host kernel.
- **Resource Consumption:** Containers are lighter and more efficient.
- **Startup Speed:** Containers start in seconds, whereas VMs can take minutes.
- **Portability:** Containers simplify deployment across different environments without configuration changes.

### Advantages and Disadvantages of Containers

**Advantages:**
- Portability and consistency across development, testing, and production environments.
- Application isolation, avoiding dependency hell.
- Resource efficiency and rapid deployment.

**Disadvantages:**
- Lower security isolation compared to VMs, as they share the host kernel.
- Complex management in large container fleets (solvable with orchestration tools like Kubernetes).
- Data Persistence: Data inside a container can be lost upon deletion; volumes or external storage services are recommended.

---

**Information of Interest**

- Containers have driven modern practices like DevOps and microservices, allowing teams to develop, test, and deploy applications rapidly and scalability.
- Tools like Kubernetes orchestrate and manage large numbers of containers, automating tasks like scaling, load balancing, and failure recovery.
- Containers do not replace VMs in all scenarios; each technology has its place depending on isolation, security, and compatibility requirements.

---

## Self-Assessment Quiz

<Quiz id="dedw-containers-quiz">
  <Question title="What is the role of the 'host' computer in traditional virtualization?">
    <Option>It is a virtual machine that emulates hardware components.</Option>
    <Option correct>It is the physical machine running the hypervisor and virtual machines (guests).</Option>
    <Option>It is the software distributing network packets to containers.</Option>
    <Option>It is the base image from which guest systems are instantiated.</Option>
  </Question>
  <Question title="What is the defining characteristic of a Type-1 (bare-metal) Hypervisor?">
    <Option>It is installed on a commercial OS like Windows 11 or macOS.</Option>
    <Option correct>It runs directly on physical hardware without requiring an underlying operating system.</Option>
    <Option>It functions exclusively inside web browsers using WebAssembly.</Option>
    <Option>It requires every container to include its own Linux kernel.</Option>
  </Question>
  <Question title="Which tool is an example of a Type-2 Hypervisor mentioned in the reading?">
    <Option>VMware ESXi.</Option>
    <Option>Microsoft Hyper-V bare-metal.</Option>
    <Option correct>Oracle VirtualBox.</Option>
    <Option>Docker Engine Daemon.</Option>
  </Question>
  <Question title="How do containers primarily differ from virtual machines in terms of architecture?">
    <Option>Containers emulate the entire instruction set of the physical CPU.</Option>
    <Option correct>Containers share the host operating system kernel instead of emulating full hardware.</Option>
    <Option>Virtual machines cannot execute applications with binary dependencies.</Option>
    <Option>Containers require installing a mandatory Guest OS VM per application.</Option>
  </Question>
  <Question title="What is a major advantage of container technology according to the text?">
    <Option>It provides 100% independent hardware-level kernel isolation.</Option>
    <Option>It enables running multiple different kernels without a hypervisor.</Option>
    <Option correct>It provides high portability and rapid startup speed in seconds.</Option>
    <Option>It automatically eliminates the need for databases and persistent storage.</Option>
  </Question>
  <Question title="What happens to data stored internally inside a container when it is deleted?">
    <Option>It is automatically backed up to Docker Hub cloud.</Option>
    <Option correct>It can be permanently lost unless volumes or external storage services are used.</Option>
    <Option>It turns into a new base image inside the local registry.</Option>
    <Option>It automatically migrates to a bare-metal virtual machine.</Option>
  </Question>
  <Question title="Which of the following is considered a disadvantage of containers compared to traditional VMs?">
    <Option>Slower startup time taking several minutes to start services.</Option>
    <Option>Inability to package libraries or application dependencies.</Option>
    <Option correct>Lower security isolation compared to VMs due to sharing the host OS kernel.</Option>
    <Option>Inability to run in cloud environments or remote servers.</Option>
  </Question>
  <Question title="Which tool is mentioned for managing and orchestrating large container fleets in production?">
    <Option>Orchestration tools like Kubernetes.</Option>
    <Option>Type-2 hypervisors like VirtualBox.</Option>
    <Option>Replacing containers with monolithic ISO images.</Option>
    <Option>Manual startup scripts on each physical machine.</Option>
  </Question>
  <Question title="Why do virtual machines remain useful despite the popularity of containers?">
    <Option>Because containers cannot run applications developed in compiled languages.</Option>
    <Option correct>Because VMs are ideal when requiring a complete OS or critical security isolation.</Option>
    <Option>Because VMs consume fewer RAM resources than containers.</Option>
    <Option>Because containers do not support network port mapping.</Option>
  </Question>
  <Question title="Which Docker component packages the application and its dependencies into a portable unit?">
    <Option>The Type-1 Hypervisor.</Option>
    <Option correct>The Docker Image.</Option>
    <Option>The Windows Guest OS.</Option>
    <Option>The SWAP memory file.</Option>
  </Question>
</Quiz>
