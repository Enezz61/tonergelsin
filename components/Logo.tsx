type LogoProps = {
  className?: string;
  wordmarkClassName?: string;
};

export default function Logo({ className = "", wordmarkClassName = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 42 42" className="h-9 w-9 shrink-0" fill="none">
        <rect width="42" height="42" rx="10" className="fill-orange-500" />
        <path
          d="M12 13.5h18c2.8 0 5 2.2 5 5v8.5h-6.2v4.2H13.2V27H7v-8.5c0-2.8 2.2-5 5-5Z"
          className="fill-white"
        />
        <path
          d="M15 9.5h12v6H15v-6ZM15.8 23.5h10.4v4.8H15.8v-4.8Z"
          className="fill-slate-950"
        />
        <circle cx="31" cy="19" r="1.7" className="fill-orange-500" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 184 36"
        className={`h-8 w-[164px] shrink-0 ${wordmarkClassName}`}
      >
        <text
          x="0"
          y="27"
          className="fill-current text-[28px] font-black"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          TonerGelsin
        </text>
      </svg>
      <span className="sr-only">TonerGelsin</span>
    </span>
  );
}
