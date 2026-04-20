import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PublicLayout } from "@/components/layout";
import axios from "axios";

type VerifyData = {
  certificate_number: string;
  issued_at: string;
  learner_name: string | null;
  course_title: string | null;
};

export default function VerifyCertificatePage() {
  const router = useRouter();
  const [data, setData] = useState<VerifyData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof router.query.token === "string" ? router.query.token : "";
    if (!router.isReady || !token) return;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api").replace(
      /\/$/,
      ""
    );
    axios
      .get(`${base}/certificates/verify/${encodeURIComponent(token)}`)
      .then((res) => {
        const body = res.data?.data ?? res.data;
        setData(body);
      })
      .catch(() => setErr("Certificate not found or invalid."));
  }, [router.isReady, router.query.token]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Certificate verification</h1>
        {err && <p className="mt-6 text-red-600">{err}</p>}
        {data && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
            <p className="text-sm text-gray-500">Certificate number</p>
            <p className="font-mono font-medium">{data.certificate_number}</p>
            <p className="mt-4 text-sm text-gray-500">Learner</p>
            <p className="font-medium">{data.learner_name ?? "—"}</p>
            <p className="mt-4 text-sm text-gray-500">Course</p>
            <p className="font-medium">{data.course_title ?? "—"}</p>
            <p className="mt-4 text-sm text-gray-500">Issued</p>
            <p>{data.issued_at ? new Date(data.issued_at).toLocaleDateString() : "—"}</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
