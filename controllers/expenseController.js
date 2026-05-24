import db from "../config/db.js";

export const getExpenses = (req, res) => {
    const sql = "SELECT * FROM expenses ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            success: true,
            data: result,
        });
    });
};

export const createExpense = (req, res) => {
    const {
        vehicle_id,
        expense_type,
        amount,
        expense_date,
        remarks,
    } = req.body;

    const sql = `
    INSERT INTO expenses
    (
      vehicle_id,
      expense_type,
      amount,
      expense_date,
      remarks
    )
    VALUES (?,?,?,?,?)
  `;

    db.query(
        sql,
        [
            vehicle_id,
            expense_type,
            amount,
            expense_date,
            remarks,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                success: true,
                message: "Expense Added",
            });
        }
    );
};

export const updateExpense = (req, res) => {
    const { id } = req.params;

    const {
        vehicle_id,
        expense_type,
        amount,
        expense_date,
        remarks,
    } = req.body;

    const sql = `
    UPDATE expenses
    SET
    vehicle_id=?,
    expense_type=?,
    amount=?,
    expense_date=?,
    remarks=?
    WHERE id=?
  `;

    db.query(
        sql,
        [
            vehicle_id,
            expense_type,
            amount,
            expense_date,
            remarks,
            id,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({
                success: true,
                message: "Expense Updated",
            });
        }
    );
};

export const deleteExpense = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM expenses WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            success: true,
            message: "Expense Deleted",
        });
    });
};