import db from "../config/db.js";

export const getShipments = (req, res) => {
    const sql = `
        SELECT 
            s.*,
            v.vehicle_number,
            v.vehicle_type,
            d.driver_name,
            d.phone
        FROM shipments s
        LEFT JOIN vehicles v ON s.vehicle_id = v.id
        LEFT JOIN drivers d ON s.driver_id = d.id
        ORDER BY s.id DESC
    `;

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

export const createShipment = (req, res) => {
    const {
        order_id,
        customer_name,
        source_location,
        destination,
        dispatch_date,
        vehicle_id,
        driver_id,
        shipment_status,
    } = req.body;

    const sql = `
    INSERT INTO shipments
    (
      order_id,
      customer_name,
      source_location,
      destination,
      dispatch_date,
      vehicle_id,
      driver_id,
      shipment_status
    )
    VALUES (?,?,?,?,?,?,?,?)
  `;

    db.query(
        sql,
        [
            order_id,
            customer_name,
            source_location,
            destination,
            dispatch_date,
            vehicle_id,
            driver_id,
            shipment_status,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                success: true,
                message: "Shipment Created",
            });
        }
    );
};

export const updateShipment = (req, res) => {
    const { id } = req.params;

    const {
        order_id,
        customer_name,
        source_location,
        destination,
        dispatch_date,
        vehicle_id,
        driver_id,
        shipment_status,
    } = req.body;

    const sql = `
    UPDATE shipments
    SET
    order_id=?,
    customer_name=?,
    source_location=?,
    destination=?,
    dispatch_date=?,
    vehicle_id=?,
    driver_id=?,
    shipment_status=?
    WHERE id=?
  `;

    db.query(
        sql,
        [
            order_id,
            customer_name,
            source_location,
            destination,
            dispatch_date,
            vehicle_id,
            driver_id,
            shipment_status,
            id,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({
                success: true,
                message: "Shipment Updated",
            });
        }
    );
};

export const deleteShipment = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM shipments WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            success: true,
            message: "Shipment Deleted",
        });
    });
};