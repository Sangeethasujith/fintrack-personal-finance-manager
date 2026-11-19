
import { Request, Response } from 'express';
import * as transactionService from './transactions.service.js';

import {
  parseTransactionId,
  validateTransactionBody,
  ValidationError
} from './transactions.validation.js';

function getUserId(res: Response): number {
  const userId = Number(res.locals.userId);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw Object.assign(
      new Error('Invalid authenticated user.'),
      { statusCode: 401 }
    );
  }

  return userId;
}

function sendError(res: Response, error: unknown) {
  const err = error as Error & { statusCode?: number };

  const statusCode = err.statusCode ?? 500;

  if (statusCode === 500) {
    console.error('Transaction API error:', error);
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500
      ? 'An unexpected error occurred.'
      : err.message
  });
}

export async function create(req: Request, res: Response) {
  try {
    const userId = getUserId(res);
    const data = validateTransactionBody(req.body);

    const transaction = await transactionService.create(
      userId,
      data as Parameters<typeof transactionService.create>[1]
    );

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully.',
      data: transaction
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getAll(_req: Request, res: Response) {
  try {
    const userId = getUserId(res);
    const transactions = await transactionService.getAll(userId);

    return res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully.',
      data: transactions
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const userId = getUserId(res);
    const rawId = req.params.id;
    if (typeof rawId !== 'string') {
        throw new ValidationError('Invalid transaction ID.');
    }

    const id = parseTransactionId(rawId);

    const transaction = await transactionService.getById(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully.',
      data: transaction
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const userId = getUserId(res);
   const rawId = req.params.id;
    if (typeof rawId !== 'string') {
        throw new ValidationError('Invalid transaction ID.');
    }

    const id = parseTransactionId(rawId);

    const data = validateTransactionBody(req.body, true);

    const transaction = await transactionService.update(
      id,
      userId,
      data
    );

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully.',
      data: transaction
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function deleteTransaction(
  req: Request,
  res: Response
) {
  try {
    const userId = getUserId(res);
    const rawId = req.params.id;
    if (typeof rawId !== 'string') {
        throw new ValidationError('Invalid transaction ID.');
    }

    const id = parseTransactionId(rawId);


    await transactionService.remove(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.'
    });
  } catch (error) {
    return sendError(res, error);
  }
}
