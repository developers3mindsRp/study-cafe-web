import MediaTestimonials from "@/components/layout/marketing/MediaTestimonials";
import type { MediaTestimonial } from "@/types/models.types";

interface Props {
  items?: MediaTestimonial[];
}

export default function Testimonials_course({ items = [] }: Props) {
  return <MediaTestimonials items={items} variant="course" />;
}
