import React from "react";
import axiosM from "../../utils/axiosM.js";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const checkAuth = async (url) => {
      try {
        await axiosM.get(url, { withCredentials: true });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth("api/auth/getMe");
  }, []);

  return (
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
