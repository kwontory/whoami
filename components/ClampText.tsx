"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  text: string;
  className?: string;
};

/**
 * 폰(640px 미만)에서만 3줄로 줄이고, 실제로 잘렸을 때만 "더 보기" 버튼을 보여주는 문단.
 * 640px 이상에서는 항상 전체 문장을 보여줍니다.
 */
export default function ClampText({ text, className = "" }: Props) {
  const id = useId();
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <p ref={ref} id={id} className={`${className} ${open ? "" : "max-sm:line-clamp-3"}`}>
        {text}
      </p>
      {(clamped || open) && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
          className="-my-2 -ml-1 min-h-11 self-start px-1 font-mono text-[13px] text-green sm:hidden"
        >
          {open ? "접기" : "더 보기"}
        </button>
      )}
    </div>
  );
}
