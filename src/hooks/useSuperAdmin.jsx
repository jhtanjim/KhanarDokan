// useSuperAdmin.js - Hook to check if user is super admin
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useSuperAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxios();

  const { data: isSuperAdmin, isPending: isSuperAdminLoading } = useQuery({
    queryKey: [user?.email, "isSuperAdmin"],
    enabled: !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/superadmin/${user.email}`);
      return res.data?.superadmin;
    },
  });

  return [isSuperAdmin, isSuperAdminLoading];
};

export default useSuperAdmin;
