---
sidebar_position: 4
---

# Introducción a Spring

<iframe src="/files/Spring%20Intro%20Pt%201.pdf" width="100%" height="600px" style={{ border: 'none' }} allowfullscreen>
    Este navegador no soporta iframes. Puedes <a href="/files/Spring%20Intro%20Pt%201.pdf">descargar el PDF aquí</a>.
</iframe>

<p style={{ textAlign: 'right' }}>
  <a href="/files/Spring%20Intro%20Pt%201.pdf" target="_blank" rel="noopener noreferrer">
    Abrir PDF en nueva pestaña (pantalla completa)
  </a>
</p>

## Spring Context usando JSP

Para crear un contexto de Spring que use JSP, sigue estos pasos:

1. Abre Visual Studio Code y crea un nuevo proyecto Maven, puedes usar los arquetipos de la anterior sección.
2. Busca los artefactos para adicionar las dependencias en la siguiente url

    [https://search.maven.org/](https://search.maven.org/).

3. Seleccionamos el Spring Context y copiamos el fragmento xml para adicionarlo al archivo `pom.xml`:

    ```xml
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>6.0.11</version>
    </dependency>
    ```

4. Ejecutamos el comando `mvn clean install` para descargar las dependencias.

```bash
mvn clean install
```

5. Adicionar la clase HolaMundo como bean.

```java
public class HolaMundo {
    
    private String mensaje;

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
```

6. Crea un archivo `applicationContext.xml` en la carpeta `src/main/resources` y define el bean:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="HolaMundo" class="HolaMundo">
        <property name="message" value="Hola Mundo spring!!" />
    </bean>

</beans>
```

7. En el archivo main de tu aplicación, carga el contexto de Spring y accede al bean:

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        HolaMundo holaMundo = (HolaMundo) context.getBean("HolaMundo");
        System.out.println(holaMundo.getMensaje());
    }
}
```

8. Ejecuta tu aplicación para ver el mensaje "Hola Mundo spring!!".

```bash
mvn exec:java -Dexec.mainClass="Main"
```

9. Si deseas usar JSP, usando el archivo `index.jsp` en la carpeta `src/main/webapp`:

```jsp
<%
    ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
    HolaMundo hola  = (HolaMundo) context.getBean("HolaMundo");
%>
```