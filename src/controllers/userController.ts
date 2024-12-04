import { Request, Response } from "express";
import { getUserTransactions } from "../services/transactionService";
import { getCurrentUser } from "../services/userService";

export const getUserStatement = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    const transactions = await getUserTransactions(userId);

    // Calculate current balance
    const balance = transactions.reduce((acc, trans) => {
      if (trans.type === "deposit") return acc + trans.amount;
      if (trans.type === "withdrawal" || trans.type === "transfer")
        return acc - trans.amount;
      return acc;
    }, 0);

    res.json({ transactions, balance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to fetch user statement." });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getCurrentUser();

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to fetch user statement." });
  }
};
