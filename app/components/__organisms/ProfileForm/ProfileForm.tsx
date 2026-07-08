"use client";

import axios from "axios";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import FormInput from "../../__atoms/FormInput/FormInput";
import SubmitButton from "../../__atoms/SubmitButton/SubmitButton";
import { api, authHeaders, getMediaUrl, User } from "../../../lib/api";
import { getToken } from "../../../lib/auth";

function getAvatar(user: User | null) {
  if (!user?.profileAvatar?.imageUrl) return "";

  return getMediaUrl(user.profileAvatar.imageUrl);
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Profile request failed";
  }

  return "Profile request failed";
}

export default function ProfileForm() {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const token = getToken();

    setHasToken(Boolean(token));

    if (!token) return;

    api
      .get<User>("/auth/current-user", { headers: authHeaders(token) })
      .then((response) => setUser(response.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const token = getToken();

    if (!token || !user) {
      setError("Sign in first.");
      return;
    }

    setPending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await api.put<{ updatedUser: User }>(
        `/users/${user._id}`,
        formData,
        {
          headers: {
            ...authHeaders(token),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUser(response.data.updatedUser);
      setMessage("Profile updated.");
      form.reset();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  if (hasToken === null) {
    return null;
  }

  if (!hasToken) {
    return (
      <section className="grid gap-8">
        <p className="rounded-[10px] border border-dashed border-[#dfddd8] p-5 font-bold text-[#343331] dark:border-[#34332f] dark:text-[#f5f3ee]">
          Sign in first.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-8">
      <div className="flex items-center gap-4">
        <div className="grid size-20 place-items-center overflow-hidden rounded-[10px] border border-[#dfddd8] bg-white text-lg font-black dark:border-[#34332f] dark:bg-[#20201d]">
          {user?.profileAvatar?.imageUrl ? (
            <Image
              src={getMediaUrl(user.profileAvatar.imageUrl)}
              alt="Profile avatar"
              width={38}
              height={38}
              className="size-full object-cover"
            />
          ) : (
            <span>{user?.fullName?.charAt(0) ?? "U"}</span>
          )}
        </div>

        <div>
          <h1 className="text-[32px] leading-tight font-black text-[#343331] dark:text-[#f5f3ee]">
            Profile
          </h1>
          <p className="text-sm text-[#56534f] dark:text-[#d1cec8]">
            {user?.email ?? "Your account"}
          </p>
        </div>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <FormInput
          defaultValue={user?.fullName}
          label="Full name"
          name="fullName"
        />

        <FormInput
          defaultValue={user?.age}
          label="Age"
          min={1}
          name="age"
          type="number"
        />

        <FormInput
          defaultValue={user?.birthDate?.slice(0, 10)}
          label="Birth date"
          name="birthDate"
          type="date"
        />

        <FormInput
          accept="image/*"
          label="Profile picture"
          name="profileAvatar"
          type="file"
        />

        {message ? (
          <p className="text-sm font-bold text-green-600">{message}</p>
        ) : null}

        {error ? (
          <p className="text-sm font-bold text-red-500">{error}</p>
        ) : null}

        <SubmitButton pending={pending}>Save profile</SubmitButton>
      </form>
    </section>
  );
}
