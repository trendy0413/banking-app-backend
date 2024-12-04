import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (
  userId: number,
  title: string,
  amount: number | string,
  type: string,
  transferToIBAN?: string
) => {
  // Convert amount to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Validate that amount is a valid number
  if (isNaN(numericAmount)) {
    throw new Error('Invalid amount provided');
  }

  // Calculate current balance from transactions
  const userTransactions = await prisma.transaction.findMany({
    where: { userId }
  });

  const currentBalance = userTransactions.reduce((acc, trans) => {
    if (trans.type === 'deposit') return acc + trans.amount;
    if (trans.type === 'withdrawal' || trans.type === 'transfer') return acc - trans.amount;
    return acc;
  }, 0);

  // Check if sufficient balance for withdrawal/transfer
  if ((type === 'withdrawal' || type === 'transfer') && currentBalance < numericAmount) {
    throw new Error('Insufficient balance');
  }

  return prisma.transaction.create({
    data: {
      title,
      type,
      amount: numericAmount,
      userId,
      status: 'success',
      transferToIBAN
    },
  });
};

export const getUserTransactions = async (userId: number) => {
  return prisma.transaction.findMany({
    where: {userId},
    orderBy: { date: 'desc' },
    include: { user: true }
  });
};