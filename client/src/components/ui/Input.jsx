export default function Input({ id, error, className = "", ...props }) {
  return (
    <input
      id={id}
      className={`w-full rounded-input border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary ${
        error ? "border-error" : "border-border"
      } ${className}`}
      {...props}
    />
  );
}
