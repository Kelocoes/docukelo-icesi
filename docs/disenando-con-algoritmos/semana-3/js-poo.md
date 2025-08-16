# Programación Orientada a Objetos en JavaScript

¡Bienvenido al mundo de la Programación Orientada a Objetos (POO) en JavaScript! Si estás aquí, probablemente ya sabes algo de programación básica, pero ahora quieres dar el siguiente paso. La POO es como organizar tu código de una manera más inteligente, como si fueras un arquitecto diseñando una casa en lugar de solo apilar ladrillos.

## ¿Qué es la Programación Orientada a Objetos?

Imagina que quieres modelar un auto en tu código. En lugar de tener variables sueltas como `colorAuto`, `marcaAuto`, `velocidadAuto`, la POO te permite crear un "molde" (clase) que define cómo debe ser cualquier auto, y luego crear "autos específicos" (objetos) a partir de ese molde.

## Clases y Objetos

### Definiendo una Clase

Una clase es como el plano de lo que vas a hacer. Define qué características y comportamientos tendrán todos los objetos creados a partir de él, pero aún no creas los objetos.

```javascript
class Auto {
  // Constructor: se ejecuta cuando creamos un nuevo auto
  constructor(marca, modelo, color) {
    this.marca = marca; // Propiedad
    this.modelo = modelo; // Propiedad
    this.color = color; // Propiedad
    this.velocidad = 0; // Propiedad con valor inicial
    this.encendido = false; // Propiedad con valor inicial
  }

  // Métodos: las acciones que puede realizar el auto
  encender() {
    this.encendido = true;
    console.log(`El ${this.marca} ${this.modelo} está encendido`);
  }

  acelerar(incremento) {
    if (this.encendido) {
      this.velocidad += incremento;
      console.log(`Velocidad actual: ${this.velocidad} km/h`);
    } else {
      console.log("Primero debes encender el auto");
    }
  }

  frenar() {
    this.velocidad = Math.max(0, this.velocidad - 10);
    console.log(`Frenando... Velocidad: ${this.velocidad} km/h`);
  }
}
```

### Creando Objetos (Instancias)

Una **instancia** es un objeto real creado a partir de una clase.  
Cada objeto tiene sus **propios valores** y su **propio estado**, aunque todos comparten la misma estructura y comportamientos definidos en la clase.

```javascript
// Crear objetos específicos a partir de la clase
const miAuto = new Auto("Toyota", "Corolla", "rojo");
const tuAuto = new Auto("Honda", "Civic", "azul");

// Usar los objetos
miAuto.encender();
miAuto.acelerar(50);
miAuto.frenar();

tuAuto.encender();
tuAuto.acelerar(30);
```

## Getters y Setters

**¿Qué son?** Los getters y setters son como "puertas especiales" para acceder y modificar las propiedades de un objeto. En lugar de cambiar algo directamente, pasas por estas puertas que pueden validar, transformar o proteger la información.

**En palabras simples:** "Controlo cómo se lee y cómo se modifica mi información"

### ¿Por qué usarlos?

Imagina que tienes una propiedad `edad` en un objeto `Persona`. Sin getters/setters, alguien podría hacer esto:

```javascript
persona.edad = -50; // ¡Esto no tiene sentido!
persona.edad = "veinte"; // ¡Esto tampoco!
```

Con getters y setters, puedes controlar qué valores son válidos.

### Ejemplo Básico

```javascript
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this._edad = edad; // Usamos _ para indicar que es "semi-privada"
  }

  // GETTER: controla cómo se LEE la propiedad
  get edad() {
    return this._edad;
  }

  // SETTER: controla cómo se MODIFICA la propiedad
  set edad(nuevaEdad) {
    if (nuevaEdad < 0) {
      console.log("❌ La edad no puede ser negativa");
      return;
    }
    if (nuevaEdad > 150) {
      console.log("❌ Esa edad parece un poco alta...");
      return;
    }
    if (typeof nuevaEdad !== "number") {
      console.log("❌ La edad debe ser un número");
      return;
    }

    this._edad = nuevaEdad;
    console.log(`✅ Edad actualizada a ${nuevaEdad} años`);
  }

  // Getter que calcula algo dinámicamente
  get esAdulto() {
    return this._edad >= 18;
  }

  // Getter para información combinada
  get informacion() {
    return `${this.nombre}, ${this._edad} años (${
      this.esAdulto ? "Adulto" : "Menor"
    })`;
  }
}

// Uso de getters y setters
const ana = new Persona("Ana", 25);

console.log(ana.edad); // Getter: lee la edad (25)
console.log(ana.esAdulto); // Getter calculado: true
console.log(ana.informacion); // Getter combinado: "Ana, 25 años (Adulto)"

// Los setters validan automáticamente
ana.edad = 30; // ✅ Funciona
ana.edad = -5; // ❌ Error controlado
ana.edad = "treinta"; // ❌ Error controlado
ana.edad = 200; // ❌ Error controlado

console.log(ana.informacion); // "Ana, 30 años (Adulto)"
```

