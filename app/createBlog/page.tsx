import Link from "next/link";
import BlogForm from "../components/__organisms/BlogForm/BlogForm";

export default function CreateBlogPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[630px] border-x border-[#dfddd8] bg-[#fbfaf8] px-4 py-12 dark:border-[#34332f] dark:bg-[#1c1c1a] md:px-5">
      <section className="grid gap-8">
        <div className="grid gap-3">
          <Link
            className="text-sm font-bold text-[#56534f] dark:text-[#d1cec8]"
            href="/"
          >
            Back home
          </Link>
          <h1 className="text-[32px] leading-tight font-black text-[#343331] dark:text-[#f5f3ee]">
            Create blog
          </h1>
        </div>
        <BlogForm mode="create" />
      </section>
    </main>
  );
}
