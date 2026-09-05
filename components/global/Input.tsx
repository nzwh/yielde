"use client";

import { cn } from "@/lib/utils";
import React, {
  ChangeEvent,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md";

import {
  FIELD_VALIDATOR,
  ValidationResult,
  Validator,
} from "../RegisterCard/validator";
import { RegisterValues } from "../RegisterCard/useRegisterForm";

function handleToggle(con: boolean) {
  return con ? "scale-100 opacity-100" : "scale-90 opacity-0";
}

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  id: string;
  value: string;
  type: "text" | "email" | "password";

  label: string;
  required?: boolean;

  icon?: React.ComponentType<{ className?: string }>;

  onChange: (value: string) => void;
  // for handling focus state (password strength meter)
  onFocusChange?: (focused: boolean) => void;
  validate?: Validator;
  // for cross-field validation (confirm password)
  allValues?: Partial<RegisterValues>;
}

export function Input({
  id,
  value,
  type,

  label,
  required = true,

  icon: Icon,

  onChange,
  onFocusChange,
  validate,
  allValues,

  ...native
}: InputProps) {
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<ValidationResult>({ valid: true });
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  useEffect(() => {
    if (touched && validate === FIELD_VALIDATOR.confirm) {
      updateResult(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValues?.password]);

  function updateResult(next: string) {
    if (!validate) return;
    const nextResult = validate(next, allValues);
    setResult((prev) => ({
      ...nextResult,
      message: nextResult.message ?? prev.message,
    }));
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    onChange(next);
    setTouched(true);
    updateResult(next);
  }

  function handleBlur() {
    setTouched(true);
    updateResult(value);
    onFocusChange?.(false);
  }

  function handleFocus() {
    onFocusChange?.(true);
  }

  const showStatus = touched && !!validate;
  const showError = showStatus && !result.valid && !!result.message;
  const showStatusIcon = showStatus;

  return (
    <div className="flex w-full flex-col gap-1 transition-all duration-150">
      {/* Label and Error Message */}
      <div className="flex items-end justify-between text-xs font-medium">
        <label htmlFor={id} className="text-[#454545]">
          {label}
          {required && <span className="text-[#FF756A]">*</span>}
        </label>
        <p
          id={`${id}-error`}
          className={cn(
            "text-right text-[#FF756A] transition-all duration-200 ease-in",
            !showError && "pointer-events-none opacity-0",
          )}
        >
          {result.message}
        </p>
      </div>

      {/* Input Field */}
      <div className="relative">
        {Icon && (
          <Icon className="absolute top-1/2 left-3 -translate-y-1/2 text-[#737373]" />
        )}
        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          aria-invalid={showStatus ? !result.valid : undefined}
          aria-describedby={showError ? `${id}-error` : undefined}
          className={cn(
            "border-[#EDEDED] bg-white placeholder:text-[#B7B7B7] focus:ring-[#8290EF]",
            "w-full rounded-lg border py-2 text-sm transition focus:ring-1 focus:outline-none",
            isPassword ? "pr-16" : "pr-9",
            Icon ? "pl-9" : "pl-3",
          )}
          {...native}
        />

        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
          <div className="relative size-4">
            <MdCheckCircleOutline
              aria-hidden="true"
              className={cn(
                "absolute inset-0 text-[#42DD61] transition-all duration-200 ease-out",
                handleToggle(showStatusIcon && result.valid),
              )}
            />
            <MdErrorOutline
              aria-hidden="true"
              className={cn(
                "absolute inset-0 text-[#FF756A] transition-all duration-200 ease-out",
                handleToggle(showStatusIcon && !result.valid),
              )}
            />
          </div>

          {isPassword && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={cn(
                "text-[#737373] hover:text-[#454545] focus-visible:ring-[#8290EF]",
                "cursor-pointer rounded-sm focus-visible:ring-1 focus-visible:ring-offset-3 focus-visible:outline-none",
              )}
            >
              <div className="relative size-4">
                <FiEye
                  size={16}
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 transition-all duration-200 ease-out",
                    handleToggle(showPassword),
                  )}
                />
                <FiEyeOff
                  size={16}
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 transition-all duration-200 ease-out",
                    handleToggle(!showPassword),
                  )}
                />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
