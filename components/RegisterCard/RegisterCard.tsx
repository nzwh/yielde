"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { dmMono } from "@/app/fonts";
import {
  MdPersonOutline,
  MdMailOutline,
  MdOutlineVpnKey,
} from "react-icons/md";

import { FIELD_VALIDATOR } from "./validator";
import { useRegisterForm } from "./useRegisterForm";

import { Input } from "@/components/global/Input";
import { Button } from "@/components/global/Button";
import { Badge } from "@/components/global/Badge";
import { Checkbox } from "../global/Checkbox";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { Logo } from "../global/Logo";

export default function RegisterCard() {
  const {
    values,
    confirm,
    terms,
    submitting,
    formError,
    setField,
    setConfirm,
    setTerms,
    handleSubmit,
  } = useRegisterForm();

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [errorShakeId, setErrorShakeId] = useState(0);
  const showMeter = isPasswordFocused && values.password.length > 0;

  return (
    <div className="flex w-full flex-col items-center rounded-xl bg-[#E8E8E8]">
      {/* Top lip */}
      <div
        className={cn(
          "text-[#737373]",
          "flex w-full items-center justify-between p-4 text-xs font-medium uppercase",
          dmMono.className,
        )}
      >
        <h2>Registration</h2>
        <Logo className="h-4 w-auto text-[#798BFF]" />
      </div>

      {/* Form */}
      <form
        className={cn(
          "border-[#D9D9D9] bg-[#F7F7F7]",
          "flex w-full flex-col items-center gap-4 rounded-xl border p-4",
          "shadow-[inset_0_0_0_2px_#fff]",
        )}
        onSubmit={async (e) => {
          setErrorShakeId((prev) => prev + 1);
          await handleSubmit(e);
        }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        noValidate
      >
        <h1
          className={cn(
            "text-[#2A2A2A]",
            "w-full py-2 text-center text-2xl font-light",
          )}
        >
          Register for an account.
        </h1>

        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="your-name"
          icon={MdPersonOutline}
          value={values.username}
          onChange={setField("username")}
          validate={FIELD_VALIDATOR.username}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@acme.co"
          icon={MdMailOutline}
          value={values.email}
          onChange={setField("email")}
          validate={FIELD_VALIDATOR.email}
        />

        <div className={cn("flex w-full flex-col", showMeter && "gap-2")}>
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="********"
            icon={MdOutlineVpnKey}
            value={values.password}
            onChange={setField("password")}
            validate={FIELD_VALIDATOR.password}
            onFocusChange={setIsPasswordFocused}
          />
          <div
            className={cn(
              "grid w-full transition-[grid-template-rows,margin] duration-200 ease-out",
              isPasswordFocused && values.password.length > 0
                ? "grid-rows-[1fr]"
                : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <PasswordStrengthMeter
                value={values.password}
                active={isPasswordFocused && values.password.length > 0}
              />
            </div>
          </div>
        </div>

        <Input
          id="confirm"
          name="confirm"
          type="password"
          label="Confirm Password"
          placeholder="********"
          icon={MdOutlineVpnKey}
          value={confirm}
          onChange={setConfirm}
          validate={FIELD_VALIDATOR.confirm}
          allValues={values}
          autoComplete="new-password"
        />

        {/* Error */}
        {formError && (
          <p
            key={errorShakeId}
            role="alert"
            aria-live="polite"
            className="animate-shake text-center text-xs font-medium text-[#FF756A] will-change-transform"
          >
            {formError}
          </p>
        )}

        {/* Submit */}
        <Button
          submitting={submitting}
          setIsHovered={setIsButtonHovered}
          isHovered={isButtonHovered}
        />

        {/* T&C */}
        <div className="text-xxs flex items-center justify-center gap-2 text-[#737373]">
          <Checkbox
            id="terms"
            name="terms"
            checked={terms}
            onChange={setTerms}
          />
          <label htmlFor="terms" className="cursor-pointer leading-normal">
            I agree to the
            <Badge href="/terms" aria-label="Read the Terms of Service">
              Terms of Service
            </Badge>
            and
            <Badge href="/privacy" aria-label="Read the Privacy Policy">
              Privacy Policy
            </Badge>
          </label>
        </div>
      </form>

      {/* Bottom lip */}
      <p className="px-4 py-3 text-xs text-[#737373]">
        Already have an account?
        <Badge href="/login" aria-label="Login to your account">
          Log-in here
        </Badge>
      </p>
    </div>
  );
}
