type LogoProps = {
  className?: string;
  wordmarkClassName?: string;
};

export default function Logo({
  className = "",
  wordmarkClassName = "",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="h-9 w-9 shrink-0"
      >
        {/* T */}
        <path
          d="M15 15H75V28H50V72C50 82 45 87 35 87H30V28H15V15Z"
          fill="#0F172A"
        />

        {/* G */}
        <path
          d="M72 42C72 31 64 24 52 24C38 24 28 35 28 50C28 65 38 76 53 76C64 76 72 71 77 63V53H56V42H89V68C82 80 69 88 53 88C31 88 15 72 15 50C15 28 31 12 53 12C71 12 86 24 88 42H72Z"
          fill="#F97316"
        />
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
