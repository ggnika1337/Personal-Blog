import Link from "next/link";
import { api, Blog, BlogsResponse, getBlogId } from "../lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBlogs() {
  try {
    const response = await api.get<BlogsResponse>("/blogs", {
      headers: { "Cache-Control": "no-store" },
    });

    if (Array.isArray(response.data)) return response.data;
    return response.data.data ?? response.data.blogs ?? [];
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

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
          <h1 className="text-[34px] leading-tight font-black text-[#343331] dark:text-[#f5f3ee]">
            All articles
          </h1>
        </div>

        {blogs.length ? (
          <div className="grid gap-6">
            {blogs.map((blog: Blog) => (
              <article className="grid gap-2" key={getBlogId(blog)}>
                <Link
                  className="text-[21px] leading-tight font-extrabold text-[#343331] hover:text-black dark:text-[#f5f3ee] dark:hover:text-white"
                  href={`/blogs/${getBlogId(blog)}`}
                >
                  {blog.title}
                </Link>
                <p className="text-base leading-[1.55] text-[#56534f] dark:text-[#d1cec8]">
                  {blog.description}
                </p>
                <time className="text-sm italic text-[#56534f] dark:text-[#d1cec8]">
                  {formatDate(blog.createdAt)}
                </time>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-[10px] border border-dashed border-[#dfddd8] p-5 font-bold text-[#343331] dark:border-[#34332f] dark:text-[#f5f3ee]">
            No articles yet.
          </p>
        )}
      </section>
    </main>
  );
}
