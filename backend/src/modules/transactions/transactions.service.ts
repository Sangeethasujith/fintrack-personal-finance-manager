
import prisma from '../../config/prisma.js';
import * as repository from './transactions.repository.js';

import {
  TransactionInput,
  ValidationError
} from './transactions.validation.js';

export class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

async function validateCategory(
  categoryId: number,
  userId: number,
  transactionType?: string
): Promise<void> {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [
        { userId: null },
        { userId }
      ]
    }
  });

  if (!category) {
    throw new ValidationError(
      'Category does not exist or is not accessible.'
    );
  }

  if (
    transactionType &&
    category.type !== transactionType
  ) {
    throw new ValidationError(
      'Category type must match transaction type.'
    );
  }
}

export async function create(
  userId: number,
  data: TransactionInput
) {
  await validateCategory(
    data.categoryId,
    userId,
    data.type
  );

  return repository.create(userId, data);
}

export async function getAll(userId: number) {
  return repository.findAll(userId);
}

export async function getById(
  id: number,
  userId: number
) {
  const transaction = await repository.findById(id, userId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found.');
  }

  return transaction;
}

export async function update(
  id: number,
  userId: number,
  data: Partial<TransactionInput>
) {
  const existing = await repository.findById(id, userId);

  if (!existing) {
    throw new NotFoundError('Transaction not found.');
  }

  const nextCategoryId = data.categoryId ?? existing.categoryId;
  const nextType = data.type ?? existing.type;

  if (
    data.categoryId !== undefined ||
    data.type !== undefined
  ) {
    await validateCategory(
      nextCategoryId,
      userId,
      nextType
    );
  }

  const updated = await repository.update(id, userId, data);

  if (!updated) {
    throw new NotFoundError('Transaction not found.');
  }

  return updated;
}

export async function remove(
  id: number,
  userId: number
) {
  const deleted = await repository.remove(id, userId);

  if (!deleted) {
    throw new NotFoundError('Transaction not found.');
  }

  return true;
}
