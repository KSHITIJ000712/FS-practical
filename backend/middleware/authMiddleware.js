const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

  const authHeader = req.headers.authorization;

  // Check whether token exists
  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Access denied. No token provided."
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store decoded user information
    req.user = decoded;

    // Continue to requested route
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
};

module.exports = protect;