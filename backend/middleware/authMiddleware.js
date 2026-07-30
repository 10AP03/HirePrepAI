import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const  protect = async (req, res, next) => {
  try {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {        // Check the Authorization Header

      token = req.headers.authorization.split(" ")[1];                  // Extract Token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);        // Verify the Token

      req.user = await User.findById(decoded.id);                     // Find the User and Attach User to Request

      if (!req.user) 
      {
        return res.status(401).json({ message: "User no longer exist."});
      }

      next();

    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }

  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

// Export Authentication Middleware 
export default protect;