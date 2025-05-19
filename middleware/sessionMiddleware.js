import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

const checkSessionActivity = async (req, res, next) => {
  const token = req.cookies.authToken; // Get the authToken from

  if (!token) {
    return res.status(401).json({ message: "Authentication token required." });
  }

  try {
    // Validate token using JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve session from the database
    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      return res.status(401).json({
        message: "Session expired or not found. Please log in again.",
      });
    }

    const inactivityPeriod = new Date(Date.now() - session.lastActivity);
    if (inactivityPeriod > 60 * 60 * 1000) {
      console.log("🚨 User inactive for too long. Marking session as expired.");

      // 🚀 Instead of deleting immediately, let the frontend handle logout first
      return res.status(401).json({
        message: "Session expired due to inactivity.",
      });
    }

    // Update activity timestamp
    session.lastActivity = new Date(Date.now()).toISOString();
    await Session.updateOne(
      { accessToken: token },
      { $set: { lastActivity: session.lastActivity } }
    );

    // ✅ Attach session data to request (INCLUDING userId!)
    req.session = session;
    req.userId = decoded.userId; // Attach userId from decoded token

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error validating session:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default checkSessionActivity;
