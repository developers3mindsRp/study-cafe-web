// components/Breadcrumb.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';  // agar App Router use kar rahe ho
// agar Pages-router hai toh `useRouter()` + router.pathname use kar sakte hain

export default function Breadcrumb() {
  const pathname = usePathname(); // e.g. "/courses/python/lesson1"
  const pathSegments = pathname.split('/').filter(seg => seg);

  const breadcrumbItems = pathSegments.map((seg, idx) => {
    const href = '/' + pathSegments.slice(0, idx + 1).join('/');
    // for nicer label — replace hyphens, capitalize, etc.
    const label = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return { href, label };
  });

  return (
    <nav className="container mx-auto px-4 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
      <Link href="/"><a className="hover:underline">Home</a></Link>
      {breadcrumbItems.map((item, i) => (
        <React.Fragment key={i}>
          <span className="mx-1">›</span>
          {i === breadcrumbItems.length - 1 ? (
            <span className="text-blue-600">{item.label}</span>
          ) : (
            <Link href={item.href}><a className="hover:underline">{item.label}</a></Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
