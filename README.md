# Proyecto FCT - Desarrollo de Aplicaciones Web Dual

## Repositorio

https://github.com/Joseevb04/fct-project

## 📝 Descripción

Este proyecto es una plataforma web integral para una empresa de maquillaje. Ofrece funcionalidades clave para gestionar citas, cursos y productos. Los usuarios pueden reservar servicios de maquillaje, inscribirse en cursos, y comprar productos. Por otro lado, los administradores pueden gestionar toda la información del sistema.

## Funcionalidades

### Para usuarios:

- Registro e inicio de sesión
- Reserva de citas de maquillaje
- Inscripción en cursos disponibles
- Compra de productos mediante carrito e historial

### Para administradores:

- Gestión de productos, cursos y categorías
- Gestión de usuarios y roles
- Visualización de facturas e historial de compras
- Aprobación y control de citas

## Tecnologías

### Frontend

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Shadcn UI](https://ui.shadcn.com/)

### Backend

- [Java 21](https://openjdk.org/projects/jdk/21/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JPA / Hibernate](https://hibernate.org/orm/)
- [OpenAPI](https://swagger.io/specification/)

### Base de Datos

- [MariaDB](https://mariadb.org/) (producción)
- [H2](https://www.h2database.com/) (testing)

### Infraestructura

- Docker
- Docker Compose

## Estructura del Proyecto

```
.
├── abstract.pdf               # Documento explicativo del proyecto
├── api-spec/                 # OpenAPI definition
│   └── openapi.yaml
├── docker-compose.yml        # Orquestación de servicios
├── fct-backend/              # Backend en Spring Boot
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── openapitools.json
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/es/jose/backend/
│       │   │   ├── annotations/
│       │   │   ├── config/
│       │   │   ├── controllers/
│       │   │   ├── exceptions/
│       │   │   ├── mappers/
│       │   │   ├── persistence/
│       │   │   ├── security/
│       │   │   ├── services/
│       │   │   ├── utils/
│       │   │   └── validation/
│       │   └── resources/
│       │       ├── certs/
│       │       ├── files/
│       │       ├── openapi/templates/
│       │       └── templates/
│       └── test/java/es/jose/backend/
├── fct-frontend/             # Frontend en React + TS
│   ├── api-spec/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       │   ├── hero/
│       │   └── portfolio/
│       ├── components/
│       │   ├── context/
│       │   ├── guards/
│       │   ├── pages/
│       │   └── ui/
│       ├── data/
│       ├── hooks/
│       ├── lib/
│       ├── schemas/
│       ├── services/
│       └── types/
```

## Instalación

### Requisitos Previos

- Docker
- Docker Compose

### Ejecución Local

Clona el proyecto y ejecuta los siguientes comandos:

```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
docker compose up -d --build
```

Una vez levantado, abre la aplicación en tu navegador:

```
http://localhost
```

Para detener la aplicación:

```bash
docker compose down
```

## API

La documentación de la API está basada en OpenAPI y se encuentra en el directorio `/api-spec/openapi.yaml`.  
Ambos proyectos (frontend y backend) la usan para generar clientes y controladores automáticamente.

## Autenticación y Seguridad

- Tokens JWT para autenticación
- Roles de usuario: `USER` y `ADMIN`
- Restricción de rutas según permisos
- Protección de endpoints con Spring Security

## Testing

- Backend: pruebas unitarias con JUnit
- Entorno de testing usando H2
- Frontend: pruebas manuales (soporte para Vitest o Cypress opcional)

## Variables de Entorno

Actualmente no se requiere un archivo `.env`. Todo está manejado por Docker Compose y las configuraciones por defecto.

## Abstract

Resumen del proyecto disponible en `abstract.pdf`.

## Autor

Jose Esteban Vásquez Barboza  
Estudiante de IU University of Applied Sciences  
https://github.com/joseevb

## Licencia

Este proyecto está licenciado bajo la MIT License.
