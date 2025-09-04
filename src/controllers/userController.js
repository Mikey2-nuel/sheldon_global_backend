// src/controllers/userController.js
import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { insertUser, getAllUsers, getAUser, updateUser, deleteAUser } from "../models/userModel.js";
import { findUserByEmail } from "../models/userModel.js";
import Joi from "joi";
import { isValidPhoneNumber } from "libphonenumber-js";

const signupSchema = Joi.object({
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dob: Joi.date().iso().required(),
  phone_number: Joi.string().required(),
  home_address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
  profile_pic: Joi.string().optional(),
});

export async function signupUser(req, res) {
  try {
    const userData = req.body;

    if (req.file) {
      userData.profile_pic = `/uploads/${req.file.filename}`;
    }

    const { error, value } = signupSchema.validate(userData);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const phone = String(value.phone_number || "").trim();
    const country = String(value.country || "").trim();

    if (!phone || !country) {
      return res
        .status(400)
        .json({ error: "Phone number and country are required." });
    }

    if (!isValidPhoneNumber(phone, country)) {
      return res
        .status(400)
        .json({ error: "Invalid phone number for selected country." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(value.password, 10);
    value.password = hashedPassword;

    const result = await insertUser(value);
    res
      .status(201)
      .json({
        message: "User registered successfully",
        userId: result.insertId,
      });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function loginAdminOrUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const redirect = user.role === "admin" ? "/admin-overview" : "/pages/user-dashboard";

    return res.status(200).json({
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
      token,
      redirect,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// export async function loginUser(req, res) {
//   const { email, password } = req.body;

//   try {
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

//@desc Get all users
//@route GET /users
export async function fetchAllUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//@desc Get a user
//@route GET /users/:id
export const fetchAUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const user = await getAUser(id);

  if (!user) {
       const error = new Error(`A user with the id of ${id} was not found `);
       error.status = 404;
       return next(error);
    }

  res.status(200).json(user);
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;       // user id from URL
    const data = req.body;           // fields from request body

    // Call the updateUser query
    const updatedUser = await updateUser(id, data);

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error updating user",
      error: err.message,
    });
  }
};

//@desc Delete a user
//@route DELETE /user/:id
export const deleteUser = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const result = await deleteAUser(id);

    if (result.affectedRows === 0) {
      const error = new Error(`A user with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    const error = new Error(`Failed to delete user: ${err.message}`);
    error.status = 500;
    return next(error);
  }
};
