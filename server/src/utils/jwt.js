import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(user) {
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn }
  );
}

export function verifyToken(token) {
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.verify(token, secret);
}
