import { PublicLayout } from "@/components/layout";

/** Legacy verification URLs pointed at the API; certificates are now rendered client-side after course completion. */
export default function VerifyCertificatePage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-700">
        <h1 className="text-2xl font-semibold text-gray-900">Certificate verification</h1>
        <p className="mt-6 text-gray-600">
          StudyCafe no longer hosts per-certificate verification links. Finish all lessons in a course, then open
          <strong className="font-medium"> Certificate </strong>
          from the learning screen to generate and print your certificate from your browser.
        </p>
      </div>
    </PublicLayout>
  );
}
