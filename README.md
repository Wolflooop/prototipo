<div align="center">

# Cyber-HydroVolt

### Ciberprotección inteligente para infraestructuras hidroeléctricas

**Proyecto integrador · Prototipo académico · En desarrollo**

**Universidad Tecnológica de Xicotepec de Juárez**

**Equipo: SoloChilinesTech**

</div>

---

## 1. Descripción del proyecto

**Cyber-HydroVolt** es un proyecto académico orientado al diseño y desarrollo de un prototipo de monitoreo y ciberprotección para representar el funcionamiento de una central hidroeléctrica en un entorno controlado.

La propuesta integra información operativa simulada, almacenamiento de datos, servicios de integración, análisis mediante técnicas de inteligencia artificial y controles de ciberseguridad. Su finalidad es identificar comportamientos inusuales, relacionarlos con eventos registrados y generar alertas que puedan ser revisadas por los usuarios del sistema.

El prototipo busca demostrar cómo distintas áreas tecnológicas pueden colaborar para mejorar la supervisión y el análisis de escenarios relacionados con la operación y la seguridad de una infraestructura hidroeléctrica.

> **Alcance:** Cyber-HydroVolt es un prototipo académico. Trabaja con datos simulados y no se conecta a centrales hidroeléctricas, sistemas SCADA/ICS reales ni infraestructura de terceros. No sustituye sistemas industriales de protección ni garantiza la seguridad operativa de instalaciones reales.

## 2. Problemática

Las infraestructuras hidroeléctricas dependen de tecnologías de supervisión, automatización, comunicación y adquisición de datos para representar y controlar distintos procesos operativos. En estos entornos, la información de operación y los registros relacionados con la seguridad pueden analizarse desde herramientas o fuentes diferentes.

La falta de una visión integrada puede dificultar la identificación oportuna de desviaciones, fallas y posibles eventos de ciberseguridad. Además, el volumen de información puede hacer necesario utilizar mecanismos de análisis que ayuden a reconocer patrones y priorizar situaciones que requieren revisión.

Cyber-HydroVolt plantea integrar datos operativos simulados y eventos de seguridad en un flujo común de monitoreo. Mediante el análisis de datos y técnicas de aprendizaje automático, el prototipo buscará identificar comportamientos anómalos y generar alertas para apoyar su investigación por parte de los usuarios.

## 3. Objetivo general

Diseñar, desarrollar y demostrar un prototipo académico de monitoreo y ciberprotección para una central hidroeléctrica simulada, mediante la integración de datos operativos, bases de datos, APIs, servicios tecnológicos e inteligencia artificial, incorporando controles de ciberseguridad que permitan identificar comportamientos anómalos, generar alertas y facilitar su análisis en un entorno controlado.

## 4. Objetivos específicos

- Representar mediante datos simulados algunas variables y eventos asociados con la operación de una central hidroeléctrica.
- Integrar los componentes del prototipo mediante servicios y APIs, procurando una comunicación controlada y validada.
- Almacenar y organizar la información operativa, los eventos y las alertas utilizando la estructura de bases de datos definida para el proyecto.
- Aplicar técnicas de análisis de datos y aprendizaje automático para identificar comportamientos que se aparten de los patrones esperados.
- Registrar y presentar alertas que permitan consultar el evento relacionado, su contexto y su seguimiento.
- Implementar controles de autenticación, autorización y protección de la información de acuerdo con las responsabilidades de cada tipo de usuario.
- Evaluar el funcionamiento del prototipo mediante pruebas en escenarios simulados y documentar sus resultados y limitaciones.

## 5. ¿Cómo funcionará?

El flujo general previsto para Cyber-HydroVolt es el siguiente:

1. **Generación de datos simulados.** Se producirán registros que representen variables operativas y eventos de una central hidroeléctrica, sin utilizar sensores ni instalaciones reales.
2. **Captura e integración.** Los datos se recibirán y comunicarán entre los componentes mediante los mecanismos de integración definidos para el proyecto.
3. **Almacenamiento.** La información se guardará en las bases de datos existentes del proyecto, de acuerdo con la estructura y las necesidades de cada tipo de registro.
4. **Procesamiento y análisis.** Los datos se prepararán y analizarán para reconocer tendencias, patrones y posibles desviaciones.
5. **Detección de anomalías.** Los modelos de aprendizaje automático evaluarán los registros y señalarán comportamientos que requieran atención. Una anomalía no representa por sí misma la confirmación de un ataque.
6. **Generación y seguimiento de alertas.** Los resultados relevantes podrán convertirse en alertas relacionadas con los registros o eventos correspondientes. Los usuarios autorizados podrán revisarlas, documentar observaciones y dar seguimiento.
7. **Visualización.** El dashboard presentará información operativa, resultados del análisis y alertas para facilitar la supervisión del escenario simulado.

