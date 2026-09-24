"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

/**
 * 화면에 들어오면 data-visible="true"를 붙이는 <li>.
 * 실제 등장 효과(카드 페이드인, 점 점등)는 globals.css에서 이 속성을 보고 처리합니다.
 */
export default function RevealItem({ className, children }: Props) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li ref={ref} data-visible={visible} className={className}>
      {children}
    </li>
  );
}
