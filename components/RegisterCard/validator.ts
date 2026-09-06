import { RegisterValues } from "./useRegisterForm";

export type ValidationResult = { valid: boolean; message?: string };
export type Validator = (
  value: string,
  allValues?: Partial<RegisterValues>,
) => ValidationResult;

const PASSWORD_ALLOWED_SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";
const PASSWORD_PATTERN = new RegExp(
  `^[A-Za-z0-9${PASSWORD_ALLOWED_SYMBOLS.replace(/[[\]\\^$.*+?(){}|]/g, "\\$&")}]+$`,
);

function validatePassword(v: string): { valid: boolean; message?: string } {
  if (v.length < 8) {
    return { valid: false, message: "Must be at least 8 characters." };
  }
  if (!PASSWORD_PATTERN.test(v)) {
    return {
      valid: false,
      message: "Only letters, numbers, and symbols allowed.",
    };
  }
  return { valid: true };
}

export const FIELD_VALIDATOR: Record<string, Validator> = {
  username: (v) => {
    if (v.length < 3)
      return { valid: false, message: "Must be at least 3 characters." };
    if (!/^[a-zA-Z0-9_.]+$/.test(v))
      return {
        valid: false,
        message: "Can only contain letters, numbers, underscores, and dots.",
      };
    return { valid: true };
  },

  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? { valid: true }
      : { valid: false, message: "Enter a valid email address." },

  password: (v) => validatePassword(v),

  confirm: (v, allValues) => {
    const password = allValues?.password ?? "";
    if (!validatePassword(password).valid)
      return { valid: false, message: "Please enter a valid password first." };
    if (v.length === 0)
      return { valid: false, message: "Please confirm your password." };
    return v === password
      ? { valid: true }
      : { valid: false, message: "Passwords do not match." };
  },
};
