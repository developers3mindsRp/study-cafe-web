"use client";
import { useState } from "react";
import { submitCourseReview } from "@/services/courseReviews.service";

interface ReviewFormProps {
  courseId: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function ReviewForm({ courseId, onClose, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = async () => {
    setError(null);
    if (!rating) {
      setError("Please choose a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      await submitCourseReview(courseId, rating, review);
      setRating(0);
      setReview("");
      onSubmitted?.();
      onClose();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Could not submit review. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md text-left">
      <button
        className="text-[#09339B] mb-4 "
        onClick={onClose} // ← this will close the form
      >
        &larr; Back
      </button>

      {error ? (
        <p className="mb-3 rounded-md bg-red-50 px-2 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col items-center mb-6">
        <div className="flex space-x-1 mb-2">
          {stars.map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`w-8 h-8 cursor-pointer ${(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118L2.086 9.377c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.95-.69l1.287-3.95z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-400 text-sm">Your overall rating</span>
      </div>

      <textarea
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09339B]"
        placeholder="Write here"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
      />

      <button
        type="button"
        disabled={submitting}
        onClick={() => void handleSubmit()}
        className="w-full rounded-md bg-[#09339B] py-3 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </div>
  );
}
