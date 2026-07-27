---
sidebar_position: 1
---

# Protocols and Web Servers

### TCP Protocol

As discussed in previous courses, **protocols are sets of rules that enable communication between devices on a network**. Each protocol has specific characteristics and is used according to the needs of the application.

In particular, the **TCP protocol** is known as the *reliable messenger of the Internet*. When data is sent via TCP, this protocol guarantees that **all information arrives complete, error-free, and in the correct order**.  
You could imagine it as a courier service that requires delivery confirmation: if any packet is lost or arrives damaged, **TCP requests it again until everything is correct**.

For this reason, TCP is fundamental in applications where **data integrity is essential**, such as *web pages*, *emails*, and *file transfers*.

<img src="/img/computacion-2/TCP.webp" alt="TCP Protocol" width="800" />

#### Three-Way Handshake

Before sending data, TCP uses a process called **Three-Way Handshake** to establish a reliable connection between two devices. This process consists of three steps:

1. **SYN:** The client sends a SYN message to the server to request a connection.
2. **SYN-ACK:** The server responds with a SYN-ACK message, confirming receipt and accepting the connection.
3. **ACK:** The client sends an ACK message to confirm the server's response.

Once these steps are completed, the connection is ready and both devices can exchange data safely and orderly.

### UDP Protocol

On the other hand, we have **UDP**, which is much more relaxed regarding data assurance. In this protocol **there is no delivery verification**: data is sent without worrying whether it arrived or not. 

UDP is **faster** than TCP because it does not have to verify every packet, but this means **data packets may be lost along the way**. 

This protocol is mainly used in applications where **speed is more important than precision**, such as:
- *Video calls*
- *Online gaming* 
- *Content streaming*

If a packet is lost during transmission, communication continues without interruption.

<img src="/img/computacion-2/TCP_UDP.jpg" alt="UDP Protocol" width="800" />

## Web Servers

### HTTP Protocol

Now, considering the TCP protocol, we can talk about HTTP servers. Based on the TCP protocol, HTTP (Hypertext Transfer Protocol) was created, which is what browsers use to communicate with web servers. When you type an address into your browser, it sends a request to the HTTP server, which responds by sending the necessary files for you to see the page.

HTTP protocols consist of different parts, presented below:
- **HTTP Method**: Indicates the action to perform, such as `GET` (to fetch data) or `POST` (to send data to the server).
- **URL**: The address of the requested resource.
- **Protocol Version**: Indicates the version of HTTP being used, such as `HTTP/1.1`.
- **Headers**: Additional information about the request, such as accepted content type or cookies.
- **Request Body**: Contains data sent to the server, if necessary (for example, in a `POST` request).

<img src="/img/computacion-2/HTTP_protocol.png" alt="HTTP Protocol" width="500" />

---

## Self-Assessment Quiz

<Quiz id="comp2-protocolos-servidores-quiz">
  <Question title="Why is the TCP protocol known as the 'reliable messenger of the Internet'?">
    <Option>Because it transmits data at maximum speed without verifying errors.</Option>
    <Option correct>Because it guarantees that all information arrives complete, error-free, and in the correct order.</Option>
    <Option>Because it encrypts all packets using mandatory SSL certificates.</Option>
    <Option>Because it operates independently without requiring IP addresses.</Option>
  </Question>
  <Question title="What happens in TCP if a data packet is lost or damaged during transmission?">
    <Option>Communication is interrupted and the session is permanently closed.</Option>
    <Option>The server ignores the packet and continues to the next without re-requesting.</Option>
    <Option correct>TCP requests it again from the sender until everything is correct.</Option>
    <Option>The browser automatically converts the damaged packet to UDP format.</Option>
  </Question>
  <Question title="What is the correct sequence of messages in the TCP Three-Way Handshake process?">
    <Option>ACK -&gt; SYN -&gt; SYN-ACK</Option>
    <Option correct>SYN -&gt; SYN-ACK -&gt; ACK</Option>
    <Option>CONNECT -&gt; ACCEPT -&gt; OK</Option>
    <Option>SYN -&gt; FIN -&gt; ACK</Option>
  </Question>
  <Question title="Which message does the server send in response to the client's initial SYN request?">
    <Option>ACK</Option>
    <Option>FIN-ACK</Option>
    <Option correct>SYN-ACK</Option>
    <Option>RESET</Option>
  </Question>
  <Question title="What is the main characteristic of the UDP protocol compared to TCP?">
    <Option>It guarantees no packet loss during streaming.</Option>
    <Option correct>It does not perform delivery verification or acknowledgments, prioritizing speed.</Option>
    <Option>It is slower but offers higher integrity in file transfers.</Option>
    <Option>It requires a prior three-way connection handshake.</Option>
  </Question>
  <Question title="In which type of applications is it ideal to use UDP according to the reading?">
    <Option>Bank file transfers and emails.</Option>
    <Option>Transactional databases and static HTML files.</Option>
    <Option correct>Video calls, online gaming, and content streaming.</Option>
    <Option>Source code compilation and OS patches.</Option>
  </Question>
  <Question title="Which application layer protocol do browsers use to request and receive web pages over TCP?">
    <Option>UDP</Option>
    <Option>FTP</Option>
    <Option correct>HTTP (Hypertext Transfer Protocol)</Option>
    <Option>DNS</Option>
  </Question>
  <Question title="Which HTTP method is primarily used to request or retrieve a resource from a web server?">
    <Option>POST</Option>
    <Option correct>GET</Option>
    <Option>DELETE</Option>
    <Option>UPDATE</Option>
  </Question>
  <Question title="Which section of an HTTP request contains additional information such as accepted content types or cookies?">
    <Option>The HTTP method.</Option>
    <Option>The request body.</Option>
    <Option correct>The Headers.</Option>
    <Option>The TCP protocol version.</Option>
  </Question>
  <Question title="Which of the following statements is correct regarding the HTTP protocol?">
    <Option>It does not require an underlying transport protocol to function.</Option>
    <Option correct>It relies on the reliable transport infrastructure of the TCP protocol.</Option>
    <Option>It can only run if a type 1 hypervisor is installed on the host.</Option>
    <Option>It sends all data without specifying the requested resource URL.</Option>
  </Question>
</Quiz>
