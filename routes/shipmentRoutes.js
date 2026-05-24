import express from "express";

import {
    getShipments,
    createShipment,
    updateShipment,
    deleteShipment,
} from "../controllers/shipmentController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getallshipments", verifyToken, getShipments);

router.post("/createshipment", verifyToken, createShipment);

router.put("/updateshipment/:id", verifyToken, updateShipment);

router.delete("/deleteshipment/:id", verifyToken, deleteShipment);

export default router;