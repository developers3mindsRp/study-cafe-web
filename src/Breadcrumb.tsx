"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname(); 
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 container mx-auto px-4 ">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-[#696969] hover:underline">
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());

          return (
            <li key={href} className="flex items-center space-x-2">
              <span>{">>"}</span>
              {isLast ? (
                <span className="font-normal text-[#09339B]">{label}</span>
              ) : (
                <Link href={href} className="text-blue-600 hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

