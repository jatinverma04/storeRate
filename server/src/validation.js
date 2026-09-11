const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_RE = /[^A-Za-z0-9]/;

export function validateEmail(email) {
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validateName(name) {
  if (typeof name !== "string") {
    return "Name is required.";
  }
  const trimmed = name.trim();
  if (trimmed.length < 20 || trimmed.length > 60) {
    return "Name must be between 20 and 60 characters.";
  }
  return null;
}

export function validateAddress(address) {
  if (typeof address !== "string" || !address.trim()) {
    return "Address is required.";
  }
  if (address.length > 400) {
    return "Address must be at most 400 characters.";
  }
  return null;
}

export function validatePassword(password) {
  if (typeof password !== "string") {
    return "Password is required.";
  }
  if (password.length < 8 || password.length > 16) {
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

/** @returns {{ field: string, message: string }[]} */
export function collectSignupErrors({ name, email, address, password }) {
  const errors = [];
  const nameErr = validateName(name);
  if (nameErr) errors.push({ field: "name", message: nameErr });
  const emailErr = validateEmail(email);
  if (emailErr) errors.push({ field: "email", message: emailErr });
  const addressErr = validateAddress(address);
  if (addressErr) errors.push({ field: "address", message: addressErr });
  const passwordErr = validatePassword(password);
  if (passwordErr) errors.push({ field: "password", message: passwordErr });
  return errors;
}

export function validateRatingScore(score) {
  const value = Number(score);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return "Rating must be an integer between 1 and 5.";
  }
  return null;
}

export function validateAdminUserRole(role) {
  if (role !== "USER" && role !== "ADMIN") {
    return "Role must be USER or ADMIN.";
  }
  return null;
}
