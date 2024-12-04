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
exports.getUser = exports.getUserStatement = void 0;
const transactionService_1 = require("../services/transactionService");
const userService_1 = require("../services/userService");
const getUserStatement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const transactions = yield (0, transactionService_1.getUserTransactions)(userId);
        // Calculate current balance
        const balance = transactions.reduce((acc, trans) => {
            if (trans.type === "deposit")
                return acc + trans.amount;
            if (trans.type === "withdrawal" || trans.type === "transfer")
                return acc - trans.amount;
            return acc;
        }, 0);
        res.json({ transactions, balance });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Unable to fetch user statement." });
    }
});
exports.getUserStatement = getUserStatement;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userService_1.getCurrentUser)();
        res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Unable to fetch user statement." });
    }
});
exports.getUser = getUser;
