"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import parsePhoneNumber from "libphonenumber-js/min";
import "react-phone-number-input/style.css";
import type { CertificateClaimPayload } from "@/services/certificateLink.service";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  /** Honeypot. Kept in the schema so it survives validation and reaches the API. */
  company_website: string;
};

const claimFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Enter your full name")
    .max(190, "Name must be at most 190 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email")
    .max(190),
  phone: yup
    .string()
    .required("Mobile number is required")
    .test("valid-phone", "Enter a valid phone number", (val) => {
      if (!val || !String(val).trim()) return false;
      try {
        const p = parsePhoneNumber(String(val));
        return p?.isValid() ?? false;
      } catch {
        return false;
      }
    }),
  company_website: yup.string().default(""),
});

type Props = {
  /** Server clock from the GET, echoed back so the API can reject instant submissions. */
  renderedAt: number;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (payload: CertificateClaimPayload) => void | Promise<void>;
};

/** UTM tags from the campaign that sent this visitor, recorded with the lead. */
function utmFromLocation(): Pick<CertificateClaimPayload, "utm_source" | "utm_medium" | "utm_campaign"> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

export default function CertificateClaimForm({
  renderedAt,
  submitting,
  errorMessage,
  onSubmit,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(claimFormSchema),
    defaultValues: { name: "", email: "", phone: "", company_website: "" },
  });

  const [mountedAt] = useState(() => Date.now());

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company_website: values.company_website,
      // Prefer the server's clock; fall back to mount time if the GET did not carry one.
      rendered_at: renderedAt || mountedAt,
      ...utmFromLocation(),
    });
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="certificate-name">
          Full name <span className="text-red-600">*</span>
        </label>
        <input
          id="certificate-name"
          type="text"
          autoComplete="name"
          placeholder="Name as it should appear on the certificate"
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        <p className="mt-1 text-xs text-gray-500">
          This is printed on the certificate and cannot be changed afterwards.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="certificate-email">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="certificate-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="certificate-phone">
          Mobile number <span className="text-red-600">*</span>
        </label>
        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, onBlur, value, ref, name } }) => (
            <PhoneInput
              id="certificate-phone"
              name={name}
              ref={ref}
              international
              defaultCountry="IN"
              placeholder="Enter mobile number"
              value={value || undefined}
              onChange={(v) => onChange(v ?? "")}
              onBlur={onBlur}
              limitMaxLength
              className="w-full rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500"
            />
          )}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      {/*
        Honeypot. Positioned off-screen by the WRAPPER rather than hidden with display:none — a
        `display:none` input is skipped by most bots, which defeats the point. tabIndex and
        aria-hidden keep it away from keyboard and screen-reader users.
      */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="certificate-company-website">Company website</label>
        <input
          id="certificate-company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#09339B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#072a80] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Generating your certificate…" : "Get my certificate"}
      </button>
    </form>
  );
}
