# AbltyCheck UAM-C: Sistema de Evaluación Continua y Crowdsourcing Académico

AbltyCheck es una plataforma integral de software diseñada para la medición, seguimiento y análisis del nivel de dominio de los estudiantes en las áreas fundamentales de la Ingeniería en Computación. El sistema implementa una arquitectura cliente-servidor basada en microservicios monolíticos, ofreciendo un entorno seguro para la generación colaborativa de reactivos (crowdsourcing) y la evaluación dinámica de competencias.



## Arquitectura y Stack Tecnológico

El proyecto está construido bajo una arquitectura Full Stack separada en dos repositorios lógicos (Monorepo), garantizando un bajo acoplamiento y alta cohesión.

### Frontend (Cliente)
* **Framework:** React 18 con TypeScript para un tipado estático estricto.
* **Build Tool:** Vite, optimizado para Hot Module Replacement (HMR) y empaquetado eficiente.
* **Visualización de Datos:** Recharts, implementado para el renderizado de gráficos polares (Radar Charts) que mapean el progreso multidimensional del usuario.
* **Cliente HTTP:** Axios, configurado con interceptores para el manejo automático de tokens JWT.

### Backend (API RESTful)
* **Framework:** Java 17 con Spring Boot 3.x.
* **Seguridad:** Spring Security con autenticación Stateless basada en JSON Web Tokens (JWT) y políticas estrictas de CORS.
* **Patrón de Diseño:** MVC (Model-View-Controller) extendido con capas de Servicio (Lógica de Negocio) y Repositorio (Acceso a Datos).

### Persistencia de Datos
* **Base de Datos:** Google Cloud Firestore (Firebase). Sistema NoSQL orientado a documentos, altamente escalable y asíncrono, operado mediante llamadas `ApiFuture`.

---

## Estructura del Proyecto

El repositorio principal contiene dos directorios fundamentales:

```text
AbltyCheck_UAM_C/
├── backend/                  # Código fuente de la API REST en Spring Boot
│   ├── src/main/java/        # Controladores, Entidades, DTOs, Servicios y Configuración de Seguridad
│   └── pom.xml               # Dependencias de Maven
├── frontend/abltycheck_uamc/ # Código fuente de la Interfaz de Usuario (SPA)
│   ├── src/                  # Componentes, Páginas, Hooks y Configuración de Axios
│   ├── package.json          # Dependencias de Node.js
│   └── vite.config.ts        # Configuración del servidor de desarrollo
└── README.md                 # Documentación técnica

Prerrequisitos del Sistema

Para ejecutar este proyecto en un entorno de desarrollo local (probado en distribuciones Linux de la familia Red Hat/Fedora y Arch), es necesario contar con las siguientes herramientas instaladas:

    Java Development Kit (JDK): Versión 17 o superior.

    Node.js: Versión 18.x o superior junto con el gestor de paquetes npm.

    Apache Maven: Versión 3.8 o superior (o utilizar el wrapper ./mvnw incluido).

    Credenciales de Firebase: El archivo serviceAccountKey.json proporcionado por el administrador del proyecto de Google Cloud.

Guía de Configuración y Despliegue Local

Siga estos pasos estrictamente para garantizar la correcta comunicación entre los nodos de la aplicación.
Fase 1: Configuración del Entorno y Credenciales

    Solicite el archivo de credenciales de Firebase (serviceAccountKey.json) al administrador de la base de datos.

    Coloque este archivo en el directorio raíz del backend o en la ruta especificada dentro del archivo application.properties de Spring Boot.

    Asegúrese de que las variables de entorno para el emisor de JWT (Secret Key) estén correctamente configuradas en el entorno del backend.

Fase 2: Despliegue del Backend (Servidor Java)

Abra una terminal y ejecute los siguientes comandos:
Bash

# Navegar al directorio del servidor
cd backend

# Limpiar compilaciones previas e instalar dependencias (opcional pero recomendado)
./mvnw clean install

# Levantar la aplicación Spring Boot
./mvnw spring-boot:run

El servidor inicializará el contexto de Spring, configurará los filtros de seguridad y se conectará a Firestore. Estará escuchando peticiones en http://localhost:8080.
Fase 3: Despliegue del Frontend (Cliente React)

Abra una nueva instancia de terminal (manteniendo el backend en ejecución) y proceda con los siguientes comandos:
Bash

# Navegar al directorio de la aplicación cliente
cd frontend/abltycheck_uamc

# Instalar el árbol de dependencias de Node
npm install

# Iniciar el servidor de desarrollo de Vite
npm run dev

La aplicación cliente estará expuesta por defecto en http://localhost:5173.

Nota: Asegúrese de que el archivo .env del frontend (si aplica) contenga la variable VITE_API_URL apuntando al puerto 8080 del backend.
Flujo Operativo y Módulos Principales

    Autenticación: El sistema restringe el acceso mediante filtros JWT. Todo usuario debe autenticarse para recibir un Bearer Token, el cual será almacenado localmente y anexado a las cabeceras Authorization de peticiones subsecuentes.

    Crowdsourcing (Reactivos): Los usuarios pueden proponer estructuras JSON que contienen reactivos, opciones y respuestas correctas, categorizadas por Área Académica y Dificultad. Estas propuestas ingresan con un estado PENDIENTE.

    Moderación Administrativa: Los administradores evalúan las propuestas y mutan su estado a APROBADA a través del endpoint correspondiente, haciéndolas públicas en la biblioteca.

    Motor de Evaluación: El sistema procesa las respuestas del cliente, contrastando IDs de reactivos con la estructura documental de Firestore para calcular el rendimiento absoluto.

    Dashboard Analítico: El módulo de historial consume los resultados agregados y renderiza una proyección multidimensional del usuario, identificando fortalezas y áreas de oportunidad técnica.

Notas de Seguridad

El directorio node_modules y archivos sensibles como .env o credenciales .json se encuentran excluidos del control de versiones mediante configuraciones estrictas en el archivo .gitignore raíz para prevenir vulnerabilidades.
