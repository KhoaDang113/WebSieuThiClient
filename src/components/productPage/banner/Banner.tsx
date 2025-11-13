import type { Banner } from "@/types/banner.type";

export default function Banner({ banner }: { banner: Banner }) {
  return (
    <div className="w-full aspect-[14/2.5] sm:aspect-[8/1.25] md:rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2">
      <a href={banner.link_url} key={banner.id} className="w-full h-full flex items-center justify-center">
        <img
          src={banner.image_url}
          alt={banner.name}
          className="max-w-full max-h-full w-auto h-auto object-contain md:rounded-lg transition-transform duration-200 hover:scale-105"
        />
      </a>
    </div>
  );
}
