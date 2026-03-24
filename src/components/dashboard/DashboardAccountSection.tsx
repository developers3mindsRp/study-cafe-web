// import { DashboardLayout } from "@/components/layout";
import EditProfile from "@/components/layout/account/EditProfile";
import type { AccountTabKey } from "@/components/layout/account/accountRoutes";

interface Props {
  tab: AccountTabKey;
}

/**
 * Shared shell: dashboard chrome + account tabs/content (EditProfile).
 */
export default function DashboardAccountSection({ tab }: Props) {
  return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 md:hidden">My account</h2>
        </div>
        <EditProfile initialTab={tab} useDashboardRoutes />
      </div>
  );
}
