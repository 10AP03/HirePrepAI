import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Register User

export const registerUser = async (req, res) => {
  try {

    
    const { name, email, password, role } = req.body;       // Extract incoming data from request body

    
    
    if (!name || !email || !password || !role) {               // Validate required fields
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    
    const trimmedName = name.trim();                  // Clean the user input
    const emailLower = email.trim().toLowerCase();     // Removes unnecessary spaces and converts email to lowercase.

    
    const existingUser = await User.findOne({ email: emailLower });       // Check whether the user already exists

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    
    const salt = await bcrypt.genSalt(10);                    // Generate salt and hash the password
    const hashedPassword = await bcrypt.hash(password, salt);     // Never store the original password in the database.

    
    const user = await User.create({              // Create a new user document and save it
      name: trimmedName,
      email: emailLower,
      password: hashedPassword,
      role,
    });

    
    const token = jwt.sign(             // Generate JWT token
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    
    return res.status(201).json({                 // Send success response
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    
    console.error(error);           // Log actual error on server

    
    return res.status(400).json({             // Send generic error to client
      message: "Internal Server Error",
    });

  }
};


// Login User

export const loginUser = async (req, res) => {
  try {

    
    const { email, password } = req.body;         // Extract incoming data

    
    if (!email || !password) {                    // Validate required fields
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    
    const emailLower = email.trim().toLowerCase();        // Convert email to lowercase for consistency

    
    
    const user = await User.findOne({                 // Find user and include password
      email: emailLower,                              // (password is hidden in the schema using select:false)
    }).select("+password");

    
    if (!user) {                                    // User not found
      return res.status(404).json({
        message: "User not found",
      });
    }

    
    if (!user.password) {                               // Extra safety check
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);          // Compare entered password with hashed password

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    
    const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
    );

    
    return res.status(200).json({                       // Send success response
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    
    console.error(error);                               // Log actual error

    
    return res.status(500).json({                     // Send generic error
      message: "Internal Server Error",
    });

  }
};