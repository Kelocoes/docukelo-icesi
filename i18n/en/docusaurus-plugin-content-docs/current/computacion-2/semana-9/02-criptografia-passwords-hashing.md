---
sidebar_position: 2
sidebar_label: "Encoding, Encryption, and Hashing"
---

# Web Cryptography: Encoding, Encryption, and Hashing

One of the most frequent misconceptions in software engineering is using *"encoding"*, *"encryption"*, and *"hashing"* interchangeably. As **Laurențiu Spilcă** highlights in his Spring Security lectures, each of these processes serves a fundamentally different mathematical and operational purpose:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/encoding-encryption-hashing-comparison.svg"
    alt="Encoding, Encryption, and Hashing"
    style={{ width: "100%", maxWidth: "960px" }}
  />
</div>

---

## 1. Encoding — Format Transformation

* **Definition:** Converting data from one format to another to guarantee compatibility, reliable transmission, and readability across heterogeneous systems.
* **Mechanism:** Follows a standardized, public algorithm. **Uses no secret keys**.
* **Reversibility:** **100% Reversible**. Anyone knowing the encoding standard can reverse the data instantly.
* **Confidentiality Level:** **Zero (0)**. Encoding does not safeguard secrecy or prevent attackers from reading payloads.
* **Classic Examples:** Base64 (used for transporting binaries in plain text or HTTP Basic headers), URL Encoding (`%20` for spaces), ASCII, UTF-8.

```text
Plaintext:          admin:123456
Base64 Encoded:     YWRtaW46MTIzNDU2   <-- Anyone can decode this immediately!
```

---

## 2. Encryption — Confidentiality via Secret Key

* **Definition:** A cryptographic transformation that turns human-readable plaintext into an unintelligible ciphertext, governed strictly by a **secret key**.
* **Mechanism:** A two-way mathematical algorithm designed so that only holders of the matching key can recover the original message.
* **Reversibility:** **Reversible via key**. Features two coupled operations: `Encrypt(Message, Key) -> Ciphertext` and `Decrypt(Ciphertext, Key) -> Message`.
* **Types of Encryption:**
  - **Symmetric (Shared Secret Key):** The same key is used to both encrypt and decrypt (e.g., **AES-256**, ChaCha20). Highly performant for bulk data encryption.
  - **Asymmetric (Public and Private Keys):** Data encrypted with the public key can only be decrypted by the matching private key (e.g., **RSA**, Elliptic Curves ECC). The bedrock of TLS/HTTPS certificates and digital signatures.
* **Purpose:** Protecting confidentiality for data in transit (secure web browsing via HTTPS) or sensitive data at rest (stored credit card numbers in databases).

---

## 3. Hash Functions (Hashing) — Irreversible One-Way Digest

* **Definition:** A mathematical algorithm that takes input data of arbitrary size (from a single letter to a multi-gigabyte file) and produces an alphanumeric string of **fixed length** (*digest* or digital fingerprint).
* **Mechanism:** A **one-way trapdoor function**. Designed mathematically so that reversing the process to recover the original message from the hash is computationally infeasible.
* **Fundamental Properties:**
  1. **Deterministic:** The exact same input always yields the exact same hash output.
  2. **Irreversible (-X-):** Given hash $H(x)$, there is no mathematical inverse function to deduce $x$.
  3. **Avalanche Effect:** Altering a single bit in the input produces an entirely different, unrecognizable hash.
  4. **Collision Resistance:** Finding two distinct inputs that produce the identical hash ($H(x_1) = H(x_2)$) is computationally infeasible.

:::caution[Why Passwords in a Database Must NEVER Be Encrypted]
If you encrypt user passwords with AES or RSA, a **decryption key** exists. If an attacker breaches the application server or a malicious insider obtains that key, all user passwords can be decrypted back into plain text.

For this reason, user passwords **are never encrypted; they are always hashed**. When a user attempts to log in, the system does not "decrypt" the stored password; instead, it hashes the candidate password entered into the login form and checks whether it mathematically matches the stored hash via `passwordEncoder.matches(raw, hash)`.
:::

---

## 4. The Role of Salt and Slow Algorithms (BCrypt)

Attackers maintain vast databases of precomputed hashes known as **Rainbow Tables** to crack common passwords (e.g., the SHA-256 hash of `123456` is publicly indexed).

To neutralize this attack vector, Spring Security employs **BCrypt**, which provides:
1. **Cryptographic Random Salt:** A sequence of random bytes generated automatically and concatenated with the password before hashing. This ensures that two users with the identical password (`123456`) produce completely distinct hashes in the database.
2. **Computational Work Factor:** BCrypt is intentionally slow and tunable (defaulting to $2^{10} = 1024$ hashing iterations). This dramatically degrades brute-force attempts executed on GPU-accelerated hardware.

---

## Self-Assessment Quiz

<Quiz id="compu2-semana9-criptografia-hashing-quiz">
  <Question title="Which of the following statements accurately describes Encoding (such as Base64)?">
    <Option>It protects data confidentiality using a shared symmetric private key.</Option>
    <Option correct>It transforms data format to ensure safe transmission across heterogeneous systems, being 100% reversible without requiring secret keys.</Option>
    <Option>It is a one-way mathematical function designed to safeguard passwords in relational databases.</Option>
    <Option>It mitigates brute-force attacks through the automated injection of cryptographic salt.</Option>
  </Question>
  <Question title="Why does the security industry mandate hashing passwords instead of encrypting them?">
    <Option>Because encryption algorithms output variable-length ciphertext that does not fit into database columns.</Option>
    <Option>Because hashing algorithms are two-way, enabling easy password recovery during email resets.</Option>
    <Option correct>Because encryption possesses a key-based inverse function that could expose all passwords if the server or key is compromised, whereas hashing is irreversible by design.</Option>
    <Option>Because hashing requires zero CPU or memory consumption on the web server.</Option>
  </Question>
  <Question title="What purpose does a cryptographic Salt serve in algorithms like BCrypt?">
    <Option>It compresses the raw password length to consume less disk storage.</Option>
    <Option>It allows system administrators to decrypt passwords in case of an emergency lockout.</Option>
    <Option>It converts the hash into human-readable Base64 format for end-user display.</Option>
    <Option correct>It guarantees that identical passwords generate completely distinct hashes, invalidating precomputed Rainbow Table attacks.</Option>
  </Question>
</Quiz>

