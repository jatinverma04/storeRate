import bcrypt from "bcrypt";
import { Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  collectSignupErrors,
  validateAdminUserRole,
} from "../validation.js";
import { buildTextFilters, parseSort } from "../utils/query.js";
import {
  averageRatingByStoreIds,
  roundRating,
  sortByRating,
} from "../utils/ratings.js";

const router = Router();

function adminCanDeleteUser(target, adminUserId) {
  if (target.id === adminUserId) return false;
  if (target.role === Role.ADMIN) return false;
  return target.role === Role.USER || target.role === Role.STORE_OWNER;
}

router.use(authenticate, requireRole(Role.ADMIN));

router.get("/dashboard", async (_req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  res.json({ totalUsers, totalStores, totalRatings });
});

router.get("/stores", async (req, res) => {
  const { sortBy, sortOrder } = parseSort(req.query, [
    "name",
    "email",
    "address",
    "createdAt",
    "rating",
  ]);
  const where = buildTextFilters(req.query, ["name", "email", "address"]);

  let stores = await prisma.store.findMany({ where });
  const ratingMap = await averageRatingByStoreIds(
    prisma,
    stores.map((s) => s.id)
  );

  let items = stores.map((store) => ({
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    rating: ratingMap.get(store.id)?.averageRating ?? null,
  }));

  if (sortBy === "rating") {
    items = sortByRating(items, sortOrder);
  } else {
    items.sort((a, b) => {
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      if (av < bv) return sortOrder === "desc" ? 1 : -1;
      if (av > bv) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });
  }

  res.json({ stores: items });
});

router.post("/stores", async (req, res) => {
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
      message: "A user with this email already exists.",
      errors: [{ field: "email", message: "Email is already in use." }],
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const store = await prisma.$transaction(async (tx) => {
    const owner = await tx.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        address: address.trim(),
        password: passwordHash,
        role: Role.STORE_OWNER,
        createdByAdminId: req.user.userId,
      },
    });
    return tx.store.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        address: address.trim(),
        ownerId: owner.id,
      },
    });
  });

  res.status(201).json({
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      rating: null,
    },
  });
});

router.get("/users", async (req, res) => {
  const { sortBy, sortOrder } = parseSort(req.query, [
    "name",
    "email",
    "address",
    "role",
    "createdAt",
  ]);
  const textWhere = buildTextFilters(req.query, ["name", "email", "address"]);
  const and = [textWhere];

  const forDelete = req.query.forDelete === "true";
  const roleFilter = req.query.role;
  if (forDelete) {
    and.push({ role: { in: [Role.USER, Role.STORE_OWNER] } });
  } else if (roleFilter && Object.values(Role).includes(roleFilter)) {
    and.push({ role: roleFilter });
  } else {
    and.push({
      role: { in: [Role.USER, Role.ADMIN, Role.STORE_OWNER] },
    });
  }

  const users = await prisma.user.findMany({
    where: { AND: and },
    orderBy: sortBy === "role" ? { role: sortOrder } : { [sortBy]: sortOrder },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
    },
  });

  const visible = forDelete
    ? users.filter((u) => adminCanDeleteUser(u, req.user.userId))
    : users;

  const items = visible.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    address: u.address,
    role: u.role,
  }));

  res.json({ users: items });
});

router.post("/users", async (req, res) => {
  const { name, email, address, password, role } = req.body ?? {};
  const errors = collectSignupErrors({ name, email, address, password });
  const roleErr = validateAdminUserRole(role);
  if (roleErr) errors.push({ field: "role", message: roleErr });
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
      role,
      createdByAdminId: req.user.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
    },
  });

  res.status(201).json({ user });
});

router.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      store: { select: { id: true } },
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  let rating = null;
  if (user.role === Role.STORE_OWNER && user.store) {
    const agg = await prisma.rating.aggregate({
      where: { storeId: user.store.id },
      _avg: { score: true },
    });
    rating = roundRating(agg._avg.score);
  }

  const { store, ...rest } = user;
  res.json({ user: { ...rest, rating } });
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  if (id === req.user.userId) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "User not found." });
  }

  if (!adminCanDeleteUser(existing, req.user.userId)) {
    return res.status(403).json({
      message: "You cannot delete admin accounts or your own account.",
    });
  }

  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

export default router;
