"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import FormInput from "../../__atoms/FormInput/FormInput";
import SubmitButton from "../../__atoms/SubmitButton/SubmitButton";
import { api } from "../../../lib/api";
import { setToken } from "../../../lib/auth";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await api.post<{ accessToken: string }>("/auth/sign-in", {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      setToken(response.data.accessToken);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, "Could not sign in"));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <FormInput label="Email" name="email" type="email" required />
      <FormInput label="Password" name="password" type="password" required />
      {error ? <p className="text-sm font-bold text-red-500">{error}</p> : null}
      <SubmitButton pending={pending}>Sign in</SubmitButton>
    </form>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      await api.post("/auth/sign-up", {
        fullName: formData.get("fullName"),
        age: Number(formData.get("age")),
        email: formData.get("email"),
        password: formData.get("password"),
        birthDate: formData.get("birthDate"),
      });

      router.push("/auth/sign-in");
    } catch (err) {
      setError(getErrorMessage(err, "Could not sign up"));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <FormInput label="Full name" name="fullName" required />
      <FormInput label="Age" min={1} name="age" type="number" required />
      <FormInput label="Birth date" name="birthDate" type="date" required />
      <FormInput label="Email" name="email" type="email" required />
      <FormInput label="Password" name="password" type="password" required />
      {error ? <p className="text-sm font-bold text-red-500">{error}</p> : null}
      <SubmitButton pending={pending}>Create account</SubmitButton>
    </form>
  );
}
