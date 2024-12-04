import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const getCurrentUser = async () => {
  return prisma.user.findFirst({
    orderBy: { name: "asc" },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const updateUserById = async (data: User) => {
  return prisma.user.update({
    where: { id: data.id },
    data: data,
  });
};
