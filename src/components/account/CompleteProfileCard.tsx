"use client";

import { useEffect, useState } from "react";
import IndianStatesList from "indian-states-cities-list";
import { useAuth } from "@/providers/AuthProvider";
import { updateProfile } from "@/services/user.service";
import { getMasterList } from "@/services/platform.service";
import type { ApiError } from "@/types/api.types";

const DISMISS_KEY = "sc_complete_profile_dismissed";
const INPUT_CLASS = "w-full border border-gray-300 px-3 py-2 rounded-md";

/**
 * Progressive profiling for checkout signups (/signup), which only collect name,
 * email, mobile and password. The profession/state/city the full /register form
 * asks for up front are requested here instead — after the purchase, where a
 * skipped answer costs nothing.
 *
 * Renders nothing once the profile is complete or the buyer has dismissed it.
 */
export default function CompleteProfileCard() {
  const { user, refetchUser } = useAuth();

  const [dismissed, setDismissed] = useState(true); // assume hidden until localStorage is read
  const [professions, setProfessions] = useState<{ title: string }[]>([]);
  const [form, setForm] = useState({ profession: "", state: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIncomplete = !!user && (!user.profession || !user.state || !user.city);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!isIncomplete || dismissed) return;
    let active = true;
    getMasterList()
      .then((data: any) => {
        if (active) setProfessions(data?.data || []);
      })
      .catch(() => {
        if (active) setProfessions([]);
      });
    return () => {
      active = false;
    };
  }, [isIncomplete, dismissed]);

  if (!isIncomplete || dismissed || saved) return null;

  const states = IndianStatesList.STATES_OBJECT.map((s) => s.value);

  function handleDismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Every field is optional here — send only what was filled in.
    const patch: Record<string, string> = {};
    if (form.profession) patch.profession = form.profession;
    if (form.state) patch.state = form.state;
    if (form.city.trim()) patch.city = form.city.trim();

    if (Object.keys(patch).length === 0) {
      setError("Fill in at least one field, or choose “Not now”.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(patch);
      refetchUser();
      setSaved(true);
    } catch (err: unknown) {
      setError(
        (err as ApiError)?.message ||
          (err as Error)?.message ||
          "Could not save right now. You can update this from My Account."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto px-6 pt-6">
      <div className="border border-[#09339B]/30 bg-[#F5F8FF] rounded-[10px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] md:text-[20px] font-semibold text-[#252525]">
              Complete your profile
            </h2>
            <p className="text-sm text-[#5c5f63] mt-1">
              Helps us recommend the right courses and keep your invoices accurate. Takes a few
              seconds.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-sm text-[#5c5f63] underline shrink-0"
          >
            Not now
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <div>
            <label htmlFor="cp-profession" className="block mb-1 text-sm">
              Profession
            </label>
            <select
              id="cp-profession"
              value={form.profession}
              onChange={(e) => setForm((p) => ({ ...p, profession: e.target.value }))}
              className={`${INPUT_CLASS} bg-white`}
            >
              <option value="">Select</option>
              {professions.map((item, index) => (
                <option key={index} value={item.title.toLowerCase()}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cp-state" className="block mb-1 text-sm">
              State
            </label>
            <select
              id="cp-state"
              value={form.state}
              onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
              className={`${INPUT_CLASS} bg-white`}
            >
              <option value="">Select state</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cp-city" className="block mb-1 text-sm">
              City
            </label>
            <input
              id="cp-city"
              type="text"
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              className={INPUT_CLASS}
              placeholder="Enter your city"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#09339B] text-white rounded-md py-2 px-6 hover:bg-[#072a80] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
