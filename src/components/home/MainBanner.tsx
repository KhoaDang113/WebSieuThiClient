import Banners from "@/components/productPage/banner/Banners";
import type { Banner } from "@/types";

interface MainBannerProps {
  banners: Banner[];
}

export default function MainBanner({ banners }: MainBannerProps) {
  return (
    <div className="mb-8">
      <Banners banners={banners} />
    </div>
  );
}
