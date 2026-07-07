type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
};

export default function SubmitButton({ children, pending, className = "", ...props }: SubmitButtonProps) {
  return (
    <button
      className={`rounded-[10px] bg-[#343331] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#f5f3ee] dark:text-[#191917] dark:hover:bg-white ${className}`}
      disabled={pending || props.disabled}
      type="submit"
      {...props}
    >
      {pending ? "Working..." : children}
    </button>
  );
}
