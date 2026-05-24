import db from "../config/db.js";
import { io } from "../server.js";

export const getDrivers = (req, res) => {
    const sql = "SELECT * FROM drivers ORDER BY id DESC";

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

export const createDriver = (req, res) => {
    const {
        driver_name,
        phone,
        license_number,
        license_expiry,
        address,
        status,
    } = req.body;

    const sql = `
    INSERT INTO drivers
    (
      driver_name,
      phone,
      license_number,
      license_expiry,
      address,
      status
    )
    VALUES (?,?,?,?,?,?)
  `;

    db.query(
        sql,
        [
            driver_name,
            phone,
            license_number,
            license_expiry,
            address,
            status,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                success: true,
                message: "Driver Created",
            });
        }
    );
};




export const updateDriver = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE drivers SET status=? WHERE id=?";

    db.query(sql, [status, id], (err) => {
        if (err) {
            return res.status(500).json(err);
        }

        // SOCKET EMIT AFTER SUCCESS
        io.emit("driverUpdated", {
            id,
            status,
        });

        res.json({
            success: true,
            message: "Driver updated",
        });
    });
};

export const deleteDriver = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM drivers WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            success: true,
            message: "Driver Deleted",
        });
    });
};