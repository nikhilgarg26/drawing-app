import React from "react";
// import "./Loader.css"; // Import your custom CSS file where the animation is defined

const Loader = ({ label = "Loading" }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="flex flex-col justify-center items-center space-y-2 w-fit shadow-md pt-2 bg-white opacity-100 rounded">
        <div className="font-semibold text-lg">{label}...</div>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader;
