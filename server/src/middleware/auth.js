import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource." });
    }
    next();
  };
}
