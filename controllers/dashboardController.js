import db from "../config/db.js";

export const getDashboardStats = (req, res) => {
  const queries = {
    vehiclesCount: "SELECT COUNT(*) AS count FROM vehicles",
    driversCount: "SELECT COUNT(*) AS count FROM drivers",
    shipmentsCount: "SELECT COUNT(*) AS count FROM shipments",
    expensesSum: "SELECT COALESCE(SUM(amount),0) AS total FROM expenses",

    recentVehicles: "SELECT * FROM vehicles ORDER BY id DESC LIMIT 5",
    recentDrivers: "SELECT * FROM drivers ORDER BY id DESC LIMIT 5",
    recentShipments: "SELECT * FROM shipments ORDER BY id DESC LIMIT 5",
    recentExpenses: "SELECT * FROM expenses ORDER BY id DESC LIMIT 5",

    shipmentTrend: `
      SELECT DATE_FORMAT(created_at,'%Y-%m') AS month, COUNT(*) AS total
      FROM shipments
      GROUP BY month
      ORDER BY month ASC
    `,

    expenseTrend: `
      SELECT DATE_FORMAT(expense_date,'%Y-%m') AS month, SUM(amount) AS total
      FROM expenses
      GROUP BY month
      ORDER BY month ASC
    `,

    vehicleStatus: `
      SELECT status, COUNT(*) AS total
      FROM vehicles
      GROUP BY status
    `,

    driverStatus: `
      SELECT status, COUNT(*) AS total
      FROM drivers
      GROUP BY status
    `,
  };

  const runQuery = (sql) =>
    new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

  (async () => {
    try {
      const [
        vCount,
        dCount,
        sCount,
        eSum,

        vehicles,
        drivers,
        shipments,
        expenses,

        shipmentTrend,
        expenseTrend,
        vehicleStatus,
        driverStatus,
      ] = await Promise.all([
        runQuery(queries.vehiclesCount),
        runQuery(queries.driversCount),
        runQuery(queries.shipmentsCount),
        runQuery(queries.expensesSum),

        runQuery(queries.recentVehicles),
        runQuery(queries.recentDrivers),
        runQuery(queries.recentShipments),
        runQuery(queries.recentExpenses),

        runQuery(queries.shipmentTrend),
        runQuery(queries.expenseTrend),
        runQuery(queries.vehicleStatus),
        runQuery(queries.driverStatus),
      ]);

      res.json({
        success: true,
        data: {
          summary: {
            totalVehicles: vCount[0].count,
            totalDrivers: dCount[0].count,
            totalShipments: sCount[0].count,
            totalExpenses: eSum[0].total,
          },

          recent: {
            vehicles,
            drivers,
            shipments,
            expenses,
          },

          analytics: {
            shipmentTrend,
            expenseTrend,
            vehicleStatus,
            driverStatus,
          },
        },
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Dashboard error",
        error: err,
      });
    }
  })();
};