import { useMutation } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useIdentifierCheck = () => {
  const mutation = useMutation({
    mutationFn: async (identifier) => {
      try {
        const apiCall = await fetch(
          BASE_URL + `/gallery/check-identifier/${identifier}`
        );
        const response = await apiCall.json();
        return response.ok;
      } catch (error) {
        return false;
      }
    },
  });
  return mutation;
};

export default useIdentifierCheck;
