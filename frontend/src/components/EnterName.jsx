import React, { useState } from "react";

const EnterName = ({ onClick, setEnterName }) => {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 z-40 flex justify-center items-center ">
      <div className="bg-white rounded-md flex flex-col w-96 ">
        <header className="text-2xl p-4">Enter Your Name</header>
        <div className="p-4">
          <input
            onChange={(e) => setEnterName(e.target.value)}
            type="text"
            name="enterName"
            id="enterName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Enter Name"
            required=""
          />
        </div>
        <div className="p-4 pb-2 flex justify-end w-full">
          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={onClick}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterName;
