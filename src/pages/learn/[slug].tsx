import type { GetServerSideProps } from "next";
import axios from "axios";
import LearningPage from "@/components/learning/LearningPage";
import { getServerSideApiBaseUrl } from "@/lib/apiBase";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireVerifiedEmail from "@/components/auth/RequireVerifiedEmail";

type Props = {
  courseId: string;
  slug: string;
};

export default function LearnRoute(props: Props) {

  console.log(props,"props")
  return (
    <RequireAuth>
      <RequireVerifiedEmail>
        <LearningPage courseId={props.courseId} slug={props.slug} />
      </RequireVerifiedEmail>
    </RequireAuth>
  );
}

function tokenFromCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug;
  if (!slug || typeof slug !== "string") return { notFound: true };

  const apiBase = getServerSideApiBaseUrl(ctx.req).replace(/\/$/, "");

  const token = tokenFromCookie(ctx.req.headers.cookie);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const isNumericId = /^\d+$/.test(slug);
    const courseUrl = isNumericId
      ? `${apiBase}/courses/${encodeURIComponent(slug)}`
      : `${apiBase}/courses/slug/${encodeURIComponent(slug)}`;

    const courseRes = await axios.get(courseUrl, {
      headers,
      timeout: 12000,
      validateStatus: (s) => s === 200,
    });
    const course = courseRes.data?.data ?? courseRes.data;
    if (!course?.id) return { notFound: true };

    const canonicalSlug =
      course.slug && String(course.slug).trim() !== "" ? String(course.slug) : null;

    // Prefer readable URLs: /learn/123 → /learn/my-course-slug
    if (isNumericId && canonicalSlug) {
      return {
        redirect: {
          destination: `/learn/${encodeURIComponent(canonicalSlug)}`,
          permanent: false,
        },
      };
    }

    const segmentForLinks = canonicalSlug ?? slug;

    if (!token) {
      return {
        redirect: {
          destination: `/login?redirect=${encodeURIComponent(`/learn/${encodeURIComponent(segmentForLinks)}`)}`,
          permanent: false,
        },
      };
    }

    const accessRes = await axios.get(`${apiBase}/access/check`, {
      params: { courseId: course.id },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
      validateStatus: (s) => s === 200,
    });
    const allowed = accessRes.data?.data?.allowed ?? accessRes.data?.allowed;
    if (!allowed) {
      return {
        redirect: {
          destination: `/course/${encodeURIComponent(segmentForLinks)}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        courseId: String(course.id),
        slug: segmentForLinks,
      },
    };
  } catch {
    return { notFound: true };
  }
};
