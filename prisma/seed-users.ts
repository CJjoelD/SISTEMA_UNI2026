// @ts-nocheck
import { PrismaClient } from '../src/generated/client-users';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_USERS,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding Users DB...');

    // 1. Roles
    const roles = [
        { id: 1, name: 'ADMIN' },
        { id: 2, name: 'TEACHER' },
        { id: 3, name: 'STUDENT' },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { id: role.id },
            update: {},
            create: role,
        });
    }

    // 2. Users
    const password = await bcrypt.hash('password123', 10);

    const users = [
        {
            id: 1,
            email: 'admin@sgu.edu',
            name: 'Admin User',
            password,
            roleId: 1,
            status: 'active',
        },
        {
            id: 2,
            email: 'teacher@sgu.edu',
            name: 'John Teacher',
            password,
            roleId: 2,
            status: 'active',
        },
        {
            id: 3,
            email: 'student@sgu.edu',
            name: 'Jane Student',
            password,
            roleId: 3,
            status: 'active',
        },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user,
        });

        // Create UserSync entry
        await prisma.userSync.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                roleId: user.roleId,
                hasTeacherProfile: user.roleId === 2,
                hasStudentProfile: user.roleId === 3,
            }
        });
    }

    console.log('✅ Users DB Seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
