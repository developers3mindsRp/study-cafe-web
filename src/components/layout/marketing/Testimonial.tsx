import type { MediaTestimonial } from "@/types/models.types";
import MediaTestimonials from "./MediaTestimonials";

interface Props {
  items: MediaTestimonial[];
}

export default function Testimonials_marketing({ items }: Props) {
  return <MediaTestimonials items={items} variant="marketing" />;
}
