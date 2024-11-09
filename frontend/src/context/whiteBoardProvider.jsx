import React, { createContext, useContext, useState } from "react";

const WhiteBoardContext = createContext();

const WhiteBoardProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState();
  const [isHost, setIsHost] = useState();
  const [isOwner, setIsOwner] = useState();
  const [chats, setChats] = useState([]);
  return (
    <WhiteBoardContext.Provider
      value={{
        people,
        setPeople,
        name,
        setName,
        isHost,
        setIsHost,
        isOwner,
        setIsOwner,
        chats,
        setChats,
      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};

export const WhiteBoardState = () => {
  return useContext(WhiteBoardContext);
};

export default WhiteBoardProvider;
