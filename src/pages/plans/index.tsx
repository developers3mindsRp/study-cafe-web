import { GetServerSideProps } from "next";
import { PublicLayout } from "@/components/layout";
import MembershipPricing from "@/components/layout/home/Member.home";
import PlansComparisonTable from "@/components/layout/membership/PlanCompare";
import { getMemberships } from "@/services/platform.service";
import type { Membership } from "@/types/models.types";

interface PlansPageProps {
  memberships: Membership[] | null;
}

export default function Membership({ memberships }: PlansPageProps) {
  return (
    <PublicLayout>
      <MembershipPricing memberships={memberships ?? undefined} />
      <PlansComparisonTable />
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<PlansPageProps> = async () => {
  let memberships: Membership[] | null = null;
  try {
    memberships = await getMemberships();
  } catch (error) {
    console.error("Error fetching memberships:", error);
  }
  return { props: { memberships } };
};
