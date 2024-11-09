const express = require("express");
const { Drawing, User } = require("../db");
const { authMiddleware, drawingAuthMiddleware } = require("../middleware");

const drawingRouter = express.Router();

drawingRouter.post("/create", authMiddleware, async (req, res) => {
  const { title } = req.body;

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = mm + "/" + dd + "/" + yyyy;

  const drawing = await Drawing.create({
    userId: req.userId,
    elementsArray: [],
    title: title,
    created: formattedToday,
    image: "",
  });
  res.json({
    message: "Created Successfully",
    drawId: drawing._id,
  });
});

drawingRouter.put("/updateInfo", authMiddleware, async (req, res) => {
  const { imgId, elementsArray, image } = req.body;
  try {
    await Drawing.updateOne(
      {
        _id: imgId,
      },
      {
        elementsArray: elementsArray,
        image: image,
      }
    );

    res.json({
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(411).json({
      message: "Failed to Save",
    });
  }
});

drawingRouter.get("/user-drawings", authMiddleware, async (req, res) => {
  const drawings = await Drawing.find({
    userId: req.userId,
  });

  res.json({
    drawings: drawings,
  });
});

//"/5wegerb54ffg65b6sd5b"

drawingRouter.get("/:DrawId", drawingAuthMiddleware, async (req, res) => {
  const drawId = req.params["DrawId"];
  const isHost = req.isHost;

  const drawing = await Drawing.findOne({
    _id: drawId,
  });

  const user = await User.findOne({
    _id: req.userId,
  });

  res.json({
    message: "sending",
    drawing: drawing,
    isHost: isHost,
    name: user ? user.fullName : null,
    isOwner: drawing.userId == req.userId ? true : false,
  });
});

module.exports = {
  drawingRouter,
};
