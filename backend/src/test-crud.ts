
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCrudOperations() {
  try {
    // 1. CREATE a test user
    const user = await prisma.user.upsert({
      where: {
        email: 'fintrack.test@example.com'
      },
      update: {},
      create: {
        name: 'FinTrack Test User',
        email: 'fintrack.test@example.com',
        passwordHash: 'TEST_HASH_NOT_FOR_LOGIN'
      }
    });

    console.log('\n1. User created/found:');
    console.log(user);

    // 2. READ default categories
    const categories = await prisma.category.findMany({
      where: {
        userId: null
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('\n2. Default categories:');
    console.log(categories);

    // 3. Find the Food expense category
    const foodCategory = await prisma.category.findFirst({
      where: {
        name: 'Food',
        type: 'EXPENSE',
        userId: null
      }
    });

    if (!foodCategory) {
      throw new Error('Food category not found. Run database seeding first.');
    }

    // 4. CREATE a test transaction (avoid duplicates)
    let transaction = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        description: 'FinTrack CRUD practice transaction'
      }
    });

    if (!transaction) {
      transaction = await prisma.transaction.create({
        data: {
          amount: '250.00',
          type: 'EXPENSE',
          description: 'FinTrack CRUD practice transaction',
          transactionDate: new Date(),
          paymentMethod: 'UPI',
          userId: user.id,
          categoryId: foodCategory.id
        }
      });
    }

    console.log('\n3. Transaction created/found:');
    console.log(transaction);

    // 5. READ transactions belonging to this user
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      include: {
        category: true
      },
      orderBy: {
        transactionDate: 'desc'
      }
    });

    console.log('\n4. User transactions:');
    console.log(transactions);

    // 6. UPDATE the test transaction
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transaction.id
      },
      data: {
        description: 'Updated FinTrack CRUD practice transaction'
      }
    });

    console.log('\n5. Updated transaction:');
    console.log(updatedTransaction);

    console.log('\nAll CRUD practice operations completed!');

  } catch (error) {
    console.error('CRUD test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCrudOperations();
