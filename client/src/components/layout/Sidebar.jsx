import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  Users,
  UserX,
  X,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { navItemsForRole } from "../../utils/roles.js";

const iconMap = {
  LayoutDashboard,
  Store,
  Users,
  UserX,
  KeyRound,
};

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const items = navItemsForRole(user?.role);
  const [logoutHover, setLogoutHover] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
      isActive
        ? "bg-nav-active text-primary font-medium"
        : "text-text-secondary hover:bg-background hover:text-text-primary"
    }`;

  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="h-7 w-7 shrink-0" width="28" height="28" />
              <p className="text-lg font-semibold text-text-primary">StoreRate</p>
            </div>
            <p className="mt-1 truncate text-xs text-text-secondary">{user?.email}</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button
          type="button"
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          onFocus={() => setLogoutHover(true)}
          onBlur={() => setLogoutHover(false)}
          onClick={() => {
            logout();
            onClose?.();
            navigate("/login");
          }}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-button px-3 py-2 text-sm transition-colors ${
            logoutHover
              ? "bg-neutral-100 text-[var(--sr-error)] dark:bg-neutral-800"
              : "text-text-secondary"
          }`}
        >
          <LogOut
            className={`size-4 shrink-0 transition-colors ${
              logoutHover
                ? "stroke-[var(--sr-error)]"
                : "stroke-[var(--sr-text-secondary)]"
            }`}
            aria-hidden
          />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-screen w-56 shrink-0 border-r border-border bg-surface md:block">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="relative z-50 h-full w-56 bg-surface shadow-sm">
            <button
              type="button"
              className="absolute right-3 top-3 p-1 text-text-secondary"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export function MobileMenuButton({ onOpen }) {
  return (
    <button
      type="button"
      className="rounded-md border border-border bg-surface p-2 text-text-primary md:hidden"
      onClick={onOpen}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
