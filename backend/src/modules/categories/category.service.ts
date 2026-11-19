import * as categoryRepository from './category.repository.js';

export const getAll = async (userId: number) => {
  return categoryRepository.findAll(userId);
};