El flujo definitivo se ajustará a los componentes que se encuentren implementados y a las decisiones técnicas acordadas por el equipo.

## 6. Componentes principales

| Componente | Función dentro del prototipo |
|---|---|
| Simulación de telemetría | Generar datos que representen variables y eventos operativos de una central hidroeléctrica. |
| Integración de datos y APIs | Comunicar los servicios y transportar información entre los componentes. |
| Almacenamiento de información | Gestionar los registros operativos, eventos y alertas utilizando las bases de datos del proyecto. |
| Análisis de datos | Preparar, organizar e interpretar la información para reconocer patrones. |
| Detección de anomalías | Aplicar modelos de aprendizaje automático para señalar comportamientos inusuales. |
| Monitoreo de ciberseguridad | Registrar y revisar eventos relevantes para la seguridad del prototipo. |
| Gestión de alertas | Consultar, investigar, documentar observaciones y dar seguimiento a las alertas. |
| Dashboard | Mostrar mediciones, eventos, resultados del análisis y estado de las alertas. |
| Seguridad de la aplicación | Proteger el acceso, las sesiones, las operaciones y la información según los permisos definidos. |

Estos componentes describen la organización funcional prevista; no implican que todas las funcionalidades estén terminadas o desplegadas.

## 7. Equipo y responsabilidades

El desarrollo de Cyber-HydroVolt se realiza de manera colaborativa. Cada integrante tiene un área principal de responsabilidad, pero la integración y validación del prototipo requieren la participación de todo el equipo.

| Integrante | Rol | Responsabilidades principales |
|---|---|---|
| **Diego Garrido Castillo** | Product Manager | Coordinar el proyecto; organizar actividades y prioridades; dar seguimiento a los avances, acuerdos y entregables; facilitar la comunicación entre las áreas y verificar la alineación con los objetivos. |
| **Jonathan Isai Leal Cruz** | Arquitecto en la nube | Diseñar y documentar la arquitectura tecnológica; evaluar los servicios de infraestructura y nube; definir criterios de despliegue, disponibilidad, configuración y comunicación entre servicios. |
| **Marianna Mayte Gutiérrez Gayosso** | Ingeniera de Integración de APIs Seguras | Diseñar e integrar APIs; coordinar el intercambio de información entre componentes; aplicar validaciones y controles de comunicación; documentar y probar las integraciones. |
| **Oliver Sánchez Arrioja** | Analista de Datos | Organizar, depurar y analizar los datos; identificar patrones y tendencias; preparar información para los modelos de análisis y para su presentación en el dashboard. |
| **Josue Oloarte Hernández** | Científico de Datos | Explorar y preparar conjuntos de datos; seleccionar, entrenar y evaluar modelos de aprendizaje automático; analizar resultados y documentar el desempeño y las limitaciones de los modelos. |
| **Jeysi Damari Lara Cruz** | Especialista en Ciberseguridad | Definir y revisar controles de seguridad; colaborar en autenticación, autorización y protección de sesiones; revisar endpoints y validación de entradas; evaluar riesgos y documentar pruebas y hallazgos de seguridad. |

### Colaboración entre las áreas

Las responsabilidades se complementan y no representan módulos aislados:

- La arquitectura en la nube y la integración de APIs deben considerar desde el diseño la protección de servicios, credenciales y comunicaciones.
- El análisis y la ciencia de datos colaboran para asegurar que la información utilizada sea consistente y que los resultados de los modelos puedan interpretarse.
- La ciberseguridad acompaña las distintas áreas mediante revisiones y controles, no solamente al final del desarrollo.
- La gestión del proyecto facilita la coordinación, el seguimiento de acuerdos y la integración de los entregables.
- Todo el equipo participa en las pruebas de integración, la documentación y la demostración del prototipo.

## 8. Usuarios y gestión de permisos

El sistema contempla una separación de responsabilidades para limitar las acciones disponibles según el tipo de usuario. La siguiente distribución es una propuesta funcional que deberá validarse y mantenerse alineada con los permisos realmente implementados.

| Perfil | Responsabilidades previstas |
|---|---|
| **Administrador** | Gestionar cuentas y roles, administrar el acceso al sistema y consultar registros generales de auditoría. |
| **Analista** | Consultar telemetría, eventos, anomalías y alertas; agregar observaciones; analizar resultados y actualizar el seguimiento de alertas conforme a sus permisos. |
| **Operador** | Supervisar el dashboard, mediciones y alertas; registrar observaciones operativas e iniciar o actualizar el seguimiento de situaciones conforme a sus permisos. |

