export function homePathForRole(role) {
  switch (role) {
    case "ADMIN":
    case "STORE_OWNER":
      return "/dashboard";
    case "USER":
      return "/stores";
    default:
      return "/login";
  }
}

export function navItemsForRole(role) {
  switch (role) {
    case "ADMIN":
      return [
        { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
        { to: "/stores", label: "Stores", icon: "Store" },
        { to: "/users", label: "Users", icon: "Users" },
        { to: "/users/delete", label: "Delete user", icon: "UserX" },
      ];
    case "USER":
      return [
        { to: "/stores", label: "Stores", icon: "Store" },
        { to: "/password", label: "Password", icon: "KeyRound" },
      ];
    case "STORE_OWNER":
      return [
        { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
        { to: "/password", label: "Password", icon: "KeyRound" },
      ];
    default:
      return [];
  }
}
