"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, authHeaders, Blog, getAuthorId, getBlogId, User } from "../../../lib/api";
import { getToken } from "../../../lib/auth";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Action failed";
  }

  return "Action failed";
}

export default function BlogActions({ blog }: Readonly<{ blog: Blog }>) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  const blogId = getBlogId(blog);
  const authorId = getAuthorId(blog.author);
  const canManage =
    currentUser && (currentUser._id === authorId || currentUser.role === "admin");

  async function handleDelete() {
    const token = getToken();
    if (!token) {
      setError("Sign in first.");
      return;
    }

    setError("");
    setPending(true);

    try {
      await api.delete(`/blogs/${blogId}`, { headers: authHeaders(token) });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  if (!canManage) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-[#dfddd8] py-5 dark:border-[#34332f]">
      <Link
        className="rounded-[10px] border border-[#dfddd8] bg-white px-4 py-2 text-sm font-extrabold text-[#343331] dark:border-[#34332f] dark:bg-[#20201d] dark:text-[#f5f3ee]"
        href={`/blogs/${blogId}/edit`}
      >
        Edit
      </Link>
      <button
        className="rounded-[10px] bg-red-600 px-4 py-2 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        onClick={handleDelete}
        type="button"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {error ? <p className="text-sm font-bold text-red-500">{error}</p> : null}
    </div>
  );
}
