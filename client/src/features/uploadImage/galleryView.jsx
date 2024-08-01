import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import useGetGallery from "./api/useGetGallery";
import NotFound from "../../pages/404";

const GalleryView = () => {
  const { identifier } = useParams();
  const { data, isLoading } = useGetGallery(identifier);
  return (
    <div className="w-[80%] h-[80%] bg-white rounded flex items-center justify-center overflow-y-auto">
      {isLoading ? (
        <Loader2 className="size-10 animate-spin text-blue-600" />
      ) : (
        data?.ok && (
          <div className="flex flex-wrap gap-2">
            {data.gallery.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="gallery"
                width={data.gallery.width}
                height={data.gallery.height}
                className="rounded object-cover"
                style={{
                  width: `${data.gallery.width}px`,
                  maxWidth: `${data.gallery.width}px`,
                  maxHeight: `${data.gallery.height}px`,
                  height: `${data.gallery.height}px`,
                }}
              />
            ))}
          </div>
        )
      )}
      {data && !data.ok && <NotFound message="Gallery not found." />}
    </div>
  );
};

export default GalleryView;
