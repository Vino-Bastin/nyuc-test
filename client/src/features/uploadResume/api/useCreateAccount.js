import { useMutation } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useCreateAccount = () => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const apiCall = await fetch(BASE_URL + "/users/create-account", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await apiCall.json();
      return response.ok;
    },
  });
  return mutation;
};

export default useCreateAccount;