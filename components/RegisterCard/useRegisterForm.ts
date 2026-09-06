import { useRef, useState, type SubmitEvent } from "react";
import { FIELD_VALIDATOR } from "./validator";
import { useRouter } from "next/navigation";

export type RegisterValues = {
  username: string;
  email: string;
  password: string;
};

export function useRegisterForm() {
  const router = useRouter();

  const [values, setValues] = useState<RegisterValues>({
    username: "",
    email: "",
    password: "",
  });
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  function setField<K extends keyof RegisterValues>(name: K) {
    return (value: RegisterValues[K]) =>
      setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    setFormError(null);

    const results = (
      Object.keys(FIELD_VALIDATOR) as Array<keyof typeof FIELD_VALIDATOR>
    ).map((key) => {
      if (key === "confirm") return FIELD_VALIDATOR.confirm(confirm, values);
      return FIELD_VALIDATOR[key](values[key as keyof RegisterValues]);
    });

    if (results.some((r) => !r.valid)) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    if (!terms) {
      setFormError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(data?.message ?? "Registration failed. Please try again.");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setFormError("A network error occurred. Please check your connection.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return {
    values,
    confirm,
    terms,
    setField,
    setConfirm,
    setTerms,
    submitting,
    formError,
    handleSubmit,
  };
}
