export type RegisterValues = {
  username: string;
  email: string;
  password: string;
};

export type ValidationResult = { valid: boolean; message?: string };
export type Validator = (
  value: string,
  allValues?: Partial<RegisterValues>,
) => ValidationResult;

const PASSWORD_ALLOWED_SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";
const PASSWORD_PATTERN = new RegExp(
  `^[A-Za-z0-9${PASSWORD_ALLOWED_SYMBOLS.replace(/[[\]\\^$.*+?(){}|]/g, "\\$&")}]+$`,
);

function validatePassword(value: string): ValidationResult {
  if (value.length < 8) {
    return { valid: false, message: "Must be at least 8 characters." };
  }
  if (value.length > 128) {
    return { valid: false, message: "Must be 128 characters or fewer." };
  }
  if (!PASSWORD_PATTERN.test(value)) {
    return {
      valid: false,
      message: "Only letters, numbers, and symbols allowed.",
    };
  }
  return { valid: true };
}

export const FIELD_VALIDATOR: Record<string, Validator> = {
  username: (value) => {
    if (value.length < 3)
      return { valid: false, message: "Must be at least 3 characters." };
    if (value.length > 32)
      return { valid: false, message: "Must be 32 characters or fewer." };
    if (!/^[a-zA-Z0-9_.]+$/.test(value))
      return {
        valid: false,
        message: "Can only contain letters, numbers, underscores, and dots.",
      };
    return { valid: true };
  },

  email: (value) => {
    if (value.length > 254)
      return { valid: false, message: "Must be 254 characters or fewer." };
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? { valid: true }
      : { valid: false, message: "Enter a valid email address." };
  },

  password: (value) => validatePassword(value),

  confirm: (value, allValues) => {
    const password = allValues?.password ?? "";
    if (!validatePassword(password).valid)
      return { valid: false, message: "Please enter a valid password first." };
    if (value.length === 0)
      return { valid: false, message: "Please confirm your password." };
    return value === password
      ? { valid: true }
      : { valid: false, message: "Passwords do not match." };
  },
};
