import type { Banner } from "@/types/banner.type";

export default function Banner({ banner }: { banner: Banner }) {
  return (
    <div className="w-full aspect-[14/2.5] sm:aspect-[8/1.25] md:rounded-lg overflow-hidden">
      <a href={banner.link_url} key={banner.id} className="w-full h-full block">
        <img
          src={banner.image_url}
          alt={banner.name}
          className="w-full h-full object-contain md:rounded-lg transition-transform duration-200 hover:scale-105"
        />
      </a>
    </div>
  );
}
