import React, { useEffect, useRef, useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../../assets/newLogo.png";
import undo from "../../assets/noun-undo.png";
import "./style.css";
import { ToolBox } from "./ToolBox";
import Back from "./Back";
import Popover from "../Popover";
import { useParams } from "react-router-dom";
import { WhiteBoardState } from "../../context/whiteBoardProvider";
import SideDrawer from "../SideDrawer";

export function Appbar({
  strokesize,
  setSize,
  strokecolor,
  setColor,
  setTool,
  tool,
  setUndoRedo,
  setClearBoard,
  isHost,
  bcolor,
  setBcolor,
  hidden,
}) {
  const menuRef = useRef();

  const { RoomID } = useParams();

  const { people } = WhiteBoardState();

  return (
    <div
      className={`py-2 px-5 flex justify-between w-full border-b-2 border-gray-100`}
      style={{ background: `${bcolor}` }}
    >
      {isHost ? (
        <div className="flex justify-center items-center">
          <Back></Back>

          {!people.some((obj) => obj.isOwner === true) && (
            <div className="text-gray-500 mx-10 text-2xl">{"(View Only)"}</div>
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-2xl font-semibold flex items-center">
          <img className="h-12" src={logo} alt="logo" />

          <div className="mx-10">{"(View Only)"}</div>
        </div>
      )}
      <div hidden={hidden} className="tools-section undoRedo">
        <button
          className="undo tool"
          onClick={() => {
            setUndoRedo("undo");
          }}
        >
          <img className="h-6" src={undo} alt="undo"></img>
        </button>
        <div className="partition"></div>
        <button
          className="redo tool"
          onClick={() => {
            setUndoRedo("redo");
          }}
        >
          <img src={undo} alt="redo" className="h-6"></img>
        </button>
      </div>
      <ToolBox
        isHost={isHost}
        strokesize={strokesize}
        setSize={setSize}
        strokecolor={strokecolor}
        setColor={setColor}
        setTool={setTool}
        tool={tool}
        hidden={hidden}
      />
      <div className="flex">
        <div className=" flex flex-col justify-center mx-3 tools-section hover:bg-mycolor-700">
          <Popover
            code={RoomID}
            isLive={people.some((obj) => obj.isOwner === true)}
          ></Popover>
        </div>
        <div className="flex flex-col justify-center mr-3">
          <SideDrawer
            isLive={people.some((obj) => obj.isOwner === true)}
            roomId={RoomID}
          ></SideDrawer>
        </div>
      </div>
      <div className="tools-section mx-0" hidden={hidden}>
        <Hamburger
          size={20}
          duration={0.3}
          onToggle={(toggle) => {
            if (!toggle) {
              menuRef.current.classList.remove("open");
            } else {
              menuRef.current.classList.add("open");
            }
          }}
        ></Hamburger>
      </div>
      <div className="ham">
        <div
          className="ham-menu w-32 grid grid-cols-1 divide-y divide-gray-700"
          ref={menuRef}
        >
          <div>
            <button
              className="live hover:bg-sky-300 w-full mb-1"
              onClick={() => setClearBoard(true)}
            >
              Clear &#10060;
            </button>
          </div>
          <div>
            <label
              for="bcolor"
              className="text-black font-semibold px-2 flex py-1"
            >
              Background Color:
            </label>
            <div
              className="colors-list pb-2"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <button
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "25%",
                  background: "#ffffff",
                  border: "1px solid black",
                }}
                onClick={() => setBcolor("#ffffff")}
              ></button>
              <button
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "25%",
                  background: "#000000",
                }}
                onClick={() => setBcolor("#000000")}
              ></button>
              <button
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "25%",
                  background: "green",
                  border: "1px solid black",
                }}
                onClick={() => setBcolor("green")}
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
