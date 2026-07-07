import Link from "next/link";
import { notFound } from "next/navigation";
import BlogForm from "../../../components/__organisms/BlogForm/BlogForm";
import { api, Blog, getBlogId } from "../../../lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditBlogPageProps = {
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

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const blog = await getBlog(params.blogId);
  if (!blog) notFound();

  return (
    <main className="mx-auto min-h-screen w-full max-w-[630px] border-x border-[#dfddd8] bg-[#fbfaf8] px-4 py-12 dark:border-[#34332f] dark:bg-[#1c1c1a] md:px-5">
      <section className="grid gap-8">
        <div className="grid gap-3">
          <Link
            className="text-sm font-bold text-[#56534f] dark:text-[#d1cec8]"
            href={`/blogs/${getBlogId(blog)}`}
          >
            Back to blog
          </Link>
          <h1 className="text-[32px] leading-tight font-black text-[#343331] dark:text-[#f5f3ee]">
            Edit blog
          </h1>
        </div>
        <BlogForm blog={blog} mode="edit" />
      </section>
    </main>
  );
}
