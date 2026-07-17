---
sidebar_position: 3
---

# IAG en el Trabajo

La Inteligencia Artificial Generativa (IAG) ha redefinido la productividad en entornos de oficina. Esta sección contiene **20 actividades de simulación práctica** diseñadas para personal administrativo. 

Para realizar cada simulación, descarga los recursos de apoyo adjuntos y utiliza los **prompts avanzados** provistos en tu agente de chat de IA preferido (ChatGPT, Gemini o Claude).

---

## 1. Minuta Automática de Reuniones
* **Objetivo**: Extraer compromisos, fechas límite y responsables a partir de la transcripción de una reunión de equipo.
* **Recurso de apoyo**: [Descargar transcripcion_reunion.txt](/files/iag-en-el-trabajo/transcripcion_reunion.txt)
* **Prompt**:
  ```text
  Actúa como un asistente administrativo experto. Analiza la siguiente transcripción de una reunión. Tu tarea es extraer de forma estructurada:
  1. Los temas principales discutidos.
  2. Un listado detallado de tareas asignadas con su respectivo responsable y fecha límite de entrega (si se menciona).
  3. Próximas reuniones o sesiones programadas.
  
  Presenta la información de forma limpia usando tablas para las tareas asignadas.
  ```

---

## 2. Análisis de Comentarios de Clientes
* **Objetivo**: Evaluar opiniones de clientes para clasificar la urgencia y el sentimiento de soporte.
* **Recurso de apoyo**: [Descargar comentarios_clientes.csv](/files/iag-en-el-trabajo/comentarios_clientes.csv)
* **Prompt**:
  ```text
  Actúa como Analista de Servicio al Cliente. Analiza el archivo CSV adjunto (que contiene comentarios de soporte técnico, felicitaciones y quejas de facturación). 
  Para cada registro, proporciona:
  - Sentimiento dominante (Positivo, Neutro o Negativo).
  - Nivel de Urgencia (Baja, Media o Alta).
  - Una sugerencia breve de respuesta para los casos negativos o urgentes.
  
  Devuelve el resultado en formato de tabla para cargarlo de nuevo a nuestra base de datos.
  ```

---

## 3. Consolidación y Fórmulas Excel
* **Objetivo**: Resolver comisiones de ventas y calcular porcentajes de cumplimiento de metas mensuales.
* **Recurso de apoyo**: [Descargar comisiones_ventas.csv](/files/iag-en-el-trabajo/comisiones_ventas.csv)
* **Prompt**:
  ```text
  Necesito calcular la comisión para el equipo de ventas. Si las ventas superan la meta establecida (100% o más), el vendedor recibe una comisión del 5% sobre sus ventas. Si no la superan, la comisión es del 2%.
  Con base en el archivo CSV adjunto, indícame:
  1. La fórmula de Excel (usando la función SI/IF) exacta para calcular esta comisión paso a paso.
  2. El resultado del cálculo del valor de la comisión en USD para cada uno de los vendedores listados.
  ```

---

## 4. Extracción de Información de un Audio (Podcast)
* **Objetivo**: Redactar un resumen ejecutivo y los puntos clave a partir de un archivo de audio o podcast institucional.
* **Recurso de apoyo**: [Descargar podcast_administrativo.mp3](/files/iag-en-el-trabajo/podcast_administrativo.mp3)
* **Prompt**:
  ```text
  Te he proporcionado el archivo de audio de nuestro podcast corporativo (o su transcripción).
  Por favor, realiza un resumen estructurado que responda a:
  - ¿Cuál es el tema principal tratado en el podcast?
  - ¿Qué herramientas específicas de inteligencia artificial se sugieren para optimizar procesos?
  - Cuatro consejos de aplicación inmediata para el personal de oficina según el expositor.
  ```

---

