---
sidebar_position: 2
sidebar_label: "Codificación, Encriptación y Hashing"
---

# Codificación, Encriptación y Hashing

Uno de los errores conceptuales más frecuentes en el desarrollo de software es utilizar indistintamente los términos *"codificar"*, *"encriptar"* y *"hashear"*. Como destaca **Laurențiu Spilcă** en sus fundamentos de Spring Security, cada uno de estos procesos responde a un propósito matemático y operacional radicalmente diferente:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/encoding-encryption-hashing-comparison.svg"
    alt="Codificación, Encriptación y Hashing"
    style={{ width: "100%", maxWidth: "960px" }}
  />
</div>

---

## 1. Codificación (Encoding) — Transformación de Formato

* **Definición:** Es la conversión de una secuencia de datos de un formato a otro para garantizar la compatibilidad, transmisión y lectura entre sistemas informáticos heterogéneos.
* **Mecanismo:** Sigue un algoritmo público y estándar. **No utiliza claves secretas**.
* **Reversibilidad:** **100% Reversible**. Cualquiera que conozca el estándar de codificación puede revertir el proceso de forma directa.
* **Nivel de Confidencialidad:** **Cero (0)**. Codificar datos no protege su secreto ni previene que un atacante los lea.
* **Ejemplos clásicos:** Base64 (empleado para transportar binarios en texto plano o encabezados HTTP Basic), URL Encoding (`%20` para espacios), ASCII, UTF-8.

```text
Texto Plano:       admin:123456
Base64 Encoded:    YWRtaW46MTIzNDU2   <-- ¡Cualquiera puede decodificarlo al instante!
```

---

## 2. Encriptación (Encryption / Cifrado) — Confidencialidad con Clave Secreta

* **Definición:** Es una transformación criptográfica que convierte un mensaje legible (*plaintext*) en un texto ininteligible (*ciphertext*), gobernada obligatoriamente por una **clave secreta (Secret Key)**.
* **Mecanismo:** Algoritmo matemático bidireccional diseñado para que únicamente quien posea la clave correspondiente pueda descifrar el mensaje.
* **Reversibilidad:** **Reversible mediante clave**. Posee dos operaciones inversas acopladas: `Encrypt(Mensaje, Clave) -> Cifrado` y `Decrypt(Cifrado, Clave) -> Mensaje`.
* **Tipos de Cifrado:**
  - **Simétrico (Clave Secreta Compartida):** Se utiliza la misma clave para cifrar y descifrar (ej. **AES-256**, ChaCha20). Altamente eficiente para cifrado en masa.
  - **Asimétrico (Clave Pública y Privada):** Se cifra con una clave pública y solo se descifra con la clave privada asociada (ej. **RSA**, Curvas Elípticas ECC). Base de los certificados TLS/HTTPS y firmas digitales.
* **Propósito:** Proteger la confidencialidad de datos en tránsito (navegación web segura HTTPS) o datos confidenciales en reposo (números de tarjeta de crédito en bases de datos).

---

## 3. Funciones Hash (Hashing) — Resumen Unidireccional e Irreversible

* **Definición:** Es una operación matemática que toma una entrada de cualquier longitud (desde una sola letra hasta un archivo de gigabytes) y genera una cadena de salida alfanumérica de **longitud fija** (*digest* o huella digital).
* **Mecanismo:** Es una **función trampa unidireccional (One-Way Function)**. Está matemáticamente diseñada para que sea computacionalmente inviable reconstruir el mensaje original a partir del hash resultante.
* **Propiedades Fundamentales:**
  1. **Determinista:** La misma entrada siempre genera exactamente el mismo hash.
  2. **Irreversible (-X-):** Dado el hash $H(x)$, no existe una fórmula matemática inversa que permita despejar $x$.
  3. **Efecto Avalancha (Avalanche Effect):** Cambiar un solo bit en la entrada produce un hash completamente irreconocible y disímil.
  4. **Resistencia a Colisiones:** Es computacionalmente inviable encontrar dos entradas distintas que arrojen el mismo hash ($H(x_1) = H(x_2)$).

