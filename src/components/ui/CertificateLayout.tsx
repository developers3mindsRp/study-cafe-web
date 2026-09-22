import React from "react";
import CertificateArtwork, { type CertificateArtworkProps } from "./CertificateArtwork";

type CertificateLayoutProps = CertificateArtworkProps;

/**
 * On-screen PREVIEW of the certificate: the real 822×583 artwork scaled down to fit a phone.
 *
 * Do not capture from this element. The `scale-*` transform and the `h-[285px]` clamp are what a
 * screenshot library sees, so a capture taken here comes out shrunk and cropped on mobile. Use
 * useCertificateDownload(), which renders CertificateArtwork off-screen at full size.
 */
const CertificateLayout: React.FC<CertificateLayoutProps> = (props) => {
  return (
    <div className="w-full overflow-x-hidden flex justify-center py-4 h-[285px] md:h-[unset]">
      {/* Responsive Scale */}
      <div
        className="
          origin-top
          scale-[0.42]
          sm:scale-[0.60]
          md:scale-100
        "
      >
        <CertificateArtwork {...props} />
      </div>
    </div>
  );
};

export default CertificateLayout;
