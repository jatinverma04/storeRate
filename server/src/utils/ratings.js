export function roundRating(avg) {
  if (avg === null || avg === undefined) return null;
  return Math.round(Number(avg) * 10) / 10;
}

export async function averageRatingByStoreIds(prisma, storeIds) {
  if (storeIds.length === 0) return new Map();

  const groups = await prisma.rating.groupBy({
    by: ["storeId"],
    where: { storeId: { in: storeIds } },
    _avg: { score: true },
    _count: { score: true },
  });

  const map = new Map();
  for (const row of groups) {
    map.set(row.storeId, {
      averageRating: roundRating(row._avg.score),
      ratingCount: row._count.score,
    });
  }
  return map;
}

export function sortByRating(items, sortOrder) {
  const dir = sortOrder === "desc" ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = a.rating ?? a.averageRating ?? -1;
    const bv = b.rating ?? b.averageRating ?? -1;
    return (av - bv) * dir;
  });
}
