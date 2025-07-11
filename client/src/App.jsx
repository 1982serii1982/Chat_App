import { useEffect, useContext, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Chat from "./pages/chat/Chat";

import axiosM from "./utils/axiosM";
import { UserContext } from "./context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { setUserEmail, setUserId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const auth = useRef(false);

  useEffect(() => {
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
    console.log("inside useeffect");
  }, []);

  if (loading) {
    return "Loading";
  }

  if (!auth.current) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
