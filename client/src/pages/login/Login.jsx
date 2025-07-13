import React from "react";
import axiosM from "../../utils/axiosM.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Chat from "../chat/Chat.jsx";

const Login = () => {
  console.log("Login component");
  const location = useLocation();

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  const reference = location.state?.ref ?? "notdefined";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [auth, setAuth] = React.useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosM.post(
        "/api/auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      );

      setAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    console.log("Inside Login useEffect");
    const checkAuth = async (url) => {
      try {
        await axiosM.get(url, { withCredentials: true });
        navigate("/");
      } catch (error) {
        console.log(`Message: >> ${error.response.data.message}`);
        console.log(`Stack: >> ${error.response.data.stack}`);
        console.log(`Status: >> ${error.response.data.status}`);
        console.log(`Success: >> ${error.response.data.success}`);
      }
    };

    if (reference === "notdefined") {
      checkAuth("api/auth/getMe");
    }
  }, []);

  return auth ? (
    <Chat />
  ) : (
    <div className="bg-blue-50 h-screen  flex items-center flex-col justify-center">
      <form className="w-64 mx-auto" onSubmit={submitHandler}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="email"
          className="block w-full rounded-sm p-2 mb-2"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white block w-full rounded-sm p-2"
        >
          Log In
        </button>
      </form>
      <p className="mt-2">
        If you are not registered go to{" "}
        <Link to="/register" className="text-blue-600 underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
