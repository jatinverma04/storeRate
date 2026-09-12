const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover border border-transparent dark:text-gray-900",
  secondary:
    "bg-surface text-primary border border-border hover:bg-background",
  success: "bg-accent text-white hover:opacity-90 border border-transparent",
  destructive:
    "bg-error text-white hover:opacity-90 border border-transparent",
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-button px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
