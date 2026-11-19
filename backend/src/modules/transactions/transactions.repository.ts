
import prisma from '../../config/prisma.js';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface CreateTransactionData {
  amount: number | string;
  type: TransactionType;
  description?: string | null;
  transactionDate: Date;
  paymentMethod?: string | null;
  categoryId: number;
}

export type UpdateTransactionData =
  Partial<CreateTransactionData>;

// Create a transaction
export const create = async (
  userId: number,
  data: CreateTransactionData
) => {
  return prisma.transaction.create({
    data: {
      userId,
      categoryId: data.categoryId,
      amount: data.amount,
      type: data.type,
      description: data.description,
      transactionDate: data.transactionDate,
      paymentMethod: data.paymentMethod
    },
    include: {
      category: true
    }
  });
};

// Get all transactions belonging to a user
export const findAll = async (userId: number) => {
  return prisma.transaction.findMany({
    where: {
      userId
    },
    include: {
      category: true
    },
    orderBy: [
      {
        transactionDate: 'desc'
      },
      {
        id: 'desc'
      }
    ]
  });
};

// Find one transaction belonging to a user
export const findById = async (
  id: number,
  userId: number
) => {
  return prisma.transaction.findFirst({
    where: {
      id,
      userId
    },
    include: {
      category: true
    }
  });
};

// Update a user's transaction
export const update = async (
  id: number,
  userId: number,
  data: UpdateTransactionData
) => {
  const result = await prisma.transaction.updateMany({
    where: {
      id,
      userId
    },
    data
  });

  if (result.count === 0) {
    return null;
  }

  return findById(id, userId);
};

// Delete a user's transaction
export const remove = async (
  id: number,
  userId: number
) => {
  const result = await prisma.transaction.deleteMany({
    where: {
      id,
      userId
    }
  });

  return result.count > 0;
};
