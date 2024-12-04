"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTransactions = exports.createTransaction = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTransaction = (userId, title, amount, type, transferToIBAN) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert amount to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    // Validate that amount is a valid number
    if (isNaN(numericAmount)) {
        throw new Error('Invalid amount provided');
    }
    // Calculate current balance from transactions
    const userTransactions = yield prisma.transaction.findMany({
        where: { userId }
    });
    const currentBalance = userTransactions.reduce((acc, trans) => {
        if (trans.type === 'deposit')
            return acc + trans.amount;
        if (trans.type === 'withdrawal' || trans.type === 'transfer')
            return acc - trans.amount;
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
});
exports.createTransaction = createTransaction;
const getUserTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { user: true }
    });
});
exports.getUserTransactions = getUserTransactions;
