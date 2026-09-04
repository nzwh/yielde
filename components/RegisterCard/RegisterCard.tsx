"use client";

import Link from "next/link";

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

export default function RegisterCard() {
  const { values, setField, submitting, formError, handleSubmit } =
    useRegisterForm();

  return (
    <div className="flex w-88 flex-col items-center rounded-xl bg-[#E8E8E8]">
      {/* Top lip */}
      <div
        className={cn(
          "text-[#737373]",
          "flex w-full items-center justify-between px-4 py-3 text-[0.625rem] font-medium uppercase",
          dmMono.className,
        )}
      >
        <h2>Registration</h2>
      </div>

      {/* Register Card */}
      <form
        className={cn(
          "border-[#D9D9D9] bg-[#F7F7F7]",
          "flex w-full flex-col items-center gap-4 rounded-xl border p-4",
          "shadow-[inset_0_0_0_2px_#fff]",
        )}
        onSubmit={handleSubmit}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
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
        />

        <Input
          id="confirm"
          name="confirm"
          type="password"
          label="Confirm Password"
          placeholder="********"
          icon={MdOutlineVpnKey}
          value={values.confirm}
          onChange={setField("confirm")}
          validate={FIELD_VALIDATOR.confirm}
          allValues={values}
          autoComplete="new-password"
        />

        {formError && (
          <p
            role="alert"
            aria-live="polite"
            className="text-center text-xs text-[#FF756A]"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "bg-[#798BFF] text-white hover:bg-[#3B4ACF]",
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
            "disabled:cursor-not-allowed disabled:bg-[#D9D9D9] disabled:text-[#737373]",
          )}
        >
          {submitting ? "Registering..." : "Register"}
        </button>

        {/* Terms and Conditions */}
        <div className="text-xxs flex w-full items-center justify-center gap-2 text-[#737373]">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="peer size-3 cursor-pointer appearance-none rounded-sm border border-slate-400 bg-white transition-all duration-200 ease-in-out checked:border-[#798BFF] checked:bg-[#798BFF] hover:border-[#798BFF] hover:bg-slate-50 hover:checked:border-[#3B4ACF] hover:checked:bg-[#3B4ACF]"
          />

          <label htmlFor="terms" className="cursor-pointer leading-normal">
            I agree to the{" "}
            <Link
              href="/terms"
              aria-label="Read the Terms of Service"
              className="hover:underline"
            >
              Terms of Service{" "}
            </Link>
            and{" "}
            <Link
              href="/privacy"
              aria-label="Read the Privacy Policy"
              className="hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>
      </form>

      {/* Bottom lip */}
      <div
        className={cn(
          "text-[#737373]",
          "flex w-full items-center justify-center gap-1 px-4 py-3 text-xs",
        )}
      >
        <p>Already have an account? </p>
        <Link
          href="/login"
          aria-label="Login to your account"
          className="hover:underline"
        >
          Log-in here
        </Link>
      </div>
    </div>
  );
}
