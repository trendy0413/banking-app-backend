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
exports.updateUserById = exports.getUserById = exports.getCurrentUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCurrentUser = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findFirst({
        orderBy: { name: "asc" },
    });
});
exports.getCurrentUser = getCurrentUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({
        where: { id },
    });
});
exports.getUserById = getUserById;
const updateUserById = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.update({
        where: { id: data.id },
        data: data,
    });
});
exports.updateUserById = updateUserById;