### Ejemplo Más Avanzado: Cuenta de Usuario

```javascript
class CuentaUsuario {
  constructor(usuario, email) {
    this._usuario = usuario;
    this._email = email;
    this._activa = true;
    this._intentosFallidos = 0;
  }

  // Getter simple
  get usuario() {
    return this._usuario;
  }

  // Setter que valida formato de usuario
  set usuario(nuevoUsuario) {
    // Validar que solo tenga letras, números y guiones bajos
    if (!/^[a-zA-Z0-9_]+$/.test(nuevoUsuario)) {
      console.log("❌ El usuario solo puede tener letras, números y _");
      return;
    }

    if (nuevoUsuario.length < 3) {
      console.log("❌ El usuario debe tener al menos 3 caracteres");
      return;
    }

    this._usuario = nuevoUsuario;
    console.log(`✅ Usuario cambiado a: ${nuevoUsuario}`);
  }

  // Getter que formatea el email
  get email() {
    return this._activa ? this._email : "[CUENTA DESACTIVADA]";
  }

  // Setter que valida email
  set email(nuevoEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nuevoEmail)) {
      console.log("❌ Email inválido");
      return;
    }

    this._email = nuevoEmail;
    console.log(`✅ Email actualizado a: ${nuevoEmail}`);
  }

  // Getter que indica el estado de la cuenta
  get estado() {
    if (!this._activa) return "🔒 Desactivada";
    if (this._intentosFallidos >= 3) return "⚠️ Bloqueada";
    return "✅ Activa";
  }

  // Método que usa setter internamente
  intentarLogin(contraseña) {
    if (contraseña === "123456") {
      // Contraseña súper segura 😅
      this._intentosFallidos = 0;
      console.log(`🎉 ¡Bienvenido ${this._usuario}!`);
    } else {
      this._intentosFallidos++;
      console.log(
        `❌ Contraseña incorrecta. Intentos: ${this._intentosFallidos}/3`
      );
    }
  }

  // Setter para reactivar cuenta (solo desde código interno)
  set _reactivarCuenta(valor) {
    if (valor === true) {
      this._activa = true;
      this._intentosFallidos = 0;
      console.log("✅ Cuenta reactivada");
    }
  }
}

// Probando la cuenta
const miCuenta = new CuentaUsuario("ana_92", "ana@email.com");

console.log(`Usuario: ${miCuenta.usuario}`);
console.log(`Email: ${miCuenta.email}`);
console.log(`Estado: ${miCuenta.estado}`);

// Cambiar datos con validación automática
miCuenta.usuario = "a"; // ❌ Muy corto
miCuenta.usuario = "ana@gmail"; // ❌ Caracteres inválidos
miCuenta.usuario = "ana_garcia"; // ✅ Válido

miCuenta.email = "email-malo"; // ❌ Email inválido
miCuenta.email = "ana@gmail.com"; // ✅ Válido

// Probar login
miCuenta.intentarLogin("password"); // ❌ Incorrecto
miCuenta.intentarLogin("password"); // ❌ Incorrecto
miCuenta.intentarLogin("password"); // ❌ Incorrecto
console.log(`Estado: ${miCuenta.estado}`); // Bloqueada

miCuenta.intentarLogin("123456"); // ✅ Correcto
```

### Getters y Setters con Propiedades Privadas

