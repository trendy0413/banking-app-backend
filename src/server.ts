import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

app.use("/api/accounts", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

main();
