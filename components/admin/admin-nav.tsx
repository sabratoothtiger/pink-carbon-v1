"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <nav className="w-52 flex-shrink-0">
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          if (!item.href) {
            return (
              <li key={item.label}>
                <span className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary opacity-50 cursor-not-allowed">
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
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-pink-500 bg-opacity-10 text-pink-500 font-medium"
                    : "text-text-secondary hover:bg-surface-b hover:text-primary"
                }`}
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