```javascript
class Producto {
  #precio = 0; // Propiedad verdaderamente privada
  #descuento = 0;

  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio; // Usa el setter automáticamente
  }

  // Getter para precio (lectura controlada)
  get precio() {
    return this.#precio;
  }

  // Setter para precio (escritura controlada)
  set precio(nuevoPrecio) {
    if (nuevoPrecio < 0) {
      console.log("❌ El precio no puede ser negativo");
      return;
    }
    this.#precio = nuevoPrecio;
  }

  // Getter para descuento
  get descuento() {
    return this.#descuento;
  }

  // Setter para descuento (con validación)
  set descuento(porcentaje) {
    if (porcentaje < 0 || porcentaje > 100) {
      console.log("❌ El descuento debe estar entre 0% y 100%");
      return;
    }
    this.#descuento = porcentaje;
  }

  // Getter calculado: precio final con descuento
  get precioFinal() {
    const descuentoEnDinero = (this.#precio * this.#descuento) / 100;
    return this.#precio - descuentoEnDinero;
  }

  // Getter que formatea el precio para mostrar
  get precioFormateado() {
    return `$${this.precioFinal.toFixed(2)}`;
  }
}

// Usar el producto
const laptop = new Producto("Laptop Gaming", 1000);

console.log(`Precio original: $${laptop.precio}`);
laptop.descuento = 20;
console.log(`Con 20% descuento: ${laptop.precioFormateado}`);

laptop.descuento = 150; // ❌ No permite más de 100%
laptop.precio = -500; // ❌ No permite precios negativos
```

### Cuándo Usar Getters y Setters

**Úsalos cuando necesites:**

- Validar datos antes de guardarlos
- Calcular valores dinámicamente
- Formatear datos al mostrarlos
- Controlar el acceso a propiedades sensibles
- Mantener otras propiedades sincronizadas

**NO los uses para:**

- Propiedades simples que no necesitan validación
- Solo por "hacer bonito" el código
- Operaciones muy costosas en getters (pueden hacer lento tu código)

**Regla de oro**: Si solo necesitas guardar y leer un valor sin validación ni cálculos, una propiedad normal está bien. Los getters/setters son para cuando necesitas "hacer algo especial" al leer o escribir.

## Propiedades y Métodos

### Propiedades

Las propiedades son las características de un objeto. Pueden ser públicas (accesibles desde fuera) o privadas (solo accesibles desde dentro de la clase).

```javascript
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre; // Propiedad pública
    this.edad = edad; // Propiedad pública
    this._id = Math.random(); // Convención: _ indica "privada"
    this.#secreto = "shh"; // Propiedad verdaderamente privada
  }

  // Getter: permite acceder a una propiedad como si fuera una variable
  get informacion() {
    return `${this.nombre}, ${this.edad} años`;
  }

  // Setter: permite modificar una propiedad con validación
  set edad(nuevaEdad) {
    if (nuevaEdad >= 0 && nuevaEdad <= 120) {
      this._edad = nuevaEdad;
    } else {
      console.log("Edad inválida");
    }
  }

  get edad() {
    return this._edad;
  }
}

const persona = new Persona("Ana", 25);
console.log(persona.informacion); // "Ana, 25 años"
persona.edad = 26; // Usa el setter
console.log(persona.edad); // Usa el getter
```

### Métodos Estáticos

Un método estático es un método de una clase que no necesita que crees un objeto (instancia) para poder usarlo. En lugar de pertenecer a los objetos, pertenece directamente a la clase.

```javascript
class Matematicas {
  static sumar(a, b) {
    return a + b;
  }

  static PI = 3.14159;

  static calcularAreaCirculo(radio) {
    return this.PI * radio * radio;
  }
}

// No necesitas crear una instancia
console.log(Matematicas.sumar(5, 3)); // 8
console.log(Matematicas.calcularAreaCirculo(5)); // 78.53975
```

## Los Cuatro Pilares de la POO

### 1. Encapsulamiento

Imagina que tienes un celular. Puedes hacer llamadas, enviar mensajes y tomar fotos, pero no necesitas saber cómo funciona internamente el procesador o la antena. El encapsulamiento funciona igual: oculta los detalles complicados y solo muestra lo que necesitas usar.

**En palabras simples:** "Escondo lo complicado, muestro solo lo necesario"

**Ejemplo:**

