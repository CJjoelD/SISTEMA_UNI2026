// @ts-nocheck
import { PrismaClient } from '../src/generated/client-academic';
import 'dotenv/config';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_ACADEMIC,
        },
    },
});

async function main() {
    console.log('🌱 Seeding Academic DB...');

    // 1. Cycles
    const cycle = await prisma.cycle.upsert({
        where: { year_period: { year: 2025, period: 1 } },
        update: {},
        create: {
            year: 2025,
            period: 1,
            name: '2025-1',
            startDate: new Date('2025-01-15'),
            endDate: new Date('2025-05-15'),
            isActive: true,
        },
    });

    // 2. Careers
    const career = await prisma.career.upsert({
        where: { name: 'Ingeniería de Software' },
        update: {},
        create: {
            id: 100, // Hardcoded ID for reference
            name: 'Ingeniería de Software',
            totalCicles: 10,
            durationYears: 5,
        },
    });

    // 3. Specialities
    const speciality = await prisma.speciality.upsert({
        where: { name: 'Desarrollo Web' },
        update: {},
        create: {
            id: 50, // Hardcoded ID for reference
            name: 'Desarrollo Web',
            description: 'Especialización en tecnologías web full-stack',
        },
    });

    // 4. Subjects
    const subjects = [
        {
            name: 'Programación I',
            careerId: career.id,
            cicleNumber: 1,
            cycleId: cycle.id,
        },
        {
            name: 'Base de Datos I',
            careerId: career.id,
            cicleNumber: 3,
            cycleId: cycle.id,
        },
    ];

    for (const subject of subjects) {
        // Note: Schema has @@unique([careerId, cicleNumber, name])
        // Using simple create for seed as upsert needs unique input object construction which is complex here
        const exists = await prisma.subject.findFirst({
            where: { name: subject.name, careerId: subject.careerId }
        });

        if (!exists) {
            await prisma.subject.create({ data: subject });
        }
    }

    console.log('✅ Academic DB Seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
