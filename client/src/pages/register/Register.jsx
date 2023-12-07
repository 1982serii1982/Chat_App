import React from "react";
import axiosM from "../../utils/axiosM.js";
import { UserContext } from "../../context/UserContext.jsx";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  //const { setUserEmail, setUserId } = React.useContext(UserContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosM.post(
        "/api/auth/register",
        { email, password },
        {
          withCredentials: true,
        }
      );

      // setUserEmail(email);
      // setUserId(data.userId);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

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
          Register
        </button>
      </form>
      <p className="mt-2">
        If you are registered, go to{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
