import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import * as coursesService from "@/services/courses.service";
import VerifyEmailScreen from "@/components/layout/VerifyEmail";

export default function VerifyEmailPage() {
  return <VerifyEmailScreen />;
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.courses.all, "featured", 6],
      queryFn: () => coursesService.getFeaturedCourses(6),
    });
  } catch {
    /* non-fatal */
  }
  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 600,
  };
};
