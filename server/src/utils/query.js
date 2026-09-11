export function parseSort(query, allowedFields, defaultField = "name") {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : defaultField;
  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";
  return { sortBy, sortOrder };
}

export function buildTextFilters(query, fields) {
  const clauses = [];
  for (const field of fields) {
    const raw = query[field];
    if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
      clauses.push({
        [field]: { contains: String(raw).trim(), mode: "insensitive" },
      });
    }
  }
  if (clauses.length === 0) return {};
  return { AND: clauses };
}
