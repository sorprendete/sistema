# Manual de Usuario: Dashboard Gerencial SmartCampus EESPP-T

Este documento constituye la guía técnica y operativa del **Dashboard Gerencial SmartCampus EESPP-T**. Su propósito es explicar el funcionamiento del modelo de datos interactivo, el sistema de filtrado cruzado y el significado estratégico de cada uno de los Indicadores Clave de Desempeño (KPI) y visualizaciones integradas.

---

## 1. Arquitectura y Sistema de Filtrado

El dashboard ha sido construido bajo un modelo de datos similar a un "Cubo en Estrella" (Star Schema) típico de herramientas de Business Intelligence como Power BI. Esto significa que todos los datos están interconectados y cualquier filtro afecta globalmente a toda la aplicación.

### Filtros Globales (Menú Lateral)
*   **Trimestre:** Permite viajar en el tiempo y aislar el rendimiento institucional a un periodo específico (Ej. *Q1 2026* o *Q3 2027*).
*   **Estado del Proyecto:** Filtra el nivel de criticidad o éxito. Opciones: *Cumplido, En proceso, Riesgo medio, Crítico*.
*   **Responsable:** Aísla el desempeño de una unidad orgánica particular (Ej. *Dirección General, Jefatura OTI, Área de Calidad, Unidad Académica, Administración*).

### Interactividad Dinámica (Cross-Filtering)
> [!TIP]
> **Filtros Cruzados mediante clics:** No estás limitado al menú lateral. Si haces clic en una barra específica de un gráfico (por ejemplo, la barra de "OETI 1.1") o en una tajada del gráfico circular de Responsables, **las 4 páginas del dashboard se recalcularán automáticamente en tiempo real** para mostrar únicamente la información relacionada con el elemento que tocaste.

---

## 2. Descripción de las 4 Vistas (Páginas)

El dashboard está dividido en cuatro dimensiones estratégicas alineadas al Plan Estratégico de Tecnología de la Información (PETI).

### Página 1: Resumen Ejecutivo
Orientada a la Dirección General para una toma de decisiones macro.

*   **KPI - Avance Global PETI:** Mide el porcentaje promedio de avance de todas las iniciativas tecnológicas y operativas activas.
*   **KPI - Incidentes TI Promedio:** Muestra la media de fallas tecnológicas reportadas en el periodo seleccionado.
*   **KPI - Proyectos Críticos:** Un contador de alerta rápida que cuantifica cuántos proyectos del portafolio se encuentran en estado de emergencia ("Crítico").
*   **Medidor (Gauge) - Cumplimiento CBC-TI:** Evalúa porcentualmente qué tan alineada está la infraestructura tecnológica con las Condiciones Básicas de Calidad exigidas por MINEDU/SINEACE.
*   **Gráficos Complementarios:** 
    *   *Estado General Proyectos (Barras):* Distribución cuantitativa de los proyectos según su nivel de salud.
    *   *Responsables (Anillo):* Gráfico interactivo para filtrar proyectos por área responsable.
    *   *Riesgo Estudiantil (Tendencia):* Evolución temporal de los casos de riesgo académico, permitiendo anticipar picos de deserción.

### Página 2: Portafolio de Proyectos TI
Diseñada para la Jefatura OTI y la administración del cambio.

*   **Gráfico - Actividades por OETI:** Gráfico de barras que detalla el nivel de avance porcentual estructurado por cada Objetivo Estratégico de TI (OETI 1.1, OETI 2.1, etc.).
*   **Gráfico - Avance por Trimestre:** Línea de tiempo que evidencia la madurez y ritmo de ejecución de los proyectos históricamente.
*   **Cronograma (Gantt):** Representación visual de las fechas de inicio y fin programadas para los proyectos estratégicos institucionales.
*   **Tabla - Estado por Proyecto:** Listado nominal de los proyectos (ej. "Despliegue de EVA en nube") acompañados de un semáforo de estado visual y su porcentaje exacto de avance.
*   **Tabla Dinámica - Responsable:** Resume estadísticamente el avance promedio consolidado de cada unidad administrativa encargada de los proyectos.

### Página 3: Servicios Digitales y EVA
Enfocada en el impacto de la tecnología en la actividad académica (Unidad Académica).

*   **KPI - Cursos Activos:** Número de espacios curriculares operando digitalmente dentro de la plataforma institucional.
*   **Medidor (Gauge) - Uso de Biblioteca Virtual:** Porcentaje de adopción y consulta recurrente de las bases de datos y libros electrónicos por parte de la comunidad.
*   **Gráfico - Trámites Digitalizados:** Cuantifica la eficiencia burocrática mediante el volumen de expedientes procesados bajo la política "Cero Papel".
*   **Gráfico - Usuarios Activos EVA:** Mide la concurrencia y constancia de estudiantes/docentes interactuando dentro del Entorno Virtual de Aprendizaje.
*   **Tabla - Alertas de Riesgo Estudiantil:** Componente de Analítica Predictiva que enlista nominalmente a los estudiantes con comportamiento anómalo (días de inactividad, bajas calificaciones) clasificando su riesgo en "Medio" o "Alto" para intervención temprana.

### Página 4: Seguridad, Soporte y Continuidad
Orientada al equipo técnico para garantizar alta disponibilidad de servicios.

*   **KPI - Tiempo Prom. Respuesta:** Mide en horas la agilidad de la mesa de ayuda (Help Desk) para resolver un ticket tecnológico.
*   **KPI - Total Backups Realizados:** Conteo de las políticas de copias de seguridad ejecutadas con éxito, asegurando la integridad de los datos.
*   **Medidor (Gauge) - Disponibilidad de Servicios (Uptime):** Porcentaje del tiempo en que los servidores y la red estuvieron operativos (la meta ideal es estar por encima del 99%).
*   **Gráfico - Incidentes de Seguridad:** Histórico de amenazas o vulnerabilidades de red detectadas/mitigadas en la arquitectura perimetral.
*   **Gráfico - Tickets Atendidos:** Carga laboral del equipo de soporte distribuida a lo largo de los trimestres.
