import db from "../config/db.js";

/**
 * GET ALL VEHICLES (with pagination, search, filter)
 */
export const getVehicles = (req, res) => {
  const { page = 1, limit = 10, search = "", status = "" } = req.query;

  const offset = (page - 1) * limit;

  let sql = `
    SELECT * FROM vehicles
    WHERE 1=1
  `;

  let params = [];

  // SEARCH (FIXED)
  if (search) {
    sql += `
      AND (
        vehicle_number LIKE ?
        OR vehicle_type LIKE ?
        OR driver_assigned LIKE ?
      )
    `;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // FILTER
  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }

  // COUNT QUERY
  let countSql = `
    SELECT COUNT(*) as total FROM vehicles
    WHERE 1=1
  `;

  let countParams = [];

  if (search) {
    countSql += `
      AND (
        vehicle_number LIKE ?
        OR vehicle_type LIKE ?
        OR driver_assigned LIKE ?
      )
    `;
    countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    countSql += ` AND status = ?`;
    countParams.push(status);
  }

  db.query(countSql, countParams, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        data: result,
        pagination: {
          total,
          page: Number(page),
          totalPages,
        },
      });
    });
  });
};

export const createVehicle = (req, res) => {
  const {
    vehicle_number,
    vehicle_type,
    capacity,
    fuel_type,
    driver_assigned,
    insurance_expiry,
    maintenance_date,
    status,
  } = req.body;

  const sql = `
    INSERT INTO vehicles (
      vehicle_number,
      vehicle_type,
      capacity,
      fuel_type,
      driver_assigned,
      insurance_expiry,
      maintenance_date,
      status
    ) VALUES (?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      vehicle_number,
      vehicle_type,
      capacity,
      fuel_type,
      driver_assigned,
      insurance_expiry,
      maintenance_date,
      status,
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        success: true,
        message: "Vehicle Created",
      });
    }
  );
};

export const updateVehicle = (req, res) => {
  const { id } = req.params;

  const {
    vehicle_number,
    vehicle_type,
    capacity,
    fuel_type,
    driver_assigned,
    insurance_expiry,
    maintenance_date,
    status,
  } = req.body;

  const sql = `
    UPDATE vehicles
    SET
      vehicle_number=?,
      vehicle_type=?,
      capacity=?,
      fuel_type=?,
      driver_assigned=?,
      insurance_expiry=?,
      maintenance_date=?,
      status=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      vehicle_number,
      vehicle_type,
      capacity,
      fuel_type,
      driver_assigned,
      insurance_expiry,
      maintenance_date,
      status,
      id,
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Vehicle Updated",
      });
    }
  );
};

export const deleteVehicle = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM vehicles WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            success: true,
            message: "Vehicle Deleted",
        });
    });
};