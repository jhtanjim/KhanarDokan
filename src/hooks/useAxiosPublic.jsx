import axios from "axios";
const axiosPublic = axios.create({
  baseURL: "https://khanar-dokan-server.vercel.app/",
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
