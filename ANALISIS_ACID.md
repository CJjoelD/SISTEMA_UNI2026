# Análisis de Propiedades ACID en la Operación de Matriculación

Este documento analiza cómo se cumplen las propiedades ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad) en el proceso de matriculación de estudiantes del Sistema de Gestión Universitaria.

## Operación Analizada: `enrollWithTransaction`

El método se encuentra en `src/student/estudiantes.service.ts` y utiliza una transacción de Prisma para asegurar la integridad de los datos.

```typescript
  async enrollWithTransaction(studentId: number, subjectId: number) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Verificar existencia del estudiante
      const student = await tx.studentProfile.findUnique({ where: { userId: studentId } });
      if (!student) throw new NotFoundException('Estudiante no encontrado');

      // 2. Verificar existencia de la materia
      const subject = await tx.subjectReference.findUnique({ where: { id: subjectId } });
      if (!subject) throw new NotFoundException('Materia no encontrada');

      // 3. Verificar si ya está matriculado
      const existing = await tx.studentSubject.findFirst({
        where: { studentProfileId: student.id, subjectId: subjectId }
      });
      if (existing) throw new BadRequestException('El estudiante ya está matriculado en esta materia');

      // 4. Crear matrícula
      const enrollment = await tx.studentSubject.create({
        data: {
          studentProfileId: student.id,
          subjectId: subjectId,
          status: 'enrolled'
        }
      });

      return enrollment;
    });
  }
```

---

### 1. Atomicidad (Atomicity)
La **Atomicidad** garantiza que todas las operaciones dentro de la transacción se completen con éxito o que ninguna se aplique.
- En este código, todas las operaciones (búsqueda de estudiante, búsqueda de materia y creación de registro) están envueltas en `this.prisma.$transaction`.
- Si cualquiera de las validaciones falla (lanza una excepción) o si ocurre un error de red al insertar, Prisma realiza un **rollback** automático. No es posible que un estudiante quede matriculado a medias o que se cree un registro sin que el estudiante exista.

### 2. Consistencia (Consistency)
La **Consistencia** asegura que la base de datos pase de un estado válido a otro estado válido, siguiendo todas las reglas de integridad.
- El código valida explícitamente que el **estudiante** y la **materia** existan antes de proceder.
- La validación de duplicados (punto 3) asegura que un estudiante no pueda matricularse dos veces en la misma materia, manteniendo la integridad del negocio académico.

### 3. Aislamiento (Isolation)
El **Aislamiento** asegura que las transacciones simultáneas no interfieran entre sí.
- Prisma y el motor de la base de datos (PostgreSQL/MySQL) manejan niveles de aislamiento para evitar "lecturas sucias" o "escrituras fantasma".
- Si dos peticiones intentan matricular al mismo estudiante al milisegundo, la base de datos serializará o gestionará el bloqueo de filas para que solo una proceda correctamente si hay restricciones de unicidad o verificaciones previas.

### 4. Durabilidad (Durability)
La **Durabilidad** garantiza que una vez que la transacción se ha confirmado (commit), los cambios persistirán incluso en caso de un fallo del sistema.
- Una vez que `this.prisma.$transaction` retorna con éxito, los datos se han escrito en el almacenamiento permanente de la base de datos (disco).
- El log de transacciones (WAL en PostgreSQL) asegura que los cambios puedan recuperarse incluso si hay un apagón inmediatamente después del commit.

---

**Conclusión:** La implementación utiliza las herramientas nativas de Prisma para garantizar que el proceso de matriculación sea robusto, confiable y seguro para el sistema académico.
