import { UserModel } from "../models/user.model.js";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
const { sign } = jwt;

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Type of all fields should be string" });
  }

  try {
    const existUser = await UserModel.findOne({ email });

    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Type of all fields should be string",
    });
  }

  try {
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      const isMatch = await compare(password, existUser.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      const token = sign(
        { id: existUser._id, email: existUser.email },
        process.env.SECRET,
        {
          expiresIn: "7d",
        }
      );
      if (token) {
        res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .json({
            success: true,
            message: "Login successfull",
            id: existUser._id,
          });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ success: true });
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
