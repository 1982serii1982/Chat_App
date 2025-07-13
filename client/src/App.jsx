import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Chat from "./pages/chat/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  console.log("App component");
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
