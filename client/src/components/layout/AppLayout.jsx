import { useState } from "react";
import { Outlet } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import Sidebar, { MobileMenuButton } from "./Sidebar.jsx";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background md:items-start">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 md:hidden">
          <MobileMenuButton onOpen={() => setSidebarOpen(true)} />
          <img src="/favicon.svg" alt="" className="h-7 w-7" width="28" height="28" />
          <span className="flex-1 font-semibold text-text-primary">StoreRate</span>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
