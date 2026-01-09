"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const client_users_1 = require("../src/generated/client-users");
const bcrypt = __importStar(require("bcryptjs"));
require("dotenv/config");
const prisma = new client_users_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_USERS,
});
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
});
