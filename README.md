# Sistema de Gestión Universitaria (SGU)

Este proyecto es una API REST construida con [NestJS](https://github.com/nestjs/nest) y [Prisma ORM](https://www.prisma.io/), diseñada para gestionar operaciones académicas en un entorno universitario.

## 🚀 Características Principales

- **Arquitectura Multiesquema**: Uso de múltiples esquemas de base de datos para separar responsabilidades (Academic, Profiles, Users).
- **Consultas Avanzadas**: Implementación de filtros relacionales, operadores lógicos y SQL nativo.
- **Operaciones Transaccionales (ACID)**: Garantía de integridad de datos en procesos críticos como la matriculación.
- **Documentación con Swagger**: API auto-documentada accesible desde el navegador.

## 📂 Estructura del Proyecto

- `src/academic-programs`: Gestión de carreras y programas académicos.
- `src/student`: Gestión de estudiantes y perfiles.
- `src/subject`: Catálogo de materias.
- `src/studentsubject`: Relación de matrículas entre estudiantes y materias.
- `src/prisma`: Configuración y servicios para los diferentes clientes de Prisma.

## 🛠️ Instalación y Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Crea un archivo `.env` basado en `.env.example` con las credenciales de tus bases de datos.

3. **Generar clientes de Prisma**:
   ```bash
   npx prisma generate --schema=./prisma/schema-users.prisma
   npx prisma generate --schema=./prisma/schema-profiles.prisma
   npx prisma generate --schema=./prisma/schema-academic.prisma
   ```

## 🏃 Ejecución

```bash
# Modo desarrollo
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.
La documentación Swagger se puede encontrar en `http://localhost:3000/api`.

## 📌 Endpoints Funcionales (Clase 3)

### Estudiantes (`/student`)
- `GET /student/active/list`: Lista estudiantes activos con su carrera (Consulta relacional).
- `GET /student/search/advanced?careerId=1&year=2024`: Búsqueda avanzada usando operadores lógicos (AND).
- `GET /student/report/stats`: Reporte consolidado de estudiantes y materias (SQL Nativo).
- `POST /student/enroll-transaction`: Proceso de matrícula garantizando propiedades ACID (Transacción).

## 📄 Análisis ACID

En el archivo `ANALISIS_ACID.md` se encuentra el detalle del cumplimiento de las propiedades Atocimidad, Consistencia, Aislamiento y Durabilidad en la operación de matriculación.

## 🧪 Pruebas (Postman / Swagger)

- Puedes usar la interfaz de **Swagger** directamente en `http://localhost:3000/api`.
- Se adjuntan capturas de pantalla en la carpeta `docs/screenshots` (o según lo requerido por el docente).

