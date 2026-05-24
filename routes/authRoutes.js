import express from "express";

import {
    register,
    login,
    logout,
    updateProfile,
    deleteUser
} from "../controllers/authController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", verifyToken, logout);

router.put(
    "/update/:id",
    verifyToken,
    updateProfile
);

router.delete(
    "/delete/:id",
    verifyToken,
    deleteUser
);

export default router;