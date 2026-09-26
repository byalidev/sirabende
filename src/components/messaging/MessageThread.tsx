"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MessageThread({ children, messageIds }: { children: ReactNode; messageIds: string[] }) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messageIds.join("|")]);

  return (
    <section className="message-thread" aria-label="Mesaj geçmişi">
      {children}
      <div ref={endRef} aria-hidden="true" />
    </section>
  );
}
