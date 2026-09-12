export function formatRole(role) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "USER":
      return "Normal User";
    case "STORE_OWNER":
      return "Store Owner";
    default:
      return role;
  }
}

export function formatRating(value) {
  if (value === null || value === undefined) return "—";
  return String(value);
}
