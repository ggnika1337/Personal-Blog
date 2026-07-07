import Link from "next/link";
import NavBar from "./components/__atoms/NavBar/NavBar";
import EmptyArticles from "./components/__atoms/noArticles/noArticles";
import { api, Blog, BlogsResponse, getBlogId } from "./lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const linkUnderline =
  "bg-linear-to-r from-[#93cfea] to-[#93cfea] bg-[length:100%_3px] bg-left-bottom bg-no-repeat dark:from-[#74bfe7] dark:to-[#74bfe7]";

async function getBlogs() {
  try {
    const response = await api.get<BlogsResponse>("/blogs", {
      timeout: 2500,
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }

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

function BlogHero({ featuredBlog }: Readonly<{ featuredBlog?: Blog }>) {
  return (
    <section
      className="border-b border-[#dfddd8] pb-12 dark:border-[#34332f]"
      aria-labelledby="hero-title"
    >
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-[#56534f] dark:text-[#d1cec8]">
        Personal Blog
      </p>
      <h1
        id="hero-title"
        className="mb-[26px] w-fit text-[32px] leading-[1.05] font-black tracking-normal text-[#343331] dark:text-[#f5f3ee] sm:text-[38px]"
      >
        Latest writing from the blog
      </h1>

      {featuredBlog ? (
        <Link
          className="block max-w-[570px] rounded-[10px] border border-[#dfddd8] bg-white p-4 text-[#343331] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(44,43,40,0.08)] dark:border-[#34332f] dark:bg-[#20201d] dark:text-[#f5f3ee]"
          href={`/blogs/${getBlogId(featuredBlog)}`}
        >
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-[#56534f] dark:text-[#d1cec8]">
            Featured
          </span>
          <strong className="block text-[21px] leading-tight">
            {featuredBlog.title}
          </strong>
          {featuredBlog.description ? (
            <span className="mt-3 line-clamp-2 block text-base leading-[1.55] text-[#56534f] dark:text-[#d1cec8]">
              {featuredBlog.description}
            </span>
          ) : null}
        </Link>
      ) : null}
    </section>
  );
}

function ArticleItem({ blog }: Readonly<{ blog: Blog }>) {
  return (
    <article className="grid gap-2">
      <Link
        className="max-w-[580px] text-[19px] leading-tight font-extrabold text-[#343331] hover:text-black dark:text-[#f5f3ee] dark:hover:text-white"
        href={`/blogs/${getBlogId(blog)}`}
      >
        {blog.title}
      </Link>
      {blog.description ? (
        <p className="max-w-[580px] text-base leading-[1.55] text-[#56534f] dark:text-[#d1cec8]">
          {blog.description}
        </p>
      ) : null}
      <time
        className="text-base italic text-[#56534f] dark:text-[#d1cec8]"
        dateTime={blog.createdAt}
      >
        {formatDate(blog.createdAt)}
      </time>
    </article>
  );
}

function ArticleList({ blogs }: Readonly<{ blogs: Blog[] }>) {
  return (
    <section
      className="border-b border-[#dfddd8] py-12 dark:border-[#34332f] sm:pt-[50px]"
      id="blog"
      aria-labelledby="articles-title"
    >
      <h2
        id="articles-title"
        className="mb-[34px] flex items-center gap-3.5 text-[30px] leading-[1.1] font-black tracking-normal text-[#343331] dark:text-[#f5f3ee] sm:text-[38px]"
      >
        Latest Articles
        <span
          className="inline-block h-[3px] w-[39px] bg-[#93cfea] dark:bg-[#74bfe7]"
          aria-hidden="true"
        />
      </h2>

      {blogs.length ? (
        <div className="mb-9 grid gap-[26px]">
          {blogs.map((blog, index) => (
            <ArticleItem
              key={blog._id ?? blog.id ?? `${blog.title}-${index}`}
              blog={blog}
            />
          ))}
        </div>
      ) : (
        <EmptyArticles />
      )}

      <Link
        className={`mt-9 inline-block text-[17px] leading-[1.4] text-[#343331] hover:text-black dark:text-[#f5f3ee] dark:hover:text-white ${linkUnderline}`}
        href="/blogs"
      >
        View all articles
      </Link>
    </section>
  );
}

export default async function Home() {
  const blogs = await getBlogs();
  const featuredBlog = blogs[0];

  return (
    <main className="relative z-1 mx-auto min-h-screen w-full max-w-[430px] border-x border-[#dfddd8] bg-[#fbfaf8] dark:border-[#34332f] dark:bg-[#1c1c1a] md:max-w-[630px]">
      <div
        className="pointer-events-none fixed top-[37%] left-[58px] z-0 size-[136px] rotate-45 border border-[#ebe8e2]/50 dark:border-[#2b2b28]/50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-[15%] right-20 z-0 size-[136px] rotate-45 border border-[#ebe8e2]/50 dark:border-[#2b2b28]/50"
        aria-hidden="true"
      />
      <NavBar />
      <div className="px-4 pt-[42px] md:px-5 md:pt-14">
        <BlogHero featuredBlog={featuredBlog} />
        <ArticleList blogs={blogs} />
      </div>
    </main>
  );
}
