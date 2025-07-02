import { useQuery } from "@tanstack/react-query";

import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useCart = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const { refetch, data: cart = [] } = useQuery({
    enabled: !!user?.email, // wait until user is loaded
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/carts?email=${user.email}`);
      return res.data;
    },
  });

  return [cart, refetch];
};

export default useCart;
