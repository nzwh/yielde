"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { dmMono } from "@/app/fonts";
import { MdMailOutline, MdOutlineVpnKey } from "react-icons/md";

import { useLoginForm } from "./useLoginForm";

import { Input } from "@/components/global/Input";
import { Button } from "@/components/global/Button";
import { Badge } from "@/components/global/Badge";
import { Logo } from "../global/Logo";

export default function LoginCard() {
  const { values, submitting, formError, setField, handleSubmit } =
    useLoginForm();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [errorShakeId, setErrorShakeId] = useState(0);

  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

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
        <h2>Log In</h2>
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
          Welcome back.
        </h1>

        {justRegistered && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-xs font-medium text-[#42DD61]"
          >
            Account created! Please log in.
          </p>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@acme.co"
          icon={MdMailOutline}
          value={values.email}
          onChange={setField("email")}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="********"
          icon={MdOutlineVpnKey}
          value={values.password}
          onChange={setField("password")}
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
          label="Log in"
          submittingLabel="Logging in..."
        />
      </form>

      {/* Bottom lip */}
      <p className="px-4 py-3 text-xs text-[#737373]">
        Don&apos;t have an account?
        <Badge href="/register" aria-label="Create an account">
          Register here
        </Badge>
      </p>
    </div>
  );
}
