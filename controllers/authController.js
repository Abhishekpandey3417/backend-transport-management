import bcrypt from "bcryptjs";

import db from "../config/db.js";

import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const checkUserSql =
            "SELECT * FROM users WHERE email=?";

        db.query(
            checkUserSql,
            [email],
            async (checkErr, checkResult) => {
                if (checkErr) {
                    return res.status(500).json({
                        success: false,
                        message: "Database Error",
                    });
                }

                if (checkResult.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Email Already Exists",
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                const sql =
                    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";

                db.query(
                    sql,
                    [name, email, hashedPassword, role],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Registration Failed",
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "User Registered Successfully",
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = generateToken(
            user.id,
            user.role
        );

        res.status(200).json({
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
    });
};

export const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logout Successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, email, password, role } =
            req.body;

        let updateQuery = `
      UPDATE users
      SET
      name=?,
      email=?,
      role=?
    `;

        let values = [name, email, role];

        if (password && password.trim() !== "") {
            const hashedPassword =
                await bcrypt.hash(password, 10);

            updateQuery += `, password=?`;

            values.push(hashedPassword);
        }

        updateQuery += ` WHERE id=?`;

        values.push(id);

        db.query(
            updateQuery,
            values,
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Update Failed",
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Profile Updated Successfully",
                });
            }
        );
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

        const sql = "DELETE FROM users WHERE id=?";

        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Delete Failed",
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found",
                });
            }

            res.status(200).json({
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