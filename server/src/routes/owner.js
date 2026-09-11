import { Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { parseSort } from "../utils/query.js";
import { roundRating } from "../utils/ratings.js";

const router = Router();

router.use(authenticate, requireRole(Role.STORE_OWNER));

router.get("/dashboard", async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.userId },
  });

  if (!store) {
    return res.status(404).json({ message: "Store not found for this account." });
  }

  const agg = await prisma.rating.aggregate({
    where: { storeId: store.id },
    _avg: { score: true },
  });

  const { sortBy, sortOrder } = parseSort(req.query, [
    "name",
    "email",
    "address",
    "score",
  ]);

  const ratings = await prisma.rating.findMany({
    where: { storeId: store.id },
    include: {
      user: {
        select: { name: true, email: true, address: true },
      },
    },
  });

  let raters = ratings.map((r) => ({
    name: r.user.name,
    email: r.user.email,
    address: r.user.address,
    score: r.score,
  }));

  if (sortBy === "score") {
    raters.sort((a, b) => (a.score - b.score) * (sortOrder === "desc" ? -1 : 1));
  } else {
    raters.sort((a, b) => {
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      if (av < bv) return sortOrder === "desc" ? 1 : -1;
      if (av > bv) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });
  }

  res.json({
    store: {
      id: store.id,
      name: store.name,
      averageRating: roundRating(agg._avg.score),
    },
    raters,
  });
});

export default router;
