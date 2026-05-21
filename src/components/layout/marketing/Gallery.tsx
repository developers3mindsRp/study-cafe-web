import Gallery from '@/components/layout/course/Gallerysection';
import type { ResolvedMarketingPage } from '@/lib/marketing/types';

interface Props {
  data: ResolvedMarketingPage;
}

const Gallery_marketing = ({ data }: Props) => {
  return (
    <Gallery
      variant="marketing"
      heading="Photo Gallery"
      images={data.galleryImages}
    />
  );
};

export default Gallery_marketing;
