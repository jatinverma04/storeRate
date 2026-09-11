import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("API unreachable");
        return res.json();
      })
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold text-text-primary">StoreRate</h1>
      <p className="mt-2 text-text-secondary">Phase 0 — project foundation</p>
      <div className="mt-8 w-full max-w-sm rounded-card border border-border bg-surface p-6">
        {error && (
          <p className="text-sm text-error">
            API: {error} (start server with <code>npm run dev:server</code>)
          </p>
        )}
        {health && (
          <p className="text-sm text-success">
            API connected — {health.service}
          </p>
        )}
        {!health && !error && (
          <p className="text-sm text-text-secondary">Checking API…</p>
        )}
      </div>
    </div>
  );
}

export default App;
