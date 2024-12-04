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
const transactionController_1 = require("./transactionController");
const validationService_1 = require("../services/validationService");
const userService_1 = require("../services/userService");
const transactionService_1 = require("../services/transactionService");
const transaction_1 = require("../types/transaction");
// Mock dependencies
jest.mock('../services/validationService');
jest.mock('../services/userService');
jest.mock('../services/transactionService');
describe('TransactionController', () => {
    let mockRequest;
    let mockResponse;
    let mockJson;
    let mockStatus;
    let mockUser;
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
        userService_1.getUserById.mockResolvedValue(mockUser);
        validationService_1.ValidationService.validateTransaction.mockReturnValue(null);
    });
    describe('handleTransaction', () => {
        it('should process a deposit transaction successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransaction = { id: 1, amount: 100, type: transaction_1.TransactionType.DEPOSIT };
            transactionService_1.createTransaction.mockResolvedValue(mockTransaction);
            mockRequest = {
                body: {
                    userId: 1,
                    amount: 100,
                    type: transaction_1.TransactionType.DEPOSIT,
                    title: 'Test Deposit'
                }
            };
            yield transactionController_1.TransactionController.handleTransaction(mockRequest, mockResponse);
            expect(userService_1.updateUserById).toHaveBeenCalledWith(Object.assign(Object.assign({}, mockUser), { balance: 1100 }));
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockTransaction);
        }));
        it('should process a withdrawal transaction successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransaction = { id: 1, amount: 100, type: transaction_1.TransactionType.WITHDRAWAL };
            transactionService_1.createTransaction.mockResolvedValue(mockTransaction);
            mockRequest = {
                body: {
                    userId: 1,
                    amount: 100,
                    type: transaction_1.TransactionType.WITHDRAWAL,
                    title: 'Test Withdrawal'
                }
            };
            yield transactionController_1.TransactionController.handleTransaction(mockRequest, mockResponse);
            expect(userService_1.updateUserById).toHaveBeenCalledWith(Object.assign(Object.assign({}, mockUser), { balance: 900 }));
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockTransaction);
        }));
        it('should handle insufficient balance', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest = {
                body: {
                    userId: 1,
                    amount: 2000,
                    type: transaction_1.TransactionType.WITHDRAWAL,
                    title: 'Test Withdrawal'
                }
            };
            yield transactionController_1.TransactionController.handleTransaction(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Insufficient balance' });
            expect(transactionService_1.createTransaction).not.toHaveBeenCalled();
        }));
        it('should handle validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            validationService_1.ValidationService.validateTransaction.mockReturnValue({
                message: 'Invalid request',
                statusCode: 400
            });
            mockRequest = {
                body: {
                    userId: 1,
                    amount: 100,
                    type: transaction_1.TransactionType.DEPOSIT,
                    title: '' // Invalid title
                }
            };
            yield transactionController_1.TransactionController.handleTransaction(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid request' });
            expect(transactionService_1.createTransaction).not.toHaveBeenCalled();
        }));
        it('should handle user not found', () => __awaiter(void 0, void 0, void 0, function* () {
            userService_1.getUserById.mockResolvedValue(null);
            mockRequest = {
                body: {
                    userId: 999,
                    amount: 100,
                    type: transaction_1.TransactionType.DEPOSIT,
                    title: 'Test Deposit'
                }
            };
            yield transactionController_1.TransactionController.handleTransaction(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'User not found.' });
            expect(transactionService_1.createTransaction).not.toHaveBeenCalled();
        }));
    });
});
