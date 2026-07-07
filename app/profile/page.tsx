import Link from "next/link";
import ProfileForm from "../components/__organisms/ProfileForm/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[630px] border-x border-[#dfddd8] bg-[#fbfaf8] px-4 py-12 dark:border-[#34332f] dark:bg-[#1c1c1a] md:px-5">
      <section className="grid gap-8">
        <Link
          className="w-fit text-sm font-bold text-[#56534f] dark:text-[#d1cec8]"
          href="/"
        >
          Back home
        </Link>
        <ProfileForm />
      </section>
    </main>
  );
}
