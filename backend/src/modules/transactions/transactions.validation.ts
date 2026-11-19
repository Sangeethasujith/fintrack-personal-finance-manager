
import { Request } from 'express';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionInput {
  amount: string;
  type: TransactionType;
  description: string;
  categoryId: number;
  transactionDate: Date;
  paymentMethod?: string | null;
}

export class ValidationError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function parseTransactionId(value: string): number {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new ValidationError('Invalid transaction ID.');
  }

  return id;
}

export function validateTransactionBody(
  body: Request['body'],
  partial = false
): Partial<TransactionInput> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError('Invalid request body.');
  }

  const result: Partial<TransactionInput> = {};

  if (!partial || body.amount !== undefined) {
    const amount = String(body.amount ?? '').trim();

    // Positive decimal with at most two decimal places.
    if (!/^\d+(\.\d{1,2})?$/.test(amount) ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0) {
      throw new ValidationError(
        'Amount must be greater than zero with at most two decimal places.'
      );
    }

    result.amount = amount;
  }

  if (!partial || body.type !== undefined) {
    if (!['INCOME', 'EXPENSE'].includes(body.type)) {
      throw new ValidationError(
        'Transaction type must be INCOME or EXPENSE.'
      );
    }

    result.type = body.type;
  }

  if (!partial || body.description !== undefined) {
    if (typeof body.description !== 'string' ||
        body.description.trim().length === 0 ||
        body.description.trim().length > 250) {
      throw new ValidationError(
        'Description is required and must be at most 250 characters.'
      );
    }

    result.description = body.description.trim();
  }

  if (!partial || body.categoryId !== undefined) {
    const categoryId = Number(body.categoryId);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      throw new ValidationError('A valid category is required.');
    }

    result.categoryId = categoryId;
  }

  if (!partial || body.transactionDate !== undefined) {
    if (typeof body.transactionDate !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(body.transactionDate)) {
      throw new ValidationError(
        'Transaction date must use YYYY-MM-DD format.'
      );
    }

    const [year, month, day] = body.transactionDate
      .split('-')
      .map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new ValidationError('Invalid transaction date.');
    }

    result.transactionDate = date;
  }

  if (body.paymentMethod !== undefined) {
    if (
      body.paymentMethod !== null &&
      (typeof body.paymentMethod !== 'string' ||
       body.paymentMethod.trim().length > 50)
    ) {
      throw new ValidationError('Invalid payment method.');
    }

    result.paymentMethod =
      typeof body.paymentMethod === 'string'
        ? body.paymentMethod.trim() || null
        : null;
  }

  if (partial && Object.keys(result).length === 0) {
    throw new ValidationError('Provide at least one field to update.');
  }

  return result;
}
