import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Chat from "./pages/chat/Chat";

import axiosM from "./utils/axiosM";
import { UserContext } from "./context/UserContext";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { setUserEmail, setUserId } = React.useContext(UserContext);
    const [loading, setLoading] = React.useState(true);

    const auth = React.useRef(false);

    React.useEffect(() => {
      const checkAuth = async (url) => {
        setLoading(true);
        try {
          const { data } = await axiosM.get(url, { withCredentials: true });
          setUserEmail(data.email);
          setUserId(data._id);
          auth.current = true;
        } catch (error) {
          console.log(`Message: >> ${error.response.data.message}`);
          console.log(`Stack: >> ${error.response.data.stack}`);
          console.log(`Status: >> ${error.response.data.status}`);
          console.log(`Success: >> ${error.response.data.success}`);
          auth.current = false;
        }
        setLoading(false);
      };

      checkAuth("api/auth/getMe");
    }, []);

    if (loading) {
      return;
    }

    if (!auth.current) {
      return <Navigate to="/login" />;
    }

    return children;
  };

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
