// // components/Breadcrumb.jsx
// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';  // agar App Router use kar rahe ho
// // agar Pages-router hai toh `useRouter()` + router.pathname use kar sakte hain

// export default function Breadcrumb() {
//   const pathname = usePathname(); // e.g. "/courses/python/lesson1"
//   const pathSegments = pathname.split('/').filter(seg => seg);

//   const breadcrumbItems = pathSegments.map((seg, idx) => {
//     const href = '/' + pathSegments.slice(0, idx + 1).join('/');
//     // for nicer label — replace hyphens, capitalize, etc.
//     const label = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//     return { href, label };
//   });

//   return (
//     <nav className="container mx-auto px-4 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
//       <Link href="/"><a className="hover:underline">Home</a></Link>
//       {breadcrumbItems.map((item, i) => (
//         <React.Fragment key={i}>
//           <span className="mx-1">›</span>
//           {i === breadcrumbItems.length - 1 ? (
//             <span className="text-blue-600">{item.label}</span>
//           ) : (
//             <Link href={item.href}><a className="hover:underline">{item.label}</a></Link>
//           )}
//         </React.Fragment>
//       ))}
//     </nav>
//   );
// }
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
              <span>{">"}</span>
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

