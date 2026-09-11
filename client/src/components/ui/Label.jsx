export default function Label({ htmlFor, children, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1 block text-sm font-medium text-text-primary ${className}`}
    >
      {children}
    </label>
  );
}
