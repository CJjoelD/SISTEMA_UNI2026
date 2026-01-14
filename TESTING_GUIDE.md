# Guía de Pruebas y Capturas (Postman / Swagger)

Para completar tu entrega, sigue estos pasos para realizar las pruebas y generar las evidencias necesarias.

## 1. Uso de Swagger (Recomendado)

1. Inicia el proyecto con `npm run start:dev`.
2. Abre tu navegador en `http://localhost:3000/api`.
3. Verás todos los endpoints agrupados por categorías.
4. **Capturas sugeridas:**
   - Despliega la sección `Students`.
   - Captura el endpoint `GET /student/active/list` después de darle a "Try it out" y ver los resultados.
   - Captura el endpoint `GET /student/report/stats` para mostrar el reporte SQL nativo.
   - Captura el endpoint `POST /student/enroll-transaction` con un cuerpo JSON válido.

## 2. Uso de Postman

Si prefieres Postman, aquí tienes los detalles para configurar las peticiones:

### A. Listar Estudiantes Activos (Consulta Relacional)
- **Método:** `GET`
- **URL:** `http://localhost:3000/student/active/list`
- **Resultado esperado:** Un array de estudiantes con sus objetos `user` y `career` anidados.

### B. Búsqueda Avanzada (Operadores Lógicos)
- **Método:** `GET`
- **URL:** `http://localhost:3000/student/search/advanced?careerId=1&year=2024`
- **Resultado esperado:** Estudiantes activos de la carrera 1 inscritos en el año 2024.

### C. Reporte Estadístico (SQL Nativo)
- **Método:** `GET`
- **URL:** `http://localhost:3000/student/report/stats`
- **Resultado esperado:** Lista de nombres de estudiantes, carreras y conteo total de materias.

### D. Matriculación ACID (Transacción)
- **Método:** `POST`
- **URL:** `http://localhost:3000/student/enroll-transaction`
- **Body (JSON):**
  ```json
  {
    "studentId": 1,
    "subjectId": 2
  }
  ```
- **Prueba ACID:** Intenta matricular al mismo estudiante dos veces. La segunda vez debería devolver un error `400 Bad Request` explicando que ya está matriculado, demostrando que la transacción funciona y mantiene la consistencia.

## 3. Preparación del PDF ACID

1. Abre el archivo `ANALISIS_ACID.md` que he creado para ti.
2. Puedes usar el comando `Ctrl+Shift+P` en VS Code y buscar "Markdown: Export as PDF" (si tienes la extensión instalada) o simplemente copiar el contenido en Word y guardarlo como PDF.
