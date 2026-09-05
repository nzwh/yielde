import { useRef, useState, type SubmitEvent } from "react";
import { FIELD_VALIDATOR } from "./validator";
import { useRouter } from "next/navigation";

export type RegisterValues = {
  username: string;
  email: string;
  password: string;
  confirm: string;
};

export function useRegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterValues>({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submittingRef = useRef(false);

  function setField(name: keyof RegisterValues) {
    return (value: string) => setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    setFormError(null);

    const results = Object.entries(FIELD_VALIDATOR).map(([key, fn]) =>
      fn(values[key as keyof RegisterValues], values),
    );

    if (results.some((r) => !r.valid)) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    const controller = new AbortController();

    try {
      const { confirm, ...payload } = values;
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(data?.message ?? "Registration failed. Please try again.");
        return;
      }

      router.push("/login?registered=true");
    } catch (err) {
      if ((err as Error).name !== "AbortError")
        setFormError("A network error occurred. Please check your connection.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return { values, setField, submitting, formError, handleSubmit };
}
