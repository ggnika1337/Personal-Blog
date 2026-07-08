"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import FormInput from "../../__atoms/FormInput/FormInput";
import FormTextarea from "../../__atoms/FormTextarea/FormTextarea";
import SubmitButton from "../../__atoms/SubmitButton/SubmitButton";
import {
  api,
  authHeaders,
  Blog,
  getAuthorId,
  getBlogId,
  User,
} from "../../../lib/api";
import { getToken } from "../../../lib/auth";

type BlogFormProps = {
  mode: "create" | "edit";
  blog?: Blog;
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Blog request failed";
  }

  return "Blog request failed";
}

export default function BlogForm({ mode, blog }: BlogFormProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    () => (getToken() ? undefined : null),
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    api
      .get<User>("/auth/current-user", { headers: authHeaders(token) })
      .then((response) => setCurrentUser(response.data))
      .catch(() => setCurrentUser(null));
  }, []);

  const isCheckingOwner = mode === "edit" && currentUser === undefined;
  const canEdit =
    mode !== "edit" ||
    !blog ||
    (currentUser &&
      (currentUser._id === getAuthorId(blog.author) ||
        currentUser.role === "admin"));

  if (isCheckingOwner) {
    return (
      <p className="rounded-[10px] border border-dashed border-[#dfddd8] p-5 font-bold text-[#343331] dark:border-[#34332f] dark:text-[#f5f3ee]">
        Checking permissions...
      </p>
    );
  }

  if (!canEdit) {
    return (
      <p className="rounded-[10px] border border-dashed border-[#dfddd8] p-5 font-bold text-[#343331] dark:border-[#34332f] dark:text-[#f5f3ee]">
        Only the blog owner can edit this post.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const token = getToken();
    if (!token) {
      setError("Sign in first.");
      setPending(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      content: formData.get("content"),
    };

    try {
      if (mode === "edit" && blog) {
        await api.put(`/blogs/${getBlogId(blog)}`, payload, {
          headers: authHeaders(token),
        });
        router.push(`/blogs`);
      } else {
        const response = await api.post<{ data?: Blog }>("/blogs", payload, {
          headers: authHeaders(token),
        });
        const createdId = response.data.data ? getBlogId(response.data.data) : "";
        router.push(createdId ? `/blogs/${createdId}` : "/");
      }

      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <FormInput
        defaultValue={blog?.title}
        label="Title"
        name="title"
        required
      />
      <FormTextarea
        defaultValue={blog?.description}
        label="Description"
        name="description"
        required
      />
      <FormTextarea
        className="min-h-64"
        defaultValue={blog?.content}
        label="Content"
        name="content"
        required
      />
      {error ? <p className="text-sm font-bold text-red-500">{error}</p> : null}
      <SubmitButton pending={pending}>
        {mode === "edit" ? "Save changes" : "Create blog"}
      </SubmitButton>
    </form>
  );
}
