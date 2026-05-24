import express from "express";

import {
    getDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
} from "../controllers/driverController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getalldrivers", verifyToken, getDrivers);

router.post("/createdriver", verifyToken, createDriver);

router.put("/updatedriver/:id", verifyToken, updateDriver);

router.delete("/deletedriver/:id", verifyToken, deleteDriver);

export default router;