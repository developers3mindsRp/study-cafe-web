"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout";
import Breadcrumbs from "@/components/Breadcrumb";
import Paymentsection from "@/components/layout/course/payment/Paymentsection";
import PriceCard from "@/components/layout/course/payment/SidebarPayment";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireVerifiedEmail from "@/components/auth/RequireVerifiedEmail";
import {
  getCourseBySlug,
  getCourseSessionsBySlug,
} from "@/services/platform.service";
import type { CoursePublicDetail, CourseBatch } from "@/types/models.types";

export default function PaymentScreen() {
  const router = useRouter();
  const courseSlug = (router.query.course as string) ?? "";

  const [course, setCourse] = useState<CoursePublicDetail | null>(null);
  const [batches, setBatches] = useState<CourseBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    if (!courseSlug) {
      setError("No course selected. Please go back and choose a course.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, batchData] = await Promise.all([
          getCourseBySlug(courseSlug),
          getCourseSessionsBySlug(courseSlug),
        ]);
        if (cancelled) return;
        if (!courseData) {
          setError("Course not found. It may have been removed or unpublished.");
          setCourse(null);
        } else {
          setCourse(courseData);
          setBatches(batchData);
        }
      } catch {
        if (!cancelled) setError("Failed to load course details. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, courseSlug]);

  return (
    <PublicLayout>
      <RequireAuth>
        <RequireVerifiedEmail>
        <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
          <Breadcrumbs
            content={[
              { label: "Courses", href: "/courses" },
              ...(course ? [{ label: course.title, href: `/course/${course.slug}` }] : []),
              { label: "Payment" },
            ]}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#09339B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[#929292] text-[16px]">Loading course details…</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4 max-w-md px-4">
              <p className="text-[#929292] text-[16px]">{error}</p>
              <button
                onClick={() => router.push("/courses")}
                className="bg-[#09339B] text-white px-6 py-2 rounded-lg font-medium"
              >
                Browse Courses
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6 container">
            <div className="lg:col-span-2 space-y-10">
              <Paymentsection course={course} batches={batches} />
            </div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <PriceCard course={course} />
              </div>
            </div>
          </div>
        )}
        </RequireVerifiedEmail>
      </RequireAuth>
    </PublicLayout>
  );
}
