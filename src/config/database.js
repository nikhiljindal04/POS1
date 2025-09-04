import { PrismaClient } from '../../generated/prisma/index.js';

import logger from '../utils/logger.js';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

prisma.$on('error', (e) => {
  logger.error('Prisma error:', e);
});

export default prisma;
