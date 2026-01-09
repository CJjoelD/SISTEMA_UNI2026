// @ts-nocheck
import { PrismaClient } from '../src/generated/client-profiles';
import 'dotenv/config';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_PROFILES,
        },
    },
});

async function main() {
    console.log('🌱 Seeding Profiles DB...');

    // --- REFERENCES (Syncing data from other DBs manually for seed) ---

    // 1. User References
    const userRefs = [
        { id: 2, name: 'John Teacher', email: 'teacher@sgu.edu', roleId: 2, status: 'active' },
        { id: 3, name: 'Jane Student', email: 'student@sgu.edu', roleId: 3, status: 'active' },
    ];

    for (const ref of userRefs) {
        await prisma.userReference.upsert({
            where: { id: ref.id },
            update: {},
            create: ref
        });
    }

    // 2. Career References
    await prisma.careerReference.upsert({
        where: { id: 100 },
        update: {},
        create: {
            id: 100,
            name: 'Ingeniería de Software',
            totalCicles: 10
        }
    });

    // 3. Speciality References
    await prisma.specialityReference.upsert({
        where: { id: 50 },
        update: {},
        create: {
            id: 50,
            name: 'Desarrollo Web'
        }
    });


    // --- PROFILES ---

    // Teacher Profile
    await prisma.teacherProfile.upsert({
        where: { userId: 2 },
        update: {},
        create: {
            userId: 2,
            specialityId: 50,
            careerId: 100
        }
    });

    // Student Profile
    await prisma.studentProfile.upsert({
        where: { userId: 3 },
        update: {},
        create: {
            userId: 3,
            careerId: 100,
            currentCicle: 3
        }
    });


    console.log('✅ Profiles DB Seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
