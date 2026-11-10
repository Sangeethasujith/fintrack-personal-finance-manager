
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  // Expense categories
  { name: 'Food', type: 'EXPENSE' },
  { name: 'Groceries', type: 'EXPENSE' },
  { name: 'Shopping', type: 'EXPENSE' },
  { name: 'Transport', type: 'EXPENSE' },
  { name: 'Rent', type: 'EXPENSE' },
  { name: 'Entertainment', type: 'EXPENSE' },
  { name: 'Healthcare', type: 'EXPENSE' },
  { name: 'Travel', type: 'EXPENSE' },

  // Income categories
  { name: 'Salary', type: 'INCOME' },
  { name: 'Freelance', type: 'INCOME' },
  { name: 'Business', type: 'INCOME' },
  { name: 'Other Income', type: 'INCOME' }
] as const;

async function main() {
  for (const category of defaultCategories) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: category.name,
        type: category.type,
        userId: null
      }
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: {
          name: category.name,
          type: category.type,
          userId: null
        }
      });

      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
  }

  console.log('Default categories seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
