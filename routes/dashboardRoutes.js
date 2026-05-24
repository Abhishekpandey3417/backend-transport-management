import express from "express";

import { getDashboardStats } from "../controllers/dashboardController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getdashboardstats", verifyToken, getDashboardStats);

export default router;