```javascript
class Celular {
  #bateria = 100; // Privado: no puedes tocarlo directamente
  #sistemaOperativo; // Privado: interno del celular

  constructor(marca, modelo) {
    this.marca = marca; // Público: puedes verlo
    this.modelo = modelo; // Público: puedes verlo
    this.#sistemaOperativo = "Android";
  }

  // Métodos públicos: los botones que puedes presionar
  hacerLlamada(numero) {
    if (this.#bateria > 5) {
      this.#bateria -= 5;
      console.log(`Llamando a ${numero}...`);
      this.#procesarLlamada(); // Método privado
    } else {
      console.log("Batería muy baja");
    }
  }

  verBateria() {
    return `Batería: ${this.#bateria}%`;
  }

  // Método privado: funciona internamente, no lo usas directamente
  #procesarLlamada() {
    console.log("Conectando con torres de señal...");
  }
}

const miCelular = new Celular("Samsung", "Galaxy");
miCelular.hacerLlamada("123-456-7890");
console.log(miCelular.verBateria());
// miCelular.#bateria = 100; // ¡Error! No puedes cambiar esto directamente
```

### 2. Herencia

Piensa en las redes sociales. Todas (Instagram, TikTok, Twitter) tienen cosas en común: puedes crear un perfil, subir contenido, seguir gente. Pero cada una tiene sus propias características especiales. La herencia funciona así: tomas lo común y añades lo específico.

**En palabras simples:** "Tomo lo que ya existe y le agrego mis propias características"

**Ejemplo:**

```javascript
// La "red social básica" - lo que todas tienen en común
class RedSocial {
  constructor(nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
    this.seguidores = 0;
    this.contenido = [];
  }

  seguir() {
    this.seguidores++;
    console.log(
      `${this.nombreUsuario} ahora tiene ${this.seguidores} seguidores`
    );
  }

  publicar(contenido) {
    this.contenido.push(contenido);
    console.log(`${this.nombreUsuario} publicó: ${contenido}`);
  }
}

// Instagram hereda de RedSocial, pero añade sus propias características
class Instagram extends RedSocial {
  constructor(nombreUsuario) {
    super(nombreUsuario); // Llama al constructor del "papá"
    this.fotos = [];
    this.stories = [];
  }

  // Método específico de Instagram
  subirFoto(foto, filtro = "normal") {
    const fotoConFiltro = `${foto} (filtro: ${filtro})`;
    this.fotos.push(fotoConFiltro);
    this.publicar(fotoConFiltro); // Usa el método del "papá"
  }

  crearStory(contenido) {
    this.stories.push(contenido);
    console.log(`Story publicado: ${contenido}`);
  }
}

// TikTok también hereda, pero tiene sus propias características
class TikTok extends RedSocial {
  constructor(nombreUsuario) {
    super(nombreUsuario);
    this.videos = [];
    this.bailes = 0;
  }

  subirVideo(descripcion, duracion) {
    const video = `${descripcion} (${duracion}s)`;
    this.videos.push(video);
    this.publicar(video);
  }

  hacerBaile() {
    this.bailes++;
    console.log(`${this.nombreUsuario} hizo un baile! Total: ${this.bailes}`);
  }
}

// Usar las clases
const miInstagram = new Instagram("@ana_fotografa");
const miTikTok = new TikTok("@carlos_baila");

miInstagram.subirFoto("Atardecer en la playa", "vintage");
miInstagram.seguir();

miTikTok.subirVideo("Baile viral", 15);
miTikTok.hacerBaile();
```

### 3. Polimorfismo

Imagina que tienes diferentes apps de música en tu celular: Spotify, Apple Music, YouTube Music. Todas tienen un botón de "play", pero cada una reproduce música de manera diferente. El polimorfismo es esto: mismo nombre de acción, diferentes formas de hacerla.

**En palabras simples:** "Mismo botón, diferente comportamiento según quién lo presione"

**Ejemplo:**

```javascript
class AppMusica {
  constructor(nombre) {
    this.nombre = nombre;
    this.cancionActual = "";
  }

  reproducir(cancion) {
    console.log("Reproduciendo música...");
  }
}

class Spotify extends AppMusica {
  reproducir(cancion) {
    this.cancionActual = cancion;
    console.log(
      `🎵 Spotify: Reproduciendo "${cancion}" con anuncios cada 3 canciones`
    );
  }
}

class AppleMusic extends AppMusica {
  reproducir(cancion) {
    this.cancionActual = cancion;
    console.log(
      `🍎 Apple Music: Reproduciendo "${cancion}" en calidad lossless`
    );
  }
}

class YouTubeMusic extends AppMusica {
  reproducir(cancion) {
    this.cancionActual = cancion;
    console.log(
      `📺 YouTube Music: Reproduciendo "${cancion}" - ¿Quieres ver el video?`
    );
  }
}

// Polimorfismo en acción: mismo método, diferentes comportamientos
const misApps = [
  new Spotify("Mi Spotify"),
  new AppleMusic("Mi Apple Music"),
  new YouTubeMusic("Mi YouTube Music"),
];

const cancionFavorita = "Shape of You - Ed Sheeran";

// El MISMO comando para todas, pero cada una actúa diferente
misApps.forEach((app) => {
  app.reproducir(cancionFavorita); // ¡Cada una lo hace a su manera!
});

// También funciona si no sabemos qué tipo de app es
function reproducirEnCualquierApp(app, cancion) {
  app.reproducir(cancion); // No importa si es Spotify, Apple Music, etc.
}

reproducirEnCualquierApp(new Spotify("Spotify Premium"), "Blinding Lights");
```

### 4. Abstracción

Cuando subes una foto a Instagram, solo presionas "subir" y listo. No necesitas saber cómo se comprime la imagen, cómo se envía al servidor, o cómo se guarda en la base de datos. La abstracción esconde toda esa complejidad y te da botones simples.

**En palabras simples:** "Te doy botones fáciles, yo me encargo de lo complicado"

**Ejemplo:**

```javascript
// Clase "abstracta" - define QUÉ se debe hacer, no CÓMO
class Dispositivo {
  constructor(marca) {
    if (this.constructor === Dispositivo) {
      throw new Error("No puedes crear un 'Dispositivo' genérico");
    }
    this.marca = marca;
    this.encendido = false;
  }

  // Método abstracto: cada dispositivo DEBE implementarlo a su manera
  encender() {
    throw new Error("Cada dispositivo debe decir cómo se enciende");
  }

  // Método concreto: todos los dispositivos pueden usarlo igual
  obtenerEstado() {
    return `${this.marca} está ${this.encendido ? "encendido" : "apagado"}`;
  }
}

class Television extends Dispositivo {
  constructor(marca, pulgadas) {
    super(marca);
    this.pulgadas = pulgadas;
    this.canal = 1;
  }

  // Implementación específica de cómo se enciende una TV
  encender() {
    this.encendido = true;
    console.log(
      `📺 TV ${this.marca} encendida - Mostrando canal ${this.canal}`
    );
  }

  cambiarCanal(nuevoCanal) {
    if (this.encendido) {
      this.canal = nuevoCanal;
      console.log(`Cambiando a canal ${nuevoCanal}`);
    }
  }
}

class Computadora extends Dispositivo {
  constructor(marca, sistemaOperativo) {
    super(marca);
    this.sistemaOperativo = sistemaOperativo;
  }

  // Implementación específica de cómo se enciende una computadora
  encender() {
    this.encendido = true;
    console.log(
      `💻 Computadora ${this.marca} iniciando ${this.sistemaOperativo}...`
    );
    console.log("Cargando escritorio...");
  }

  abrirPrograma(programa) {
    if (this.encendido) {
      console.log(`Abriendo ${programa}`);
    }
  }
}

// Uso de la abstracción
const tv = new Television("Samsung", 55);
const laptop = new Computadora("Dell", "Windows 11");

// Mismo método "encender", pero cada uno lo hace diferente
tv.encender(); // Se enciende como TV
laptop.encender(); // Se enciende como computadora

console.log(tv.obtenerEstado());
console.log(laptop.obtenerEstado());

// const dispositivo = new Dispositivo("Genérico"); // ¡Error! No se puede
```

## Ejemplo Práctico: Sistema de Videojuegos

Vamos a crear un sistema simple de videojuegos que combine todos los conceptos:

```javascript
// Clase base para todos los personajes del juego
class Personaje {
  #vida = 100; // Privado: no se puede modificar directamente

