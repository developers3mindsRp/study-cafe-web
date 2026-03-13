import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import { PublicLayout } from "@/components/layout";
import MembershipPricing from "@/components/layout/home/Member.home";
import PlansComparisonTable from "@/components/layout/membership/PlanCompare";
import { getMemberships } from "@/services/platform.service";

export default function Membership() {
  return (
    <PublicLayout>
      <MembershipPricing />
      <PlansComparisonTable />
    </PublicLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.platform.memberships(),
      queryFn: () => getMemberships(),
    });
  } catch (error) {
    console.error("Error prefetching memberships:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 600,
  };
};
