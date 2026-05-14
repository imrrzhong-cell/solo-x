"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BIZ_NAV_ITEMS } from "@/lib/aibizradar/constants";

export function BizNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";

  return (
    <nav className="aibizradar-nav">
      <div className="container">
        {BIZ_NAV_ITEMS.map((item) => {
          const itemFilter = new URLSearchParams(item.href.split("?")[1] || "").get("filter") || "";
          const itemPath = item.href.split("?")[0];
          let isActive = false;
          if (itemPath === pathname) {
            if (itemFilter) {
              isActive = currentFilter === itemFilter;
            } else {
              isActive = !currentFilter;
            }
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`aibizradar-nav-tab ${isActive ? "active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
