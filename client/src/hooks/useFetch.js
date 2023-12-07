import React from "react";
import axiosM from "../utils/axiosM.js";

const useFetch = (url) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosM.get(url, { withCredentials: true });
        setData(data);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const { data } = await axiosM.get(url, { withCredentials: true });
      setData(data);
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
