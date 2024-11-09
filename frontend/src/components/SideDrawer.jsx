import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import chatImg from "../assets/chat.svg";
import send from "../assets/send.svg";
import MessageBox from "./MessageBox";
import { WhiteBoardState } from "../context/whiteBoardProvider";
import ScrollableFeed from "react-scrollable-feed";

var ENDPOINT = "http://localhost:3000";
var socket;

const SideDrawer = ({ roomId, isLive }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { name, chats, setChats } = WhiteBoardState();

  const sidebarRef = useRef();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("chatMessage", roomId, name, newMessage);
      setNewMessage("");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.emit("joinChat", roomId, name);
  }, []);

  useEffect(() => {
    socket.on("chatMessage", (data) => {
      console.log("messages = " + data);
      setChats((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
        setSearch("");
        setSearchResult([]);
      }
    };

    document.addEventListener("click", handleClickOutsideSidebar);

    return () => {
      document.removeEventListener("click", handleClickOutsideSidebar);
    };
  });

  return (
    <div ref={sidebarRef} hidden={!isLive}>
      <button
        className="text-black flex justify-between items-center bg-mycolor-500 hover:bg-mycolor-700 focus:ring-4 focus:ring-mycolor-100 rounded-lg text-md font-semibold px-5 py-3 focus:outline-none"
        type="button"
        onClick={toggleDrawer}
      >
        <img className="w-5 mr-2" src={chatImg} alt="search" />
        <span>Chat</span>
      </button>

      {/* Drawer Component */}
      <div
        id="drawer-example"
        className={`fixed flex flex-col shadow-2xl rounded-l-xl border-4 border-mycolor-500 top-0 right-0 z-40 h-screen p-4 transition-transform ${
          isDrawerOpen ? "" : "translate-x-full"
        } bg-mycolor-50 w-96 dark:bg-gray-800`}
        tabIndex="-1"
        aria-labelledby="drawer-label"
      >
        {/* Drawer Header */}
        <button
          onClick={() => {
            setIsDrawerOpen(false);
          }}
          type="button"
          data-drawer-hide="drawer-example"
          aria-controls="drawer-example"
          className="text-gray-400 bg-transparent hover:bg-mycolor-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <h1 className="text-xl font-semibold text-black mb-2">Chats</h1>
        <div className="relative grow  flex flex-col justify-end">
          <div className="max-h-[84vh] w-full">
            {/* chats */}
            <ScrollableFeed>
              {chats.map((m) => {
                return (
                  <div className="w-full flex flex-col">
                    <MessageBox
                      sender={m.name}
                      you={m.name == name.trim()}
                      message={m.message}
                    ></MessageBox>
                  </div>
                );
              })}
            </ScrollableFeed>
          </div>
          <div className="flex mt-3 bg-white">
            <input
              value={newMessage}
              className="w-full px-1 py-1.5 rounded-md bg-transparent border-none outline-none"
              type="text"
              placeholder="Type a Message...."
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  console.log("Enter Pressed");
                  sendMessage();
                }
              }}
              onChange={(e) => setNewMessage(e.target.value)}
            ></input>
            <button
              hidden={newMessage ? newMessage.trim() == "" : true}
              onClick={sendMessage}
              className="rounded-md mx-2 text-white font-bold "
            >
              {/* Send */}
              <img className="w-8" src={send} alt="send"></img>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
