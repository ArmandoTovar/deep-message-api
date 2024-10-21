# Proyecto de Mensajería con NESTJS y MongoDB

Este proyecto consiste en diseñar y desarrollar una API RESTful utilizando NESTJS y MongoDB para permitir la mensajería entre usuarios. Las funcionalidades principales incluyen el registro y login de usuarios, el envío y la recepción de mensajes, la lectura de mensajes y su marcado como leídos, y el filtrado de mensajes. Además, se han implementado pruebas unitarias para asegurar la calidad del código.

## Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
  - [Endpoints Principales](#endpoints-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Pruebas](#pruebas)
  - [Pruebas Unitarias](#pruebas-unitarias)
  - [Pruebas con Cobertura](#pruebas-con-cobertura)
  - [Pruebas de Integración](#pruebas-de-integración)

## Características

- **Login de usuario**
- **Envío de mensaje a otro usuario**
- **Lectura de mensaje y marcado como leído**
- **Filtrado de mensajes (Leídos, No leídos, destacados)**
- **Pruebas unitarias**

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto:

1. Clona el repositorio:
    ```sh
    git clone https://github.com/ArmandoTovar/deep-message-api.git
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

3. Configura las variables de entorno en un archivo `.env.dev`.

4. Inicia la aplicación en modo desarrollo:
    ```sh
    npm run start:dev
    ```

## Uso

### Endpoints Principales
- **Swagger**
  - `GET /api`: Docs.

- **AuthController**
  - `POST /auth/signup`: Registro de usuario.
  - `POST /auth/signIn`: Inicio de sesión de usuario.

- **MessageController**
  - `GET /messages`: Filtrado de mensajes.
  - `POST /messages`: Envío de mensaje.
  - `GET /messages/:id`: Lectura de mensaje.
  - `PATCH /messages/:id/status`: Marcado como leído.
  - `DELETE /messages/:id`: Eliminación de mensaje.

## Estructura del Proyecto
```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── sign-up.dto.ts
│   │   └── sign-in.dto.ts
├── messages/
│   ├── messages.controller.ts
│   ├── messages.module.ts
│   ├── messages.service.ts
│   ├── dto/
│   │   ├── create-message.dto.ts
│   │   ├── filter-messages.dto.ts
│   │   └── update-message-status.dto.ts
└── app.module.ts
```

## Pruebas

Para asegurar la calidad del código y el correcto funcionamiento de la API, se han implementado pruebas unitarias y de integración. A continuación se describen los pasos para ejecutar estas pruebas.

### Pruebas Unitarias

Las pruebas unitarias verifican el correcto funcionamiento de componentes individuales de la aplicación.

Para ejecutar las pruebas unitarias, utiliza el siguiente comando:

```sh 
npm run test
```

### Pruebas con Cobertura
Para obtener un informe de cobertura de las pruebas, utiliza el siguiente comando:

```sh
npm run test:cov
```

Este comando genera un informe detallado de la cobertura de código, mostrando qué partes del código han sido cubiertas por las pruebas.

### Pruebas de Integración
Las pruebas de integración verifican el correcto funcionamiento de la aplicación en su conjunto, simulando el comportamiento de un usuario real.

Para ejecutar las pruebas de integración, utiliza el siguiente comando:

```sh
npm run test:e2e
```