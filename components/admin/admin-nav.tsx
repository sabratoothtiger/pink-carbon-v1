"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface AdminNavProps {
  accountId: string;
}

interface AdminNavItem {
  label: string;
  icon: string;
  href?: string; // omitted for not-yet-implemented sections
}

export default function AdminNav({ accountId }: AdminNavProps) {
  const pathname = usePathname();
  const basePath = `/account/${accountId}/admin`;

  const items: AdminNavItem[] = [
    { label: "Overview", icon: "pi pi-th-large", href: basePath },
    { label: "Exports", icon: "pi pi-download", href: `${basePath}/exports` },
    { label: "Users", icon: "pi pi-users" },
    { label: "Settings", icon: "pi pi-cog" },
    { label: "Billing", icon: "pi pi-credit-card" },
    { label: "API Keys", icon: "pi pi-key" },
    { label: "Audit Log", icon: "pi pi-list" },
  ];

  return (
    // Same surface/border treatment as the app's main icon sidebar
    // (components/navigation_shell/shell.tsx), styled as an inset panel to
    // match the card language used elsewhere on this page.
    <nav
      className="w-56 flex-shrink-0 self-start rounded-lg border border-solid border-[var(--surface-border)] bg-[var(--surface-a)] p-3"
      aria-label="Admin sections"
    >
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          if (!item.href) {
            return (
              <li key={item.label}>
                <span
                  className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-white/40"
                  aria-disabled="true"
                >
                  <i className={item.icon} />
                  {item.label}
                </span>
              </li>
            );
          }

          const isActive = pathname === item.href;

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-pink-500/10 text-pink-500"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <i className={item.icon} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
