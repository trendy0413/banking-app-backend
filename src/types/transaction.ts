export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer'
}

export interface TransactionRequest {
  userId: number;
  amount: number;
  title: string;
  type: TransactionType;
  iban?: string;
}

export interface TransactionError {
  message: string;
  statusCode: number;
}
