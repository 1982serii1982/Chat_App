import React from "react";

const Avatar = ({ userId, userEmail, online }) => {
  const color = [
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-teal-200",
  ];

  const colorHex = parseInt(userId, 16);

  return (
    <>
      <div
        className={
          "relative w-8 h-8 rounded-full flex items-center justify-center " +
          color[colorHex % 6]
        }
      >
        {userEmail[0]}
        {online && (
          <div className="w-3 h-3 bg-lime-400 rounded-full border border-white absolute bottom-0 right-0"></div>
        )}
      </div>
    </>
  );
};

export default Avatar;
