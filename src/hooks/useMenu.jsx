import { useEffect, useState } from "react";
import useAxios from "./useAxios";

const useMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxios();

  useEffect(() => {
    axiosSecure
      .get("/menu")
      .then((res) => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoading(false);
      });
  }, [axiosSecure]);

  return [menu, loading];
};

export default useMenu;
