const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_RE = /[^A-Za-z0-9]/;

export function validateEmail(email) {
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validateName(name) {
  const trimmed = name?.trim() ?? "";
  if (trimmed.length < 20 || trimmed.length > 60) {
    return "Name must be between 20 and 60 characters.";
  }
  return null;
}

export function validateAddress(address) {
  if (!address?.trim()) return "Address is required.";
  if (address.length > 400) return "Address must be at most 400 characters.";
  return null;
}

export function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) {
    return "Password must be between 8 and 16 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!SPECIAL_CHAR_RE.test(password)) {
    return "Password must include at least one special character.";
  }
  return null;
}

export function collectSignupErrors(fields) {
  const errors = [];
  const checks = [
    ["name", validateName(fields.name)],
    ["email", validateEmail(fields.email)],
    ["address", validateAddress(fields.address)],
    ["password", validatePassword(fields.password)],
  ];
  for (const [field, message] of checks) {
    if (message) errors.push({ field, message });
  }
  return errors;
}

export function validateAdminUserRole(role) {
  if (role !== "USER" && role !== "ADMIN") {
    return "Role must be Normal User or Admin.";
  }
  return null;
}
