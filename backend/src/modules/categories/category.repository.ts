import prisma from '../../config/prisma.js';

export const findAll = async (userId: number) => {
  return prisma.category.findMany({
    where: {
      OR: [
        { userId: null },
        { userId }
      ]
    },
    orderBy: {
      name: 'asc'
    }
  });
};