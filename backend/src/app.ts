import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import transactionRoutes from './modules/transactions/transactions.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'FinTrack API is running!'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

export default app;