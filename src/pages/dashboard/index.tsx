import { useRouter } from 'next/router';
import { useUserCourses, useDashboardStats } from '@/hooks/usePurchases';
import { DashboardLayout } from '@/components/layout';

/**
 * Dashboard Page
 * 
 * This is a protected route that shows user's dashboard with purchased courses
 * Uses client-side data fetching with React Query
 */

export default function DashboardPage() {
  const router = useRouter();
  
  // Fetch user's courses
  const { data: userCourses, isLoading: coursesLoading } = useUserCourses();
  
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  if (coursesLoading || statsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Loading dashboard...</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Message */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Total Courses</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalCourses}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-600">{stats.completedCourses}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">In Progress</div>
              <div className="text-3xl font-bold text-orange-600">{stats.inProgressCourses}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Learning Hours</div>
              <div className="text-3xl font-bold text-purple-600">{stats.totalLearningHours}</div>
          </div>
        </div>
      )}


      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h3 className="text-xl font-semibold mb-2">Profile Settings</h3>
            <p className="text-gray-600 text-sm">Update your profile and preferences</p>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/courses')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h3 className="text-xl font-semibold mb-2">All My Courses</h3>
            <p className="text-gray-600 text-sm">View and manage your enrolled courses</p>
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h3 className="text-xl font-semibold mb-2">Browse Courses</h3>
          <p className="text-gray-600 text-sm">Discover new courses to learn</p>
        </button>
      </div>
    </DashboardLayout>
  );
}