:::caution[¿Por qué jamás debemos ENCRIPTAR las contraseñas en una base de datos?]
Si encriptaras las contraseñas de tus usuarios con AES o RSA, existiría una **clave de desencriptación**. Si un atacante vulnera el servidor o un administrador deshonesto accede a la clave, podría desencriptar todas las contraseñas en texto plano.

Por esta razón, las contraseñas de los usuarios **nunca se encriptan; siempre se hashean**. Cuando un usuario inicia sesión, el sistema no "desencripta" la contraseña almacenada; en su lugar, toma la contraseña que el usuario escribió en el formulario, calcula su hash y compara si coincide con el hash almacenado en la base de datos mediante `passwordEncoder.matches(raw, hash)`.
:::

---

## 4. El Rol del Salt (Salado) y Algoritmos Lentos (BCrypt)

Los atacantes utilizan bases de datos gigantescas de hashes precalculados conocidas como **Tablas Arcoíris (Rainbow Tables)** para descubrir contraseñas comunes (ej. el hash SHA-256 de `123456` siempre es conocido).

Para neutralizar esto, Spring Security utiliza **BCrypt**, el cual implementa:
1. **Salt Criptográfico Aleatorio:** Una secuencia de bytes aleatorios generada automáticamente que se concatena a la contraseña antes de aplicar el algoritmo. Esto garantiza que dos usuarios con la misma contraseña (`123456`) tengan hashes completamente diferentes en la base de datos.
2. **Factor de Costo Computacional (Work Factor):** BCrypt es un algoritmo deliberadamente lento y configurable (por defecto $2^{10} = 1024$ rondas de hashing). Esto ralentiza drásticamente los ataques de fuerza bruta basados en hardware acelerado por GPUs.

---

## Cuestionario de Autoevaluación

<Quiz id="compu2-semana9-criptografia-hashing-quiz">
  <Question title="¿Cuál de las siguientes afirmaciones describe con precisión la Codificación (Encoding) como Base64?">
    <Option>Protege la confidencialidad mediante una clave privada simétrica.</Option>
    <Option correct>Transforma el formato de los datos para garantizar su transporte, siendo 100% reversible sin necesidad de claves secretas.</Option>
    <Option>Es una función matemática unidireccional diseñada para proteger contraseñas en bases de datos.</Option>
    <Option>Evita ataques por fuerza bruta mediante la inserción de un salt criptográfico aleatorio.</Option>
  </Question>
  <Question title="¿Por qué la industria de la seguridad recomienda hashear las contraseñas en lugar de encriptarlas?">
    <Option>Porque los algoritmos de encriptación generan salidas de longitud variable que no caben en la base de datos.</Option>
    <Option>Porque los algoritmos de hashing son bidireccionales y permiten recuperar la clave al enviar un correo de restablecimiento.</Option>
    <Option correct>Porque la encriptación posee una función inversa con clave que permitiría recuperar las claves si el servidor o la llave se ven comprometidos, mientras que el hashing es irreversible por diseño.</Option>
    <Option>Porque el hashing no requiere consumo de memoria ni procesamiento en el servidor web.</Option>
  </Question>
  <Question title="¿Qué propósito cumple el Salt (salado) criptográfico en algoritmos como BCrypt?">
    <Option>Comprimir la longitud de la contraseña original para que ocupe menos espacio en disco.</Option>
    <Option>Permitir que el administrador del sistema pueda desencriptar la contraseña en caso de emergencia.</Option>
    <Option>Convertir el hash en una cadena legible en formato Base64 para el usuario final.</Option>
    <Option correct>Garantizar que contraseñas idénticas produzcan hashes completamente diferentes, invalidando ataques basados en Rainbow Tables.</Option>
  </Question>
</Quiz>
