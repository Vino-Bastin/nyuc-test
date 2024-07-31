import { useMutation } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useEmailCheck = () => {
  const mutation = useMutation({
    mutationFn: async (email) => {
      try {
        const apiCall = await fetch(BASE_URL + `/users/email-check/${email}`);
        const response = await apiCall.json();
        return response.ok;
      } catch (error) {
        return false;
      }
    },
  });
  return mutation;
};

export default useEmailCheck;
