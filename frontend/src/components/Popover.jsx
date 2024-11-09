import React, { useState, useEffect, useRef } from "react";
import copy from "../assets/copied.svg";
import check from "../assets/check.svg";
import { WhiteBoardState } from "../context/whiteBoardProvider";
import add from "../assets/add.svg";

const Popover = ({ code, isLive }) => {
  const [shareable, setShareable] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const { people, isOwner, isHost } = WhiteBoardState();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsOpen(false);
      setCodeCopied(false);
      setLinkCopied(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        className="px-4 py-3 font-semibold text-black rounded flex"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={add} alt="" />
        <span className="ml-2">Add</span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
          <div
            ref={popoverRef}
            className="absolute mt-6 w-96 bg-white shadow-lg rounded-2xl z-50 right-0"
          >
            <div className="relative">
              <div
                className="absolute w-0 h-0 -top-3 right-14"
                // style={{ left: "50%", transform: "translateX(-50%)" }}
              >
                <div className="border-solid border-gray-200 border-2 border-transparent"></div>
                <div className="w-5 h-5 bg-white transform rotate-45"></div>
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setCodeCopied(false);
                    setLinkCopied(false);
                  }}
                  className="absolute mr-14 text-red-400 hover:text-red-600 cursor-pointer w-fit mt-2 ml-3"
                >
                  cancel
                </button>
                <div className="flex flex-col justify-between divide-y divide-gray-300 w-full">
                  {/* Modal header */}
                  <header className="p-4 flex justify-center w-full">
                    <h1 className="text-lg font-semibold ">
                      Share Live Whiteboard
                    </h1>
                  </header>
                  {/* Modal Body */}

                  <div className="bg-gray-100 text-sm px-4 py-2 text-gray-500 flex gap-3">
                    {!isLive ? (
                      <span>Owner is no longer present in Live Session.</span>
                    ) : (
                      !isHost && (
                        <>
                          <a
                            className="m-0 p-0 italic underline hover:text-blue-800"
                            href="http://localhost:5173/"
                            target="_blank"
                          >
                            Signup
                          </a>
                          <span className="-ml-2">
                            to start inovolving in drawing too.
                          </span>
                        </>
                      )
                    )}
                  </div>

                  <div className="p-4 flex flex-col divide-y divide-gray-300 text-lg">
                    <div className="flex justify-between pr-2">
                      {/* <div className="absolute top-24 h-[165px] left-0 right-0 bg-gray-500 w-full opacity-5"></div> */}
                      <span>Share Code</span>
                      <div className="flex">
                        <span className="text-[15px] hover:border-gray-400 border-white cursor-pointer border-b px-0.5 text-gray-500">
                          {code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${code}`);
                            setCodeCopied(true);
                          }}
                        >
                          <img
                            src={codeCopied ? check : copy}
                            alt={codeCopied ? "copied" : "copy"}
                            title={codeCopied ? "copied" : "copy"}
                            className="w-6 bg-gray-200 hover:bg-gray-100 p-1 rounded ml-2"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 flex flex-col items-center justify-center pr-3">
                      <div class="flex justify-between items-center w-full">
                        <label>Make link shareable</label>
                        <input
                          onClick={() => setShareable(!shareable)}
                          disabled={!isOwner}
                          checked={shareable}
                          type="checkbox"
                          className="ms-2 text-xl w-5 h-5 rounded-full font-medium text-gray-900 dark:text-gray-300"
                        />
                      </div>
                      {shareable && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.href}`
                            );
                            setLinkCopied(true);
                          }}
                          className="w-full py-2 rounded bg-gray-300 hover:bg-gray-200 cursor-pointer mt-3 transform duration-300"
                        >
                          {linkCopied ? "Copied!" : "Copy Link to clipboard"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-100 text-sm p-4 pb-0 text-gray-500 flex flex-col gap-3">
                    <span>
                      Guests can join with the code by tapping "Join Board" in
                      their Dashboard from the web at http://localhost:5173.
                    </span>

                    <span>
                      If the link is shareable, anyone on the internet can use
                      the URL to join as a guest.
                    </span>
                    <span className="text-[16px] font-semibold my-2">
                      PEOPLE
                    </span>
                  </div>
                  <div className="flex flex-col divide-y divide-gray-300 p-4 pt-0 max-h-48 overflow-auto">
                    {people.map((p) => {
                      return (
                        <div className="py-2 flex flex-col text-lg">
                          <span>{p.name}</span>
                          <span className="text-sm text-gray-500 -mt-0.5">
                            {p.isOwner ? "Owner" : "Guest"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <footer className="w-full h-6 bg-gray-200 rounded-b-2xl"></footer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Popover;
