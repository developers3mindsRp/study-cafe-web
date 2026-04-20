import { downloadCertificate } from "@/services/progress.service";

type Props = {
  courseId: string;
};

export default function CompletionCertificateCard({ courseId }: Props) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950">
      <p className="font-semibold">Congratulations — you finished this course!</p>
      <p className="mt-1 text-sm opacity-90">Download your certificate of completion.</p>
      <button
        type="button"
        className="mt-3 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        onClick={() => downloadCertificate(courseId)}
      >
        Download certificate
      </button>
    </div>
  );
}
