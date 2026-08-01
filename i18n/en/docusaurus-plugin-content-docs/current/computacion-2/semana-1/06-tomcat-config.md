---
sidebar_position: 6
---

# Smart Tomcat Setup Guide

This guide helps you set up Smart Tomcat in your development environment using IntelliJ IDEA or Visual Studio Code.

## Prerequisites

Ensure you have installed:
- IntelliJ IDEA Ultimate or Visual Studio Code
- Java JDK 17
- Tomcat 10 or higher
- Maven
- Git

## IntelliJ IDEA Setup

1. Open IntelliJ IDEA and select **New Project**.
2. Choose **Jakarta EE** template and select **Web Application**.
3. Under **Application server**, select **Tomcat Server** $\rightarrow$ **Tomcat 10**.
4. Install **Smart Tomcat** plugin from marketplace and configure run configuration.

## Visual Studio Code Setup

1. Install **Java Extension Pack**.
2. Run `Java: Create Java Project` $\rightarrow$ **Maven** $\rightarrow$ **maven-archetype-webapp**.
3. Add `jakarta.servlet-api` dependency to `pom.xml`.
4. Install **Community Server Connectors** extension to run Tomcat server.
