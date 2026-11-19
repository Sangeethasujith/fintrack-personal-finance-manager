import { Request, Response } from 'express';
import {
  authService,
  AuthError
} from './auth.service.js';

function handleError(res: Response, error: unknown) {
  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        typeof password !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Name, email and password are required'
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address'
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must contain at least 8 characters'
        });
      }

      const result = await authService.register(
        name,
        email,
        password
      );

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (
        typeof email !== 'string' ||
        !email.trim() ||
        typeof password !== 'string' ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  async me(req: Request, res: Response) {
    try {
      const userId = Number(res.locals.userId);

      const user = await authService.getProfile(userId);

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
};