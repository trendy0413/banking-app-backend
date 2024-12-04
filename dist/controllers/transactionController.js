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
exports.TransactionController = void 0;
const transactionService_1 = require("../services/transactionService");
const userService_1 = require("../services/userService");
const validationService_1 = require("../services/validationService");
const transaction_1 = require("../types/transaction");
class TransactionController {
    static handleTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationError = validationService_1.ValidationService.validateTransaction(req.body);
                if (validationError) {
                    return res.status(validationError.statusCode).json({ error: validationError.message });
                }
                const user = yield this.getAndValidateUser(req.body.userId);
                if ('error' in user) {
                    return res.status(user.statusCode).json({ error: user.message });
                }
                const result = yield this.processTransaction(user, req.body);
                if ('error' in result) {
                    return res.status(result.statusCode).json({ error: result.message });
                }
                return res.status(201).json(result);
            }
            catch (error) {
                console.error('Transaction failed:', error);
                return res.status(500).json({ error: 'Transaction failed.' });
            }
        });
    }
    static getAndValidateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, userService_1.getUserById)(userId);
                if (!user) {
                    return { message: 'User not found.', statusCode: 404, error: true };
                }
                return user;
            }
            catch (error) {
                return { message: 'Getting User failed.', statusCode: 500, error: true };
            }
        });
    }
    static processTransaction(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, type, title, iban } = data;
            if (type !== transaction_1.TransactionType.DEPOSIT && amount > user.balance) {
                return { message: 'Insufficient balance', statusCode: 400, error: true };
            }
            const newBalance = type === transaction_1.TransactionType.DEPOSIT
                ? Number(user.balance) + Number(amount)
                : Number(user.balance) - Number(amount);
            const transaction = yield (0, transactionService_1.createTransaction)(user.id, title, amount, type, type === transaction_1.TransactionType.TRANSFER ? iban : undefined);
            yield (0, userService_1.updateUserById)(Object.assign(Object.assign({}, user), { balance: newBalance }));
            return transaction;
        });
    }
}
exports.TransactionController = TransactionController;
