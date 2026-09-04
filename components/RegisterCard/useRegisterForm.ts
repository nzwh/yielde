import { SubmitEvent, useState } from "react";
import { FIELD_VALIDATOR } from "./validator";

export interface RegisterValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
  [key: string]: string;
}

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterValues>({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function setField(name: keyof RegisterValues) {
    return (value: string) => setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const results = Object.entries(FIELD_VALIDATOR).map(([key, fn]) =>
      fn(values[key as keyof RegisterValues], values),
    );
    if (results.some((r) => !r.valid)) return;

    setSubmitting(true);

    try {
      const { confirm, ...payload } = values;
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.message ?? "Registration failed.");
        return;
      }
    } finally {
      setSubmitting(false);
    }
  }

  return { values, setField, submitting, formError, handleSubmit };
}
