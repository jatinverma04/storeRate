import bcrypt from "bcrypt";
import { Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  collectSignupErrors,
  validatePassword,
} from "../validation.js";
import { signToken } from "../utils/jwt.js";

const router = Router();

function userResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };
}

router.post("/register", async (req, res) => {
  const { name, email, address, password } = req.body ?? {};
  const errors = collectSignupErrors({ name, email, address, password });
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return res.status(409).json({
      message: "An account with this email already exists.",
      errors: [{ field: "email", message: "Email is already registered." }],
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      address: address.trim(),
      password: passwordHash,
      role: Role.USER,
    },
  });

  const token = signToken(user);
  res.status(201).json({ token, user: userResponse(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
      errors: [
        !email && { field: "email", message: "Email is required." },
        !password && { field: "password", message: "Password is required." },
      ].filter(Boolean),
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(user);
  res.json({ token, user: userResponse(user) });
});

router.post(
  "/change-password",
  authenticate,
  requireRole(Role.USER, Role.STORE_OWNER),
  async (req, res) => {
    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
        errors: [
          !currentPassword && {
            field: "currentPassword",
            message: "Current password is required.",
          },
          !newPassword && {
            field: "newPassword",
            message: "New password is required.",
          },
        ].filter(Boolean),
      });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: [{ field: "newPassword", message: passwordError }],
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        errors: [{ field: "currentPassword", message: "Current password is incorrect." }],
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash },
    });

    res.json({ message: "Password updated successfully." });
  }
);

export default router;
