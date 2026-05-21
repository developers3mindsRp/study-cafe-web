import MediaTestimonials from "@/components/layout/marketing/MediaTestimonials";
import type { MediaTestimonialItem } from "@/lib/parseCourseContent";

interface Props {
  items?: MediaTestimonialItem[];
}

export default function Testimonials_course({ items = [] }: Props) {
  return <MediaTestimonials items={items} variant="course" />;
}
