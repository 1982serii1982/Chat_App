import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContextProvider";

import axiosM from "./../utils/axiosM";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  console.log("ProtectedRoute component");

  const location = useLocation();

  const { setUserEmail, setUserId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const auth = useRef(false);

  useEffect(() => {
    console.log("Inside ProtectedRoute useEffect");
    const checkAuth = async (url) => {
      try {
        const { data } = await axiosM.get(url, { withCredentials: true });
        setUserEmail(data.email);
        setUserId(data._id);
        auth.current = true;
        setLoading(false);
      } catch (error) {
        console.log(`Message: >> ${error.response.data.message}`);
        console.log(`Stack: >> ${error.response.data.stack}`);
        console.log(`Status: >> ${error.response.data.status}`);
        console.log(`Success: >> ${error.response.data.success}`);
        auth.current = false;
        setLoading(false);
      }
    };

    checkAuth("api/auth/getMe");
  }, []);

  if (loading) {
    return "Loading";
  }

  if (!auth.current) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, ref: "protectedroute" }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
