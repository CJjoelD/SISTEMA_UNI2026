const { PrismaClient } = require('./node_modules/@prisma/client-users');
console.log('Success loading PrismaClient');
const prisma = new PrismaClient();
console.log('Success instantiating PrismaClient');