Los permisos definitivos deben documentarse en una matriz de autorización y aplicarse en el backend. Ocultar botones o secciones en la interfaz no es suficiente para proteger una operación.

## 9. Enfoque tecnológico

El proyecto contempla las siguientes áreas y tecnologías, sujetas a la arquitectura y herramientas que el equipo confirme para la versión implementada:

- **ICS/SCADA e IoT:** conceptos de referencia para representar procesos industriales y fuentes de telemetría mediante simulación. No se conectarán sistemas industriales reales.
- **Bases de datos SQL y NoSQL:** almacenamiento y consulta de la información operativa, eventos y resultados, de acuerdo con el diseño de datos existente.
- **APIs y servicios en la nube:** integración y comunicación entre los componentes del prototipo.
- **Inteligencia artificial y aprendizaje automático:** análisis de datos y detección de comportamientos anómalos.
- **Ciberseguridad:** autenticación, autorización, validación de entradas, protección de sesiones, revisión de endpoints y registro de actividades relevantes.
- **Dashboard:** visualización de información, resultados y alertas para apoyar la supervisión.

Las tecnologías específicas, versiones y servicios utilizados deberán registrarse conforme se integren realmente al proyecto. La mención de una tecnología en esta sección no significa que ya esté implementada.

## 10. Seguridad y consideraciones de uso

Cyber-HydroVolt se desarrolla para pruebas académicas y demostraciones controladas. Por ello:

- Utiliza datos simulados y, cuando corresponda, recursos públicos cuya licencia y condiciones de uso hayan sido verificadas.
- No tiene conexión con CFE, CONAGUA, centrales hidroeléctricas reales, sistemas SCADA/ICS reales ni infraestructura de terceros.
- No contempla escaneos, pruebas de penetración ni actividades sobre sistemas externos sin autorización expresa.
- Las credenciales y secretos no deben incluirse en el código fuente ni exponerse en el frontend.
- El acceso a las funciones debe controlarse mediante autenticación y permisos verificados en el backend.
- Las entradas recibidas por los servicios deben validarse y manejarse de forma segura.
- Las alertas generadas por los modelos requieren revisión humana: pueden existir falsos positivos y falsos negativos.
- Una anomalía detectada no constituye por sí sola evidencia de un ciberataque.
- El prototipo no es un sistema industrial certificado, no sustituye controles de seguridad de instalaciones reales y no garantiza la protección operativa de infraestructura.

## 11. Alcance y limitaciones

**Incluye:**

- Simulación de variables y eventos relacionados con una central hidroeléctrica.
- Integración de componentes de software y almacenamiento de datos.
- Análisis de información y experimentación con modelos de detección de anomalías.
- Visualización de información y seguimiento de alertas.
- Aplicación y evaluación de controles de seguridad en el prototipo.
- Pruebas controladas y documentación de resultados.

**No incluye:**

- Conexión o intervención de centrales hidroeléctricas reales.
- Acceso a redes, sensores, PLC, RTU o sistemas SCADA/ICS de terceros.
- Control físico de turbinas, generadores, compuertas u otros equipos.
- Respuesta automática sobre procesos industriales reales.
- Certificación como producto de seguridad industrial.
- Garantía de detección de todos los ataques, fallas o comportamientos anómalos.

## 12. Estado del proyecto

**Cyber-HydroVolt se encuentra en desarrollo.** Las funcionalidades, integraciones y tecnologías descritas se consideran parte del alcance previsto y deberán actualizarse conforme el equipo las implemente, pruebe y valide.

Este README funciona como documento general de presentación y referencia del proyecto. La documentación técnica específica —arquitectura, estructura de datos, APIs, modelos, permisos, pruebas y despliegue— deberá mantenerse en los apartados correspondientes del repositorio.

## 13. Equipo de desarrollo

**SoloChilinesTech**

Universidad Tecnológica de Xicotepec de Juárez

- Diego Garrido Castillo
- Jonathan Isai Leal Cruz
- Marianna Mayte Gutiérrez Gayosso
- Oliver Sánchez Arrioja
- Josue Oloarte Hernández
- Jeysi Damari Lara Cruz

---

<div align="center">

**Cyber-HydroVolt · Proyecto integrador académico**

*Monitoreo, análisis y ciberseguridad para un escenario hidroeléctrico simulado.*

</div>