## 5. Borrador de Acuerdo de Confidencialidad (NDA)
* **Objetivo**: Generar un contrato tipo de confidencialidad listo para revisión del área legal.
* **Recurso de apoyo**: [Descargar plantilla_contrato.docx](/files/iag-en-el-trabajo/plantilla_contrato.docx)
* **Prompt**:
  ```text
  Actúa como Asesor Legal Corporativo. Utiliza el borrador del documento adjunto y complétalo redactando las siguientes cláusulas formales estándar:
  1. Definición de Información Confidencial.
  2. Excepciones a la confidencialidad (ej. información pública).
  3. Duración del acuerdo y penalidades en caso de incumplimiento.
  
  Mantén un lenguaje técnico-jurídico riguroso y en español.
  ```

---

## 6. Prototipo de Cuadro de Mando (HTML/CSS)
* **Objetivo**: Diseñar una interfaz web interna para visualizar métricas clave del equipo administrativo.
* **Recurso de apoyo**: [Descargar plantilla_dashboard.html](/files/iag-en-el-trabajo/plantilla_dashboard.html)
* **Prompt**:
  ```text
  Actúa como Desarrollador Front-end. Toma la plantilla HTML proporcionada y expande el código agregando estilos CSS modernos y limpios.
  Crea tres tarjetas adicionales ("KPI Cards") para mostrar:
  1. Tasa de Resolución de Soporte (94%).
  2. Facturas Pendientes (14).
  3. Tiempo de Respuesta Promedio (1.5 horas).
  
  Usa un diseño responsivo con caja de cuadrícula (CSS Grid), bordes redondeados y una paleta de colores corporativa (tonos gris oscuro y azul). Devuelve el código completo en un bloque copiable.
  ```

---

## 7. Conciliación de Facturas
* **Objetivo**: Encontrar errores o discrepancias en cobros a clientes y registrar deudas pendientes.
* **Recurso de apoyo**: [Descargar facturas_vs_pagos.csv](/files/iag-en-el-trabajo/facturas_vs_pagos.csv)
* **Prompt**:
  ```text
  Como Contador Administrativo, analiza los montos facturados frente a los pagados en el archivo CSV adjunto.
  1. Identifica qué clientes tienen saldos pendientes (diferencia negativa) o cobros en exceso (diferencia positiva).
  2. Redacta una propuesta de correo electrónico de cobro amigable pero formal dirigida al cliente que tenga la mayor diferencia de pago pendiente.
  ```

---

## 8. Depuración de Direcciones Postales (Excel/CSV)
* **Objetivo**: Normalizar direcciones escritas de forma inconsistente por distintos usuarios.
* **Recurso de apoyo**: [Descargar direcciones_sucias.csv](/files/iag-en-el-trabajo/direcciones_sucias.csv)
* **Prompt**:
  ```text
  Tengo una base de datos con direcciones postales que se ingresaron manualmente con abreviaturas diferentes e inconsistentes (por ejemplo: 'Calle 10', 'cll 10', 'av. 6', 'Avenida 6').
  Analiza el CSV adjunto y:
  1. Escribe una tabla limpia estandarizando las abreviaturas (ej. usar siempre 'Calle' y 'Avenida').
  2. Explica paso a paso qué funciones de texto en Excel (como ESPACIOS, SUSTITUIR, NOMPROPIO) servirían para automatizar esta limpieza en el futuro.
  ```

---

## 9. Redacción de Correos de Cobranza Escalada
* **Objetivo**: Crear plantillas de correo electrónico de cobro para clientes morosos con tonos progresivos.
* **Prompt**:
  ```text
  Redacta una serie de tres plantillas de correo electrónico de cobranza para un cliente que no ha pagado su factura pendiente. Los tonos deben ser escalonados:
  - Correo 1: Recordatorio amistoso (3 días de retraso).
  - Correo 2: Recordatorio formal exigiendo el pago (15 días de retraso).
  - Correo 3: Notificación de suspensión de servicios (30 días de retraso y última advertencia).
  
  Deja marcadores de posición claros como [Nombre del Cliente] y [Monto] para poder personalizarlos fácilmente.
  ```

---

