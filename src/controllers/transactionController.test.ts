import { Request, Response } from 'express';
import { TransactionController } from './transactionController';
import { ValidationService } from '../services/validationService';
import { getUserById, updateUserById } from '../services/userService';
import { createTransaction } from '../services/transactionService';
import { TransactionType } from '../types/transaction';
import { User } from '@prisma/client';

// Mock dependencies
jest.mock('../services/validationService');
jest.mock('../services/userService');
jest.mock('../services/transactionService');

describe('TransactionController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockUser: User;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      balance: 1000,
      createdAt: new Date(),
      bankNumber: '12345678'
    };

    (getUserById as jest.Mock).mockResolvedValue(mockUser);
    (ValidationService.validateTransaction as jest.Mock).mockReturnValue(null);
  });

  describe('handleTransaction', () => {
    it('should process a deposit transaction successfully', async () => {
      const mockTransaction = { id: 1, amount: 100, type: TransactionType.DEPOSIT };
      (createTransaction as jest.Mock).mockResolvedValue(mockTransaction);

      mockRequest = {
        body: {
          userId: 1,
          amount: 100,
          type: TransactionType.DEPOSIT,
          title: 'Test Deposit'
        }
      };

      await TransactionController.handleTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(updateUserById).toHaveBeenCalledWith({
        ...mockUser,
        balance: 1100
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockTransaction);
    });

    it('should process a withdrawal transaction successfully', async () => {
      const mockTransaction = { id: 1, amount: 100, type: TransactionType.WITHDRAWAL };
      (createTransaction as jest.Mock).mockResolvedValue(mockTransaction);

      mockRequest = {
        body: {
          userId: 1,
          amount: 100,
          type: TransactionType.WITHDRAWAL,
          title: 'Test Withdrawal'
        }
      };

      await TransactionController.handleTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(updateUserById).toHaveBeenCalledWith({
        ...mockUser,
        balance: 900
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockTransaction);
    });

    it('should handle insufficient balance', async () => {
      mockRequest = {
        body: {
          userId: 1,
          amount: 2000,
          type: TransactionType.WITHDRAWAL,
          title: 'Test Withdrawal'
        }
      };

      await TransactionController.handleTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Insufficient balance' });
      expect(createTransaction).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      (ValidationService.validateTransaction as jest.Mock).mockReturnValue({
        message: 'Invalid request',
        statusCode: 400
      });

      mockRequest = {
        body: {
          userId: 1,
          amount: 100,
          type: TransactionType.DEPOSIT,
          title: ''  // Invalid title
        }
      };

      await TransactionController.handleTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid request' });
      expect(createTransaction).not.toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
      (getUserById as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        body: {
          userId: 999,
          amount: 100,
          type: TransactionType.DEPOSIT,
          title: 'Test Deposit'
        }
      };

      await TransactionController.handleTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'User not found.' });
      expect(createTransaction).not.toHaveBeenCalled();
    });
  });
});