import Image from "next/image";

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
      <Image
        src="/logo.png"
        alt="TonerGelsin"
        width={42}
        height={42}
        className="h-9 w-9 shrink-0 object-contain"
        priority
      />

      <span
        className={`text-xl font-black tracking-tight ${wordmarkClassName}`}
      >
        TonerGelsin
      </span>

      <span className="sr-only">TonerGelsin</span>
    </span>
  );
}
