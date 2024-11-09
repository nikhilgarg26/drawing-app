import { useEffect, useState } from "react";
import { Appbar } from "../appbar/Appbar";
import MyBoard from "../board/MyBoard";
import { WhiteBoardState } from "../../context/whiteBoardProvider";

export function Container() {
  const [strokesize, setSize] = useState(5);
  const [strokecolor, setColor] = useState("#518af4");
  const [bcolor, setBcolor] = useState("#ffffff");
  const [currentTool, setCurrentTool] = useState("pencil");
  const [undoRedo, setUndoRedo] = useState(null);
  const [clearBoard, setClearBoard] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const [hidden, setHidden] = useState(true);

  const { people } = WhiteBoardState();

  useEffect(() => {
    if (isHost) {
      setHidden(false);
    }
    if (!people.some((obj) => obj.isOwner === true)) {
      setHidden(true);
    }
  }, [people]);

  return (
    <div className="fixed w-full h-full bg-black flex flex-col">
      <Appbar
        strokesize={strokesize}
        setSize={setSize}
        strokecolor={strokecolor}
        setColor={setColor}
        setTool={setCurrentTool}
        tool={currentTool}
        setUndoRedo={setUndoRedo}
        setClearBoard={setClearBoard}
        isHost={isHost}
        bcolor={bcolor}
        setBcolor={setBcolor}
        hidden={hidden}
      ></Appbar>
      <div className="board-container w-full h-full m-auto overflow-auto bg-gray-100">
        <MyBoard
          tool={currentTool}
          color={strokecolor}
          size={strokesize}
          undoRedo={undoRedo}
          setUndoRedo={setUndoRedo}
          clearBoard={clearBoard}
          setClearBoard={setClearBoard}
          isHost={isHost}
          setIsHost={setIsHost}
          bcolor={bcolor}
          hidden={hidden}
        />
      </div>
    </div>
  );
}
