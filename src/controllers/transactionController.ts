import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { createTransaction } from '../services/transactionService';
import { getUserById, updateUserById } from '../services/userService';
import { ValidationService } from '../services/validationService';
import { TransactionRequest, TransactionType } from '../types/transaction';

export class TransactionController {
  static async handleTransaction(req: Request<{}, {}, TransactionRequest>, res: Response) {
    try {
      const validationError = ValidationService.validateTransaction(req.body);
      if (validationError) {
        return res.status(validationError.statusCode).json({ error: validationError.message });
      }

      const user = await this.getAndValidateUser(req.body.userId);
      if ('error' in user) {
        return res.status(user.statusCode).json({ error: user.message });
      }

      const result = await this.processTransaction(user, req.body);
      if ('error' in result) {
        return res.status(result.statusCode).json({ error: result.message });
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error('Transaction failed:', error);
      return res.status(500).json({ error: 'Transaction failed.' });
    }
  }

  private static async getAndValidateUser(userId: number): Promise<User | { message: string; statusCode: number; error: true }> {
    try {
      const user = await getUserById(userId);
      if (!user) {
        return { message: 'User not found.', statusCode: 404, error: true };
      }
      return user;
    } catch (error) {
      return { message: 'Getting User failed.', statusCode: 500, error: true };
    }
  }

  private static async processTransaction(user: User, data: TransactionRequest) {
    const { amount, type, title, iban } = data;

    if (type !== TransactionType.DEPOSIT && amount > user.balance) {
      return { message: 'Insufficient balance', statusCode: 400, error: true };
    }

    const newBalance = type === TransactionType.DEPOSIT 
      ? Number(user.balance) + Number(amount) 
      : Number(user.balance) - Number(amount);

    const transaction = await createTransaction(
      user.id,
      title,
      amount,
      type,
      type === TransactionType.TRANSFER ? iban : undefined
    );

    await updateUserById({ ...user, balance: newBalance });
    return transaction;
  }
}
