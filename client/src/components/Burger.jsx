import React from "react";
import axiosM from "./../utils/axiosM";

import { useOutsideClick } from "../hooks/useOutsideClick";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Burger = ({ ws }) => {
  const [openTab, setOpenTab] = React.useState(false);
  const { setUserEmail, setUserId } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleTabOpen = () => {
    setOpenTab(!openTab);
  };

  const handleClickOutside = () => {
    setOpenTab(false);
  };

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      await axiosM.post("api/auth/logout");
      setUserId(null);
      setUserEmail(null);
      ws.close(3333, "logout");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const refPerson = useOutsideClick(handleClickOutside);

  return (
    <div className="relative" ref={refPerson}>
      <button
        className="bg-blue-500 rounded shadow-lg text-white"
        onClick={handleTabOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      {openTab && (
        <div className="absolute bg-white p-2 rounded z-10">
          <button
            className="text-white bg-blue-400 px-2 py-1 border w-full rounded shadow"
            onClick={(e) => handleLogout(e)}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Burger;