  constructor(nombre, tipo) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.nivel = 1;
    this.experiencia = 0;
  }

  // Encapsulamiento: método controlado para acceder a la vida
  obtenerVida() {
    return this.#vida;
  }

  // Método abstracto: cada tipo de personaje ataca diferente
  atacar() {
    throw new Error("Cada personaje debe implementar su propio ataque");
  }

  // Método común para todos los personajes
  recibirDanio(cantidad) {
    this.#vida = Math.max(0, this.#vida - cantidad);
    console.log(
      `${this.nombre} recibió ${cantidad} de daño. Vida: ${this.#vida}`
    );

    if (this.#vida === 0) {
      console.log(`💀 ${this.nombre} ha sido derrotado!`);
    }
  }

  ganarExperiencia(puntos) {
    this.experiencia += puntos;
    if (this.experiencia >= this.nivel * 100) {
      this.nivel++;
      this.experiencia = 0;
      this.#vida = 100; // Se recupera al subir de nivel
      console.log(`🆙 ${this.nombre} subió al nivel ${this.nivel}!`);
    }
  }
}

// Herencia: diferentes tipos de personajes
class Guerrero extends Personaje {
  constructor(nombre) {
    super(nombre, "Guerrero");
    this.fuerza = 20;
    this.armadura = 10;
  }

  // Polimorfismo: implementación específica del ataque
  atacar(objetivo) {
    const daño = this.fuerza + this.nivel * 5;
    console.log(`⚔️ ${this.nombre} ataca con espada!`);
    objetivo.recibirDanio(daño);
    return daño;
  }

  // Habilidad especial del guerrero
  defenderse() {
    console.log(`🛡️ ${this.nombre} se defiende, reduciendo el próximo daño`);
    this.armadura += 5;
  }
}

class Mago extends Personaje {
  constructor(nombre) {
    super(nombre, "Mago");
    this.mana = 50;
    this.inteligencia = 25;
  }

  // Polimorfismo: el mago ataca de forma diferente
  atacar(objetivo) {
    if (this.mana >= 10) {
      const daño = this.inteligencia + this.nivel * 3;
      this.mana -= 10;
      console.log(`🔥 ${this.nombre} lanza una bola de fuego!`);
      objetivo.recibirDanio(daño);
      return daño;
    } else {
      console.log(`${this.nombre} no tiene suficiente mana`);
      return 0;
    }
  }

  curar(objetivo) {
    if (this.mana >= 15) {
      this.mana -= 15;
      const curacion = 20 + this.nivel * 2;
      console.log(`✨ ${this.nombre} cura a ${objetivo.nombre}`);
      // Aquí simplificaremos y no implementaremos la curación completa
    }
  }
}

class Arquero extends Personaje {
  constructor(nombre) {
    super(nombre, "Arquero");
    this.precision = 18;
    this.flechas = 30;
  }

  // Polimorfismo: ataque a distancia
  atacar(objetivo) {
    if (this.flechas > 0) {
      this.flechas--;
      const daño = this.precision + this.nivel * 4;
      console.log(`🏹 ${this.nombre} dispara una flecha!`);
      objetivo.recibirDanio(daño);
      return daño;
    } else {
      console.log(`${this.nombre} no tiene flechas`);
      return 0;
    }
  }

  recargar() {
    this.flechas += 10;
    console.log(`${this.nombre} recarga flechas. Total: ${this.flechas}`);
  }
}

// Sistema de combate que usa polimorfismo
class Arena {
  constructor() {
    this.peleadores = [];
  }

  agregarPeleador(personaje) {
    this.peleadores.push(personaje);
    console.log(`${personaje.nombre} el ${personaje.tipo} entra a la arena!`);
  }

