import React from "react";

const MessageBox = ({ sender, you, message }) => {
  return (
    <div
      className={`w-fit pt-0.5 p-2 max-w-60 rounded text-sm mb-2 flex-wrap ${
        you ? "bg-green-200 self-start" : "bg-blue-200 self-end"
      }`}
    >
      <h3 className="font-bold">{you ? "You" : sender}</h3>
      <span>{message}</span>
    </div>
  );
};

export default MessageBox;