## 10. Planificación de Itinerario Corporativo
* **Objetivo**: Planificar la agenda detallada de viaje y logística para un directivo.
* **Prompt**:
  ```text
  Actúa como Asistente Ejecutivo. Diseña un itinerario de viaje de negocios de 3 días para un directivo que asiste a una feria tecnológica en Bogotá.
  La agenda debe contemplar:
  - Vuelos de ida y vuelta.
  - Tiempos de traslado y registro en el hotel.
  - Espacio para almuerzos con clientes e hitos de la feria.
  - Bloques de tiempo libre para responder correos urgentes.
  
  Presenta el itinerario en una tabla organizada por hora, actividad y ubicación.
  ```

---

## 11. Respuestas a Preguntas Frecuentes (FAQs)
* **Objetivo**: Redactar una sección de preguntas frecuentes a partir de un texto largo o manual técnico de producto.
* **Prompt**:
  ```text
  Con base en el siguiente manual de políticas de viáticos de la empresa:
  ---
  "Los viáticos diarios para alimentación tienen un tope de $50 USD dentro del país y $100 USD en el extranjero. Todo gasto debe ser respaldado por factura electrónica legal a nombre de la empresa. No se reembolsará el consumo de bebidas alcohólicas ni gastos de entretenimiento personal. Las solicitudes de reembolso deben radicarse a través del portal interno antes de los 5 días hábiles posteriores al fin del viaje corporativo."
  ---
  Redacta una guía de Preguntas Frecuentes (FAQ) de 5 puntos clave orientada a los empleados, escrita en un tono claro, directo y con viñetas amigables.
  ```

---

## 12. Plan de Onboarding de Nuevos Empleados
* **Objetivo**: Estructurar la inducción y metas para un nuevo asistente administrativo.
* **Prompt**:
  ```text
  Actúa como Especialista en Recursos Humanos. Elabora un plan de inducción de personal (onboarding) estructurado bajo la metodología 30-60-90 días para un nuevo Asistente de Operaciones.
  Define:
  - Metas de aprendizaje para el primer mes.
  - Tareas de ejecución independiente para el segundo mes.
  - Proyectos de mejora de procesos sugeridos para el tercer mes.
  ```

---

## 13. Scripts de Visualización de Datos (Python/Pandas)
* **Objetivo**: Escribir un script ejecutable para graficar las ventas anuales consolidadas en Excel.
* **Recurso de apoyo**: [Descargar ventas_graficos.py](/files/iag-en-el-trabajo/ventas_graficos.py)
* **Prompt**:
  ```text
  Actúa como Analista de Datos. Revisa el script básico de Python adjunto y:
  1. Modifícalo para que en lugar de usar datos quemados ("hardcoded"), lea directamente los datos de ventas de un archivo Excel llamado 'ventas_anuales.xlsx' con las columnas 'Vendedor' y 'Ventas'.
  2. Configura el gráfico de barras para que muestre etiquetas de valor sobre cada barra, use un tema de color moderno y guarde la imagen en alta definición (PNG a 300 DPI).
  ```

---

## 14. Manual de Procedimiento Operativo Estándar (SOP)
* **Objetivo**: Formalizar paso a paso el protocolo administrativo para procesar compras corporativas.
* **Prompt**:
  ```text
  Actúa como Consultor de Procesos de Oficina. Redacta un Manual de Procedimiento Estándar (SOP) detallado para la 'Aprobación y Pago de Facturas de Proveedores'.
  El documento debe estructurarse en:
  1. Propósito y Alcance.
  2. Diagrama de flujo escrito paso a paso (desde la radicación, revisión por contabilidad, aprobación de gerencia hasta la transferencia bancaria).
  3. Acciones a tomar en caso de que la factura presente discrepancias de cobro.
  ```

---

## 15. Agenda y Planificación de Evento Corporativo
* **Objetivo**: Estructurar las actividades e invitaciones para la asamblea anual del equipo de operaciones.
* **Prompt**:
  ```text
  Diseña la planificación logística para un evento de fin de año presencial de 80 empleados. Tu propuesta debe incluir:
  1. El cronograma completo de actividades de la jornada (de 08:00 AM a 05:00 PM).
  2. Una lista de verificación de los proveedores a contratar (catering, sonido, transporte).
  3. El borrador del correo de invitación para enviar a todo el equipo, motivando su participación.
  ```

