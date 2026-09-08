import { useState, useRef, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

export type LoginValues = {
  email: string;
  password: string;
};

export function useLoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  function setField(name: keyof LoginValues) {
    return (value: string) => setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    setFormError(null);

    if (!values.email || !values.password) {
      setFormError("Please enter your email and password.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(data?.message ?? "Login failed. Please try again.");
        return;
      }

      router.push("/");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setFormError("A network error occurred. Please check your connection.");
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return { values, setField, submitting, formError, handleSubmit };
}
