import express from "express";

import {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} from "../controllers/vehicleController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getallvehicles", verifyToken, getVehicles);

router.post("/createvehicle", verifyToken, createVehicle);

router.put("/updatevehicle/:id", verifyToken, updateVehicle);

router.delete("/deletevehicle/:id", verifyToken, deleteVehicle);

export default router;