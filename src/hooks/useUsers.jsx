import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';

const useUsers = () => {
  const axiosSecure = useAxios();

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosSecure.get('/users');
      return response.data;
    },
  });

  return { users, isLoading, error, refetch };
};

export default useUsers;
