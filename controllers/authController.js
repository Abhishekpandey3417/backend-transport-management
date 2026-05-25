import bcrypt from "bcryptjs";
import db from "../config/db.js";
import generateToken from "../utils/generateToken.js";

export const register = (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const checkUserSql = "SELECT * FROM users WHERE email=?";

        db.query(checkUserSql, [email], async (checkErr, checkResult) => {
            if (checkErr) {
                console.error("DB Error (check user):", checkErr);
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                });
            }

            if (checkResult && checkResult.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email Already Exists",
                });
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const sql =
                    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";

                db.query(
                    sql,
                    [name, email, hashedPassword, role || "user"],
                    (err) => {
                        if (err) {
                            console.error("DB Insert Error:", err);
                            return res.status(500).json({
                                success: false,
                                message: "Registration Failed",
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: "User Registered Successfully",
                        });
                    }
                );
            } catch (e) {
                console.error("Register Error:", e);
                return res.status(500).json({
                    success: false,
                    message: "Server Error",
                });
            }
        });
    } catch (error) {
        console.error("Register Controller Crash:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }

        const sql = "SELECT * FROM users WHERE email=?";

        db.query(sql, [email], async (err, result) => {
            if (err) {
                console.error("DB Login Error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found",
                });
            }

            const user = result[0];

            try {
                const isMatch = await bcrypt.compare(
                    password,
                    user.password || ""
                );

                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Credentials",
                    });
                }

                const token = generateToken(user.id, user.role);

                return res.status(200).json({
                    success: true,
                    message: "Login Successful",
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
            } catch (e) {
                console.error("Auth Error:", e);
                return res.status(500).json({
                    success: false,
                    message: "Authentication Error",
                });
            }
        });
    } catch (error) {
        console.error("Login Controller Crash:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logout Successful",
    });
};

export const updateProfile = (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID required",
            });
        }

        let updateQuery = `
            UPDATE users
            SET name=?, email=?, role=?
        `;

        let values = [name, email, role];

        const proceedUpdate = (finalQuery, finalValues) => {
            db.query(finalQuery, finalValues, (err) => {
                if (err) {
                    console.error("Update Error:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Update Failed",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Profile Updated Successfully",
                });
            });
        };

        if (password && password.trim() !== "") {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Password Hash Failed",
                    });
                }

                const finalQuery = updateQuery + ", password=? WHERE id=?";
                const finalValues = [...values, hashedPassword, id];

                proceedUpdate(finalQuery, finalValues);
            });
        } else {
            const finalQuery = updateQuery + " WHERE id=?";
            const finalValues = [...values, id];

            proceedUpdate(finalQuery, finalValues);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteUser = (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID required",
            });
        }

        const sql = "DELETE FROM users WHERE id=?";

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Delete Error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Delete Failed",
                });
            }

            if (!result || result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "User Deleted Successfully",
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};