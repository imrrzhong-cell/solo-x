"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AIHOT_NAV_ITEMS } from "@/lib/aihot/constants";

export function AihotNav() {
  const pathname = usePathname();

  return (
    <nav className="aihot-nav">
      <div className="container">
        {AIHOT_NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`aihot-nav-tab ${pathname === item.href ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
