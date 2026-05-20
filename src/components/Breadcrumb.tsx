"use client";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Breadcrumbs({ content }: { content?: { label: string, href?: string }[] }) {
  const router = useRouter();
  const pathname = (router.asPath || router.pathname || "/").split("?")[0] || "/";

  const breadcrumbItems = content || (() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = segment
        .replace(/\.html$/i, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
      return { label, href };
    });
  })();

  return (
    <nav aria-label="Breadcrumb" className="text-[16px] text-[#696969] container mx-auto px-4 py-2">
      <ol className="flex flex-wrap items-center gap-y-1 gap-x-2">
        <li className="inline-flex items-center">
          <Link href="/" className="hover:text-[#09339B] hover:underline transition-colors whitespace-nowrap">
            Home
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => {
          const href = item.href;
          const isLast = index === breadcrumbItems.length - 1;
          const label = item.label;

          return (
            <li key={index} className="inline-flex items-center gap-x-2 min-w-0">
              <span className="shrink-0 whitespace-nowrap">{">>"}</span>
              {href && !isLast ? (
                <Link
                  href={href}
                  className="hover:text-[#09339B] hover:underline transition-colors line-clamp-1 sm:line-clamp-none sm:break-words"
                  title={label}
                >
                  {label}
                </Link>
              ) : (
                <span className="text-[#09339B] font-medium line-clamp-1 sm:line-clamp-none sm:break-words" title={label}>
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
