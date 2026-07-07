type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export default function FormTextarea({
  label,
  id,
  className = "",
  ...props
}: FormTextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label
      className="grid gap-2 text-sm font-bold text-[#343331] dark:text-[#f5f3ee]"
      htmlFor={inputId}
    >
      {label}
      <textarea
        id={inputId}
        className={`min-h-32 rounded-[10px] border border-[#dfddd8] bg-white px-4 py-3 text-base font-normal text-[#343331] outline-none transition focus:border-[#93cfea] dark:border-[#34332f] dark:bg-[#20201d] dark:text-[#f5f3ee] ${className}`}
        {...props}
      />
    </label>
  );
}
