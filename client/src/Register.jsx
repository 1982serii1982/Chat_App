import React from "react";

const Register = () => {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");

  console.log(userName, password);
  return (
    <div className="bg-blue-50 h-screen  flex items-center">
      <form action="" className="w-64 mx-auto">
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