  // Polimorfismo en acción: no importa qué tipo de personaje sea
  iniciarCombate(peleador1, peleador2) {
    console.log(`\n🥊 ¡COMBATE: ${peleador1.nombre} vs ${peleador2.nombre}! 🥊\n`);

    let turno = 1;
    while (peleador1.obtenerVida() > 0 && peleador2.obtenerVida() > 0) {
      console.log(`--- Turno ${turno} ---`);

      // El atacante y defensor alternan
      const atacante = turno % 2 === 1 ? peleador1 : peleador2;
      const defensor = turno % 2 === 1 ? peleador2 : peleador1;

      // Polimorfismo: cada personaje ataca de forma diferente
      const dañoRealizado = atacante.atacar(defensor);

      if (dañoRealizado > 0) {
        atacante.ganarExperiencia(10);
      }

      turno++;

      // Pausa dramática entre turnos
      if (defensor.obtenerVida() > 0) {
        console.log(`${defensor.nombre} contraatacará...\n`);
      }
    }

    // Determinar ganador
    const ganador = peleador1.obtenerVida() > 0 ? peleador1 : peleador2;
    console.log(`🏆 ¡${ganador.nombre} gana el combate!`);
    ganador.ganarExperiencia(50);
  }
}

// ¡Vamos a jugar!
const arena = new Arena();

// Crear diferentes personajes (cada uno se comporta diferente)
const conan = new Guerrero("Conan");
const gandalf = new Mago("Gandalf");
const legolas = new Arquero("Legolas");

arena.agregarPeleador(conan);
arena.agregarPeleador(gandalf);
arena.agregarPeleador(legolas);

// Algunos combates de ejemplo
arena.iniciarCombate(conan, gandalf);

// Preparar para otro combate
console.log("\n" + "=".repeat(50));
console.log("SEGUNDO COMBATE");
console.log("=".repeat(50));

legolas.recargar(); // El arquero se prepara
arena.iniciarCombate(legolas, conan);
```

**¿Qué demuestra este ejemplo?**

**Encapsulamiento**: La vida (`#vida`) está protegida y solo se puede modificar a través de métodos controlados como `recibirDanio()`.

**Herencia**: `Guerrero`, `Mago` y `Arquero` heredan de `Personaje`, compartiendo características básicas pero añadiendo sus propias habilidades.

**Polimorfismo**: Todos tienen un método `atacar()`, pero cada uno lo hace diferente. La `Arena` puede usar cualquier personaje sin saber exactamente qué tipo es.

**Abstracción**: La clase `Personaje` define QUÉ debe hacer cada personaje (como atacar), pero no especifica CÓMO debe hacerlo - eso lo decide cada subclase.

**Salida de ejemplo:**

```
Conan el Guerrero entra a la arena!
Gandalf el Mago entra a la arena!
Legolas el Arquero entra a la arena!

🥊 ¡COMBATE: Conan vs Gandalf! 🥊

--- Turno 1 ---
⚔️ Conan ataca con espada!
Gandalf recibió 25 de daño. Vida: 75
Gandalf contraatacará...

--- Turno 2 ---
🔥 Gandalf lanza una bola de fuego!
Conan recibió 28 de daño. Vida: 72
Conan contraatacará...

... y así continúa hasta que uno gane!
```

Este ejemplo muestra cómo la POO te permite crear sistemas complejos de manera organizada, donde cada clase tiene una responsabilidad clara y todas trabajan juntas de forma natural.

## Consejos para tener buenas prácticas

1. **Empieza simple**: No trates de crear jerarquías complejas desde el principio. Comienza con clases simples y ve añadiendo complejidad gradualmente.

2. **Piensa en la vida real**: La POO trata de modelar cosas del mundo real. Si puedes explicar tu clase como "una cosa que tiene X propiedades y puede hacer Y", vas por buen camino.

3. **No abuses de la herencia**: No todo necesita heredar de algo. A veces es mejor usar composición (tener objetos dentro de otros objetos) que herencia.

4. **Usa nombres descriptivos**: `Vehiculo` es mejor que `V`, `calcularSalario()` es mejor que `calc()`.

5. **Practica**: La mejor manera de entender POO es escribiendo código, puedes empezar prácticando con cosas que conoces.

## Conclusión

La Programación Orientada a Objetos en JavaScript te permite escribir código más organizado, reutilizable y fácil de mantener. Los cuatro pilares (encapsulamiento, herencia, polimorfismo y abstracción) trabajan juntos para ayudarte a crear sistemas complejos de manera estructurada.

> Recuerda: Dominar POO lleva tiempo y práctica. No te preocupes si al principio parece abrumador. Con cada proyecto, laboratorio, o ejercicio que hagas, estos conceptos se volverán más naturales.
