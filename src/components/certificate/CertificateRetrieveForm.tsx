"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = { email: string };

const retrieveFormSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email")
    .max(190),
});

type Props = {
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (email: string) => void | Promise<void>;
};

/**
 * Email-only form for someone who ALREADY has a certificate from this link. Unlike
 * CertificateClaimForm it never issues one, so it needs no name, phone or bot traps.
 */
export default function CertificateRetrieveForm({ submitting, errorMessage, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(retrieveFormSchema),
    defaultValues: { email: "" },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values.email.trim());
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="certificate-retrieve-email">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="certificate-retrieve-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Use the same email address you entered when you first got your certificate.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#09339B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#072a80] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Finding your certificate…" : "Show my certificate"}
      </button>
    </form>
  );
}
