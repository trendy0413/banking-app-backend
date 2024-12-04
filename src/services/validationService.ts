import { TransactionRequest, TransactionError, TransactionType } from '../types/transaction';
import { isValidIBAN } from '../utils/ibanValidator';

export class ValidationService {
  static validateTransaction(data: TransactionRequest): TransactionError | null {
    if (!data.userId || !data.amount || !data.title || !data.type) {
      return { message: 'Invalid request body.', statusCode: 400 };
    }

    if (data.type === TransactionType.TRANSFER) {
      if (!data.iban) {
        return { message: 'IBAN is required.', statusCode: 400 };
      }
      
      if (!isValidIBAN(data.iban)) {
        return { message: 'IBAN is invalid.', statusCode: 400 };
      }
    }

    return null;
  }
} 