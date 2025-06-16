import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth?.token; // Use optional chaining to prevent errors

  if (!token) {
    return next(new Error("No authorization token provided"));
  }

  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      socket.user = decodeValue;
      return next();
    }
  } catch (e) {
    return next(new Error("Invalid or expired token"));
  }
};