---

## 16. Adaptación de Contenidos para Redes Sociales
* **Objetivo**: Convertir un comunicado de prensa de la compañía en publicaciones adaptadas a canales profesionales.
* **Prompt**:
  ```text
  Toma el siguiente anuncio corporativo:
  ---
  "Nuestra compañía ha logrado reducir sus emisiones de carbono de oficina en un 35% durante el último año gracias a la digitalización completa del archivo de facturas y la implementación de políticas de teletrabajo híbrido 3 días a la semana."
  ---
  Redacta:
  - Una publicación profesional y detallada para LinkedIn (incluyendo hashtags adecuados).
  - Un tweet corto y de alto impacto para X (Twitter).
  - Un mensaje breve para el canal de comunicación interna de Slack.
  ```

---

## 17. Traducción y Adaptación de Boletines
* **Objetivo**: Traducir un comunicado oficial al inglés, asegurando la correspondencia del tono de etiqueta de negocios.
* **Prompt**:
  ```text
  Traduce al inglés el siguiente comunicado interno manteniendo un tono formal, claro y corporativo:
  ---
  "Estimado equipo, les recordamos que el plazo límite para cargar los comprobantes de gastos de viaje del segundo trimestre vence este viernes a las 17:00 horas. Las solicitudes extemporáneas no serán procesadas por el área contable sin la debida autorización de su director de departamento."
  ---
  ```

---

## 18. Estructura de Formulario de Solicitud de Vacaciones
* **Objetivo**: Diseñar los campos y la lógica de validación necesarios para un formulario digital de ausencias.
* **Prompt**:
  ```text
  Actúa como Diseñador de Experiencia de Usuario (UX) en Sistemas de Información.
  Diseña la estructura de datos y campos requeridos para crear un formulario digital de 'Solicitud de Vacaciones y Licencias' en nuestra intranet.
  Indica:
  1. Los campos obligatorios que debe rellenar el empleado.
  2. Las validaciones lógicas que el sistema debe hacer (ej. fecha de fin posterior a fecha de inicio, alerta de días disponibles insuficientes).
  3. El flujo de aprobación (empleado -> jefe inmediato -> recursos humanos).
  ```

---

## 19. Cálculo de Proyecciones de Presupuesto
* **Objetivo**: Modelar y asignar porcentajes de distribución de presupuesto por departamentos administrativos.
* **Prompt**:
  ```text
  Tengo un presupuesto anual de $120,000 USD para gastos administrativos generales de la oficina.
  Ayúdame a proyectar y distribuir este presupuesto por departamentos bajo la siguiente regla:
  - Recursos Humanos: 25%
  - Soporte de TI y Licencias: 35%
  - Suministros y Logística: 20%
  - Fondo de Reserva/Emergencia: El restante
  
  Crea una tabla que muestre la distribución en porcentaje y el valor exacto en USD asignado a cada departamento, junto con un breve análisis del impacto si TI requiere un incremento del 5% adicional.
  ```

---

## 20. Análisis y Preselección de Hojas de Vida (CVs)
* **Objetivo**: Contrastar perfiles de candidatos con la descripción de cargo de una vacante administrativa.
* **Prompt**:
  ```text
  Actúa como Reclutador de Recursos Humanos. Analiza la siguiente descripción de vacante:
  - Cargo: Asistente Administrativo Bilingüe.
  - Requisitos: Experiencia de 2 años, manejo de Excel intermedio, inglés fluido B2, experiencia en facturación.
  
  Ahora, evalúa conceptualmente este candidato:
  "Laura Silva, graduada en administración. 3 años de experiencia en servicio al cliente y conciliaciones de cuentas en su anterior empleo. Certificación de inglés B2. Manejo básico de bases de datos."
  
  Realiza un análisis objetivo de fortalezas y brechas del candidato frente a la vacante y determina si es apta para pasar a la fase de entrevistas.
  ```
