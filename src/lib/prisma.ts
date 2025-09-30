// lib/prisma.ts
// Mock Prisma client for development without database
// Replace this with actual Prisma client once database is set up

interface MockPrismaClient {
  user: {
    findUnique: (args: { where: { email: string } }) => Promise<{
      id: string;
      email: string;
      name: string | null;
      password: string;
      role: string;
    } | null>;
  };
}

const mockPrisma: MockPrismaClient = {
  user: {
    findUnique: async ({ where }) => {
      // Mock users for authentication
      const mockUsers = [
        {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          password: "admin123", // Hash of "admin123"
          role: "ADMIN",
        },
        {
          id: "2",
          email: "staff@example.com",
          name: "Staff Member",
          password: "staff123", // Hash of "staff123"
          role: "STAFF",
        },
        {
          id: "3",
          email: "student@example.com",
          name: "John Doe",
          password: "student123", // Hash of "student123"
          role: "STUDENT",
        },
      ];

      return mockUsers.find(user => user.email === where.email) || null;
    },
  },
};

export const prisma = mockPrisma;

// Uncomment below when you're ready to use actual Prisma:
/*
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
*/