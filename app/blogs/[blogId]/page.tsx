import Link from "next/link";
import { notFound } from "next/navigation";
import BlogActions from "../../components/__organisms/BlogActions/BlogActions";
import { api, Blog, getAuthorId } from "../../lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BlogPageProps = {
  params: {
    blogId: string;
  };
};

async function getBlog(blogId: string) {
  try {
    const response = await api.get<Blog>(`/blogs/${blogId}`, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch {
    return null;
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

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await getBlog(params.blogId);
  if (!blog) notFound();

  const authorName =
    typeof blog.author === "object" ? blog.author.fullName ?? blog.author.email : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[630px] border-x border-[#dfddd8] bg-[#fbfaf8] px-4 py-12 dark:border-[#34332f] dark:bg-[#1c1c1a] md:px-5">
      <article className="grid gap-8">
        <Link
          className="w-fit text-sm font-bold text-[#56534f] dark:text-[#d1cec8]"
          href="/"
        >
          Back home
        </Link>
        <header className="grid gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#56534f] dark:text-[#d1cec8]">
            {formatDate(blog.createdAt)}
          </p>
          <h1 className="text-[34px] leading-tight font-black text-[#343331] dark:text-[#f5f3ee] sm:text-[42px]">
            {blog.title}
          </h1>
          <p className="text-lg leading-[1.6] text-[#56534f] dark:text-[#d1cec8]">
            {blog.description}
          </p>
          {authorName ? (
            <p className="text-sm font-bold text-[#56534f] dark:text-[#d1cec8]">
              By {authorName}
            </p>
          ) : getAuthorId(blog.author) ? (
            <p className="text-sm font-bold text-[#56534f] dark:text-[#d1cec8]">
              Author ID: {getAuthorId(blog.author)}
            </p>
          ) : null}
        </header>
        <BlogActions blog={blog} />
        <div className="whitespace-pre-wrap text-[17px] leading-[1.8] text-[#343331] dark:text-[#f5f3ee]">
          {blog.content}
        </div>
      </article>
    </main>
  );
}
