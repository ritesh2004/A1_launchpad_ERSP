import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { HTTP_STATUS_CODES } from "../utils/httpStatus.js";
import { generateTokens } from "../utils/generateTokens.js";

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS_CODES.CONFLICT).json({ message: "User already exists", success: false });
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    return res.status(HTTP_STATUS_CODES.CREATED).json({ message: "User created successfully", user: userResponse, success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Error creating user", success: false });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "User not found", success: false });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid password", success: false });
    }

    // Generate tokens
    const tokens = generateTokens(user);
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    // cookie configuration can be added here if needed
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    }
    return res
    .cookie("accessToken", tokens.accessToken, { ...options, sameSite: 'Strict', maxAge: 60 * 60 * 1000 }) // 1 hour
    .cookie("refreshToken", tokens.refreshToken, { ...options, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
    .status(HTTP_STATUS_CODES.OK)
    .json({ message: "Login successful", tokens, user: userResponse, success: true });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Error logging in user", success: false });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

  try {
    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "User not found", success: false });
    }

    return res.status(HTTP_STATUS_CODES.OK).json({ message: "User profile retrieved successfully", user: user, success: true });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Error retrieving user profile", success: false });
  }
}