import express from "express";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../controllers/expenseController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getallexpenses", verifyToken, getExpenses);

router.post("/createexpense", verifyToken, createExpense);

router.put("/updateexpense/:id", verifyToken, updateExpense);

router.delete("/deleteexpense/:id", verifyToken, deleteExpense);

export default router;