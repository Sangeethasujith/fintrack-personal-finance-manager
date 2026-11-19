import { Request, Response } from 'express';
import * as categoryService from './category.service.js';

export const getAll = async (_req: Request, res: Response) => {
  try {
    const userId = Number(res.locals.userId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authenticated user.'
      });
    }

    const categories = await categoryService.getAll(userId);

    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully.',
      data: categories
    });

  } catch (error) {
    console.error('Category API error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve categories.'
    });
  }
};