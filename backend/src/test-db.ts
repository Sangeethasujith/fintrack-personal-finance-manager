import prisma from "./config/prisma.js";


async function testDatabase() {
  try {
    const category = await prisma.category.create({
      data: {
        name: 'Food',
        type: 'EXPENSE',
        userId: null
      }
    });

    console.log('Category created successfully:');
    console.log(category);
  } catch (error) {
    console.error('Database operation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();