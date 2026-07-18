"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import parsePhoneNumber from "libphonenumber-js/min";
import "react-phone-number-input/style.css";
import { submitContactInquiry } from "@/services/platform.service";
import type { ContactPageData } from "@/lib/contact-page-data";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const contactFormSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("First name is required")
    .max(100, "First name must be at most 100 characters"),
  lastName: yup
    .string()
    .trim()
    .required("Last name is required")
    .max(100, "Last name must be at most 100 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email")
    .max(255),
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
  subject: yup.string().max(255, "Subject must be at most 255 characters").default(""),
  message: yup
    .string()
    .trim()
    .required("Message is required")
    .min(1, "Message is required")
    .max(5000, "Message must be at most 5000 characters"),
});

type Props = {
  data: ContactPageData;
};

export default function GetInTouch({ data }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (form) => {
    setSubmitError(null);
    setSuccess(false);
    try {
      const p = parsePhoneNumber(form.phone.trim());
      const mobile = p
        ? String(p.nationalNumber)
        : form.phone.replace(/\D/g, "").slice(0, 30);
      const country = p?.country || "IN";

      await submitContactInquiry({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email.trim(),
        mobile_number: mobile,
        country_code: country,
        subject: form.subject?.trim() || undefined,
        message: form.message.trim(),
      });
      setSuccess(true);
      reset();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (e instanceof Error ? e.message : null) ||
        "Could not send your message. Please try again later.";
      setSubmitError(String(msg));
    }
  });

  return (
    <div className="flex">
      <div
        className="hidden max-h-[650px] w-1/2 flex-col justify-center object-cover bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat p-8 text-white md:flex"
        aria-hidden
      >
        <div className="relative border border-white/20 xl:w-[548px] h-auto xl:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden bg-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.4)]">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[40px] bg-black/20 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <img
              src="/images/studycafe_logo_white.svg"
              alt=""
              width={221}
              height={250}
              className="mx-auto mt-[11px]"
            />
            <h1 className="mb-4 pt-[12px] text-[30px] font-bold md:pb-[6px] md:text-4xl">
              {data.heading}
            </h1>
            <div
              className="prose prose-invert !text-center max-w-none px-2  text-[18px] md:text-[24px] [&_a]:text-white [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center md:w-1/2">
        <div className="w-full rounded-xl p-4 px-12 shadow-sm">
          <h2 className="mb-6 text-[26px] font-normal">{data.formHeading}</h2>

          {success && (
            <p
              className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              role="status"
            >
              Thank you, your message was sent. We will get back to you soon.
            </p>
          )}

          {submitError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {submitError}
            </p>
          )}

          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="flex gap-4">
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium" htmlFor="contact-firstName">
                  First name <span className="text-red-600">*</span>
                </label>
                <input
                  id="contact-firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First Name"
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium" htmlFor="contact-lastName">
                  Last name <span className="text-red-600">*</span>
                </label>
                <input
                  id="contact-lastName"
                  type="text"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="contact-email">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                 placeholder="Enter Email"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="contact-phone">
                Mobile number <span className="text-red-600">*</span>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, onBlur, value, ref, name } }) => (
                  <PhoneInput
                    id="contact-phone"
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
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="contact-subject">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                placeholder="How can we help you?"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="contact-message">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us more about your inquiry…"
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#09339B] py-3 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending…" : data.submitButtonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
