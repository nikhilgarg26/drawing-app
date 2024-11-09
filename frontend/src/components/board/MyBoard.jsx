import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Saved } from "../Saved";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Loader from "../Loader";
import { WhiteBoardState } from "../../context/whiteBoardProvider";
import EnterName from "../EnterName";

const ENDPOINT = "http://localhost:3000";
var socket;

function MyBoard(props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lab, setLab] = useState("Loading");
  const [currentPencilStroke, setCurrentPencilStroke] = useState(null);
  const [show, setShow] = useState(true);
  const [enterName, setEnterName] = useState();
  const canvasRef = useRef();
  const prevPointRef = useRef(null);
  const linePointsRef = useRef(null);
  const circlePointsRef = useRef(null);
  const rectPointsRef = useRef(null);
  const drawingElementsRef = useRef([]);
  const redoDrawingElements = useRef([]);
  const [saved, setSaved] = useState(true);
  const [imgg, setImgg] = useState("");
  const [spin, setSpin] = useState(false);
  const { setPeople, setName, setIsHost, setIsOwner } = WhiteBoardState();

  const { RoomID } = useParams();
  const showSaved = () => {
    setSaved(false);
    setTimeout(() => {
      setSaved(true);
    }, 2000);
  };

  const handleEnterName = () => {
    setName(enterName);
    socket.emit("joinRoom", RoomID, enterName, false);
    setShow(false);
  };

  const handleSave = () => {
    const base64Canvas = canvasRef.current.toDataURL("image/jpeg", 1.0);
    setImgg(base64Canvas);

    setSpin(true);
    axios
      .put(
        "http://localhost:3000/api/v1/drawing/updateInfo",
        {
          imgId: RoomID,
          elementsArray: drawingElementsRef.current,
          image: base64Canvas,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setSpin(false);
        showSaved();
      })
      .catch((error) => {
        setSpin(false);

        alert(error);
      });
  };

  useEffect(() => {
    // componentDidMount
    socket = io(ENDPOINT);

    // componentDidUnMount
    return () => {
      socket.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    setSpin(true);
    const uri = "http://localhost:3000/api/v1/drawing/" + RoomID;
    axios
      .get(uri.toString(), {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setName(response.data.name);
        setIsHost(response.data.isHost);
        setIsOwner(response.data.isOwner);
        if (response.data.isHost) {
          socket.emit(
            "joinRoom",
            RoomID,
            response.data.name,
            response.data.isOwner
          );
        }
        props.setIsHost(response.data.isHost);
        drawingElementsRef.current = response.data.drawing.elementsArray;
        redrawCanvas();
        setSpin(false);
        setLab("Saving Progress");
      })
      .catch((error) => {
        alert(error);
        console.log(error.response);
        setSpin(false);
      });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "s" && props.isHost) {
        e.preventDefault();
        console.log("CTRL + S");

        handleSave();
      }
    });
  }, []);

  useEffect(() => {
    // Listen for updateUserList event to update connected users list
    socket.on("updateUserList", (users) => {
      setPeople(users);
    });

    return () => {
      socket.off("updateUserList");
    };
  }, []);

  useEffect(() => {
    socket.on("drawing", (elements) => {
      console.log("------------------- Socket catching ------------------");
      drawingElementsRef.current = elements;
      redrawCanvas();
    });
  });

  const redrawCanvas = () => {
    // Trigger redraw logic here
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = props.bcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw elements from drawingElementsRef
    drawingElementsRef.current.forEach((element) => {
      if (element.type === "lineTool") {
        drawLineTool(
          element.start,
          element.end,
          ctx,
          element.color,
          element.width
        );
      } else if (element.type === "circleTool") {
        drawCircleTool(
          element.start,
          element.end,
          ctx,
          element.color,
          element.width
        );
      } else if (element.type === "rectangle") {
        drawRectangle(
          element.start,
          element.end,
          ctx,
          element.color,
          element.width
        );
      } else if (element.type === "dot") {
        drawCircle(element.center, element.radius, ctx, props.bcolor);
      } else if (element.type === "pencilStroke") {
        drawPencilStroke(element.points, ctx, element.color, element.width);
      } else if (element.type === "lineToolE") {
        drawLineTool(
          element.start,
          element.end,
          ctx,
          props.bcolor,
          element.width
        );
      }
    });
  };

  function getMousePoints(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext("2d");
    return {
      x: x,
      y: y,
      context: ctx,
    };
    console.log(x + ", " + y);
  }

  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  function normalDrawing(e, isEraser = false) {
    const { x, y, context } = getMousePoints(e);

    const strokeId = currentPencilStroke;

    // Find the current pencil stroke in drawingElementsRef.currentRef and update it
    const pencilStroke = drawingElementsRef.current.find(
      (element) => element.type === "pencilStroke" && element.id === strokeId
    );

    if (pencilStroke) {
      const newPoints = [...pencilStroke.points, { x, y }];
      pencilStroke.points = newPoints;

      // Redraw the updated pencil stroke
      drawPencilStroke(pencilStroke.points, context, props.color, props.size);
    } else {
      // Handle non-pencil drawing logic here (e.g., eraser)
      drawStart(x, y, props.size, context, isEraser);
    }

    prevPointRef.current = { x: x, y: y };
  }

  function drawPencilStroke(points, ctx, color, width) {
    for (let i = 1; i < points.length; i++) {
      drawLineTool(points[i - 1], points[i], ctx, color, width);
    }
  }

  function drawStart(currentX, currentY, width, context, isEraser) {
    var color = props.color;
    if (isEraser) {
      color = props.bcolor;
      // Eraser - mne hi set kri hai
      drawLineTool(
        prevPointRef.current,
        { x: currentX, y: currentY },
        context,
        color,
        60
      );
      drawingElementsRef.current.push({
        type: "lineToolE",
        start: prevPointRef.current,
        end: { x: currentX, y: currentY },
        width: 60,
      });
    } else {
      drawLineTool(
        prevPointRef.current,
        { x: currentX, y: currentY },
        context,
        color,
        width
      );
      drawingElementsRef.current.push({
        type: "lineTool",
        start: prevPointRef.current,
        end: { x: currentX, y: currentY },
        color: color,
        width: width,
      });
    }
  }

  function drawCircleTool(start, end, context, color, width) {
    const radius = distance(start.x, start.y, end.x, end.y) / 2;
    context.beginPath();
    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
  }

  function drawRectangle(start, end, context, color, width) {
    context.lineWidth = width;
    context.strokeStyle = color;
    context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }

  function drawLineTool(start, end, ctx, color, width) {
    drawCircle(start, width / 2, ctx, color);
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    drawCircle(end, width / 2, ctx, color);
  }

  function drawCircle(start, radius, ctx, color) {
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = props.bcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      false
    );

    if (props.undoRedo == "undo") {
      if (drawingElementsRef.current.length != 0) {
        redoDrawingElements.current.push(drawingElementsRef.current.pop());
        props.setUndoRedo(null);
        setTimeout(() => {
          socket.emit("drawing", RoomID, drawingElementsRef.current);
        }, 100);
      }
    } else if (props.undoRedo == "redo") {
      if (redoDrawingElements.current.length != 0) {
        drawingElementsRef.current.push(redoDrawingElements.current.pop());
        props.setUndoRedo(null);
        setTimeout(() => {
          socket.emit("drawing", RoomID, drawingElementsRef.current);
        }, 100);
      }
    }

    if (props.clearBoard) {
      drawingElementsRef.current = [];
      redoDrawingElements.current = [];
      props.setClearBoard(false);
      setTimeout(() => {
        socket.emit("drawing", RoomID, drawingElementsRef.current);
      }, 100);
    }

    // Redraw
    try {
      drawingElementsRef.current.forEach((element) => {
        if (element.type === "lineTool") {
          drawLineTool(
            element.start,
            element.end,
            ctx,
            element.color,
            element.width
          );
        } else if (element.type === "circleTool") {
          drawCircleTool(
            element.start,
            element.end,
            ctx,
            element.color,
            element.width
          );
        } else if (element.type === "rectangle") {
          drawRectangle(
            element.start,
            element.end,
            ctx,
            element.color,
            element.width
          );
        } else if (element.type === "dot") {
          drawCircle(element.center, element.radius, ctx, props.bcolor);
        } else if (element.type === "pencilStroke") {
          drawPencilStroke(element.points, ctx, element.color, element.width);
        } else if (element.type === "lineToolE") {
          drawLineTool(
            element.start,
            element.end,
            ctx,
            props.bcolor,
            element.width
          );
        }
      });
    } catch (error) {
      console.log("Nothing to do");
    }
  }, [props.undoRedo, props.clearBoard, props.bcolor]);

  const handleMouseDown = (e) => {
    if (!props.hidden) {
      setIsDrawing(true);
    }
    const { x, y, context } = getMousePoints(e);
    if (props.tool === "eraser") {
      // Eraser memory - ye bhi mne hi kra hai - change mt kriyo bkl
      drawCircle({ x, y }, 30, context, props.bcolor);
      drawingElementsRef.current.push({
        type: "dot",
        center: { x, y },
        radius: 30,
      });
    } else if (props.tool === "pencil") {
      // Unique ID
      const newStrokeId = Date.now();
      setCurrentPencilStroke(newStrokeId);

      // Add a drawing element for the pencil stroke
      drawingElementsRef.current.push({
        type: "pencilStroke",
        id: newStrokeId,
        points: [{ x, y }],
        color: props.color,
        width: props.size,
      });
    }
    prevPointRef.current = { x: x, y: y };
    linePointsRef.current = { x: x, y: y };
    circlePointsRef.current = { x: x, y: y };
    rectPointsRef.current = { x: x, y: y };
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;

    const { x, y, context } = getMousePoints(event);

    if (props.tool === "pencil") {
      normalDrawing(event);
    } else if (props.tool === "eraser") {
      normalDrawing(event, true);
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = props.bcolor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // // Redraw

      drawingElementsRef.current.forEach((element) => {
        if (element.type === "lineTool") {
          drawLineTool(
            element.start,
            element.end,
            ctx,
            element.color,
            element.width
          );
        } else if (element.type === "circleTool") {
          drawCircleTool(
            element.start,
            element.end,
            ctx,
            element.color,
            element.width
          );
        } else if (element.type === "rectangle") {
          drawRectangle(
            element.start,
            element.end,
            ctx,
            element.color,
            element.width
          );
        } else if (element.type === "dot") {
          drawCircle(element.center, element.radius, ctx, props.bcolor);
        } else if (element.type === "pencilStroke") {
          drawPencilStroke(element.points, ctx, element.color, element.width);
        } else if (element.type === "lineToolE") {
          drawLineTool(
            element.start,
            element.end,
            ctx,
            props.bcolor,
            element.width
          );
        }
      });

      // dynamic
      switch (props.tool) {
        case "line":
          drawLineTool(
            linePointsRef.current,
            { x, y },
            context,
            props.color,
            props.size
          );
          break;
        case "circleTool":
          drawCircleTool(
            circlePointsRef.current,
            { x, y },
            context,
            props.color,
            props.size
          );
          break;

        case "rectangle":
          drawRectangle(
            rectPointsRef.current,
            { x, y },
            context,
            props.color,
            props.size
          );
          break;

        default:
          break;
      }
    }
  };

  const handleMouseUp = (e) => {
    const { x, y } = getMousePoints(e);

    setIsDrawing(false);

    if (props.tool === "line") {
      drawingElementsRef.current.push({
        type: "lineTool",
        start: linePointsRef.current,
        end: { x, y },
        color: props.color,
        width: props.size,
      });
    } else if (props.tool === "circleTool") {
      drawingElementsRef.current.push({
        type: "circleTool",
        start: circlePointsRef.current,
        end: { x, y },
        color: props.color,
        width: props.size,
      });
    } else if (props.tool === "rectangle") {
      drawingElementsRef.current.push({
        type: "rectangle",
        start: rectPointsRef.current,
        end: { x, y },
        color: props.color,
        width: props.size,
      });
    }

    setTimeout(() => {
      socket.emit("drawing", RoomID, drawingElementsRef.current);
    }, 100);

    setCurrentPencilStroke(null);
  };

  return (
    <>
      <canvas
        className="bg-white"
        width={"1600px"}
        height={"1600px"}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        ref={canvasRef}
      >
        Canvas
      </canvas>
      <div
        hidden={props.hidden}
        onClick={handleSave}
        className=" fixed right-0 bottom-0 bg-mycolor-500 font-semibold text-black hover:bg-mycolor-700 cursor-pointer m-2 py-2.5 px-6 rounded-xl transform duration-300"
      >
        Save
      </div>
      <div className="fixed right-0 bottom-0" hidden={saved}>
        <div className="flex flex-col items-end m-2 bg-green-100 p-1 rounded">
          <Saved></Saved>
          <img
            className="h-32 border-gray-500 border-2"
            src={imgg}
            alt="image"
          />
        </div>
      </div>
      <div hidden={!spin}>
        <Loader label={lab}></Loader>
      </div>
      {!props.isHost && show && (
        <EnterName
          onClick={handleEnterName}
          setEnterName={setEnterName}
        ></EnterName>
      )}
    </>
  );
}

export default MyBoard;
