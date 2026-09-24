"use client";

import { useState, type ReactNode } from "react";

export function SearchModeTabs({ quick, detailed }: { quick: ReactNode; detailed: ReactNode }) {
  const [mode, setMode] = useState<"quick" | "detailed">("quick");
  return <div className="search-mode-tabs">
    <div className="search-mode-tab-buttons" role="tablist" aria-label="Arama modu">
      <button type="button" role="tab" aria-selected={mode === "quick"} className={mode === "quick" ? "active" : ""} onClick={() => setMode("quick")}>Hızlı Arama</button>
      <button type="button" role="tab" aria-selected={mode === "detailed"} className={mode === "detailed" ? "active" : ""} onClick={() => setMode("detailed")}>Detaylı Arama</button>
    </div>
    <div hidden={mode !== "quick"}>{quick}</div>
    <div hidden={mode !== "detailed"}>{detailed}</div>
  </div>;
}
