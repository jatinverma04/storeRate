import { Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validateRatingScore } from "../validation.js";
import { buildTextFilters, parseSort } from "../utils/query.js";
import { averageRatingByStoreIds } from "../utils/ratings.js";

const router = Router();

router.get("/", authenticate, requireRole(Role.USER), async (req, res) => {
  const { sortBy, sortOrder } = parseSort(req.query, [
    "name",
    "address",
    "createdAt",
  ]);
  const where = buildTextFilters(req.query, ["name", "address"]);

  const stores = await prisma.store.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
  });

  const storeIds = stores.map((s) => s.id);
  const ratingMap = await averageRatingByStoreIds(prisma, storeIds);

  const myRatings = await prisma.rating.findMany({
    where: {
      userId: req.user.userId,
      storeId: { in: storeIds },
    },
    select: { storeId: true, score: true },
  });
  const myRatingByStore = new Map(
    myRatings.map((r) => [r.storeId, r.score])
  );

  res.json({
    stores: stores.map((store) => ({
      id: store.id,
      name: store.name,
      address: store.address,
      overallRating: ratingMap.get(store.id)?.averageRating ?? null,
      myRating: myRatingByStore.get(store.id) ?? null,
    })),
  });
});

router.put("/:storeId/rating", authenticate, requireRole(Role.USER), async (req, res) => {
  const { score } = req.body ?? {};
  const scoreError = validateRatingScore(score);
  if (scoreError) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: [{ field: "score", message: scoreError }],
    });
  }

  const store = await prisma.store.findUnique({
    where: { id: req.params.storeId },
  });
  if (!store) {
    return res.status(404).json({ message: "Store not found." });
  }

  const rating = await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: req.user.userId,
        storeId: store.id,
      },
    },
    create: {
      userId: req.user.userId,
      storeId: store.id,
      score,
    },
    update: { score },
  });

  res.json({ rating: { storeId: rating.storeId, score: rating.score } });
});

export default router;
