import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import * as coursesService from "@/services/courses.service";
import { PublicLayout } from "@/components/layout";
import AffiliateReportPage from "@/components/layout/account/Report";
import Breadcrumbs from "@/components/Breadcrumb";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireVerifiedEmail from "@/components/auth/RequireVerifiedEmail";

export default function ReportPage() {
  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs />
      </div>
      <RequireAuth>
        <RequireVerifiedEmail>
          <AffiliateReportPage />
        </RequireVerifiedEmail>
      </RequireAuth>
    </PublicLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.courses.all, "featured", 6],
      queryFn: () => coursesService.getFeaturedCourses(6),
    });
  } catch (error) {
    console.error("Error prefetching featured courses:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 600,
  };
};
