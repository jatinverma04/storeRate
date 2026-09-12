import ThemeToggle from "../ThemeToggle.jsx";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-9 w-9" width="36" height="36" />
          <span className="text-lg font-semibold text-text-primary">StoreRate</span>
        </div>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center p-4 pb-8">{children}</div>
    </div>
  );
}
