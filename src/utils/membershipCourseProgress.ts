import type { OverallProgressRow } from "@/services/progress.service";

/**
 * True when the learner should see the same CourseCard as purchased courses:
 * has activity, in progress/completed, or is enrolled in a batch (overall API includes the row).
 */
export function isMembershipCourseStarted(prog?: OverallProgressRow): boolean {
  if (!prog) return false;
  if (prog.percent > 0) return true;
  if (prog.status === "in_progress" || prog.status === "completed") return true;
  if ((prog.totalSessions ?? 0) > 0) return true;
  return false;
}
