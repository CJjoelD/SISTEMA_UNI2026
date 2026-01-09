const { PrismaClient } = require('@prisma/client-users');
console.log('Success loading PrismaClient');
const prisma = new PrismaClient();
console.log('Success instantiating PrismaClient');
