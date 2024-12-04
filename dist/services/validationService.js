"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const transaction_1 = require("../types/transaction");
const ibanValidator_1 = require("../utils/ibanValidator");
class ValidationService {
    static validateTransaction(data) {
        if (!data.userId || !data.amount || !data.title || !data.type) {
            return { message: 'Invalid request body.', statusCode: 400 };
        }
        if (data.type === transaction_1.TransactionType.TRANSFER) {
            if (!data.iban) {
                return { message: 'IBAN is required.', statusCode: 400 };
            }
            if (!(0, ibanValidator_1.isValidIBAN)(data.iban)) {
                return { message: 'IBAN is invalid.', statusCode: 400 };
            }
        }
        return null;
    }
}
exports.ValidationService = ValidationService;
