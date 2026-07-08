"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "../../../lib/auth";
import Image from "next/image";
import { api, authHeaders, getMediaUrl, User } from "../../../lib/api";

const links = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/#blog" },
  { label: "Create", href: "/createBlog" },
  { label: "Profile", href: "/profile" },
];
const linkUnderline =
  "bg-linear-to-r from-[#93cfea] to-[#93cfea] bg-[length:100%_3px] bg-left-bottom bg-no-repeat dark:from-[#74bfe7] dark:to-[#74bfe7]";

function getInitialTheme() {
  if (typeof window === "undefined") return false;

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme) return savedTheme === "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function NavBar() {
  const [isDark, setIsDark] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");

    const token = getToken();

    setHasToken(Boolean(token));

    if (!token) return;

    api
      .get<User>("/auth/current-user", {
        headers: authHeaders(token),
      })
      .then((res) => setUser(res.data));
  }, [isDark]);

  function handleSignOut() {
    clearToken();
    setHasToken(false);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-3 z-10 mx-auto mt-5 grid min-h-12 w-[calc(100%-24px)] max-w-[620px] grid-cols-[auto_auto] items-center justify-between gap-5 rounded-xl border border-[#dfddd8] bg-[#fbfaf8]/90 px-[5px] py-1 shadow-[0_8px_24px_rgba(44,43,40,0.08)] backdrop-blur dark:border-[#34332f] dark:bg-[#1c1c1a]/90 dark:shadow-none md:top-5 md:w-[calc(100%-16px)] md:grid-cols-[auto_1fr_auto]">
      <Link
        className="grid size-[38px] place-items-center overflow-hidden rounded-[10px] border border-[#dfddd8] bg-linear-to-br from-[#e8c9a6] via-[#9bbd9a] to-[#5f6f5d] text-xs font-extrabold text-[#fffdf7] dark:border-[#34332f]"
        href="/"
        aria-label="Blog home"
      >
        {user?.profileAvatar?.imageUrl ? (
          <Image
            src={getMediaUrl(user.profileAvatar.imageUrl)}
            alt="Profile avatar"
            width={38}
            height={38}
            className="size-full object-cover"
          />
        ) : (
          <span>B</span>
        )}
      </Link>

      <nav
        className="hidden items-center justify-end gap-5 text-[15px] text-[#56534f] dark:text-[#d1cec8] md:flex"
        aria-label="Primary navigation"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            className={
              link.label === "Home"
                ? `${linkUnderline} text-[#343331] dark:text-[#f5f3ee]`
                : "hover:text-[#343331] dark:hover:text-[#f5f3ee]"
            }
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
        {hasToken ? (
          <button
            className="hover:text-[#343331] dark:hover:text-[#f5f3ee]"
            onClick={handleSignOut}
            type="button"
          >
            Sign out
          </button>
        ) : (
          <Link
            className="hover:text-[#343331] dark:hover:text-[#f5f3ee]"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        )}
      </nav>

      <button
        className="grid size-[39px] cursor-pointer place-items-center rounded-[10px] border border-[#dfddd8] bg-white text-[#343331] dark:border-[#34332f] dark:bg-[#20201d] dark:text-[#f5f3ee]"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        type="button"
        onClick={() => setIsDark((currentTheme) => !currentTheme)}
      >
        {isDark ? (
          <Sun size={18} strokeWidth={2} />
        ) : (
          <Moon size={18} strokeWidth={2} />
        )}
      </button>
    </header>
  );
}
