import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  switchHref,
  switchLabel,
  children,
}: AuthShellProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[630px] border-x border-[#dfddd8] bg-[#fbfaf8] px-4 py-12 dark:border-[#34332f] dark:bg-[#1c1c1a] md:px-5">
      <section className="mx-auto grid max-w-[520px] gap-8 rounded-[10px] border border-[#dfddd8] bg-white p-5 dark:border-[#34332f] dark:bg-[#20201d]">
        <div className="grid gap-3">
          <Link
            className="text-sm font-bold text-[#56534f] dark:text-[#d1cec8]"
            href="/"
          >
            Back home
          </Link>
          <h1 className="text-[32px] leading-tight font-black text-[#343331] dark:text-[#f5f3ee]">
            {title}
          </h1>
          <p className="text-base leading-[1.6] text-[#56534f] dark:text-[#d1cec8]">
            {subtitle}
          </p>
        </div>
        {children}
        <Link
          className="w-fit bg-linear-to-r from-[#93cfea] to-[#93cfea] bg-[length:100%_3px] bg-left-bottom bg-no-repeat text-sm font-bold text-[#343331] dark:from-[#74bfe7] dark:to-[#74bfe7] dark:text-[#f5f3ee]"
          href={switchHref}
        >
          {switchLabel}
        </Link>
      </section>
    </main>
  );
}
