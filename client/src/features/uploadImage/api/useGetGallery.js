import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useGetGallery = (identifier) => {
  const mutation = useQuery({
    queryKey: ["gallery", identifier],
    queryFn: async () => {
      const apiCall = await fetch(BASE_URL + `/gallery/${identifier}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await apiCall.json();
      return response;
    },
  });
  return mutation;
};

export default useGetGallery;
