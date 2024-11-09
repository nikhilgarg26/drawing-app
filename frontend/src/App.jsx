import "./App.css";
import { Container } from "./components/container/Container";
import { NotFound } from "./components/NotFound";
import SideDrawer from "./components/SideDrawer";
import WhiteBoardProvider from "./context/whiteBoardProvider";
import { Dashboard } from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <WhiteBoardProvider>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/nikhil" element={<SideDrawer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/whiteboard/:RoomID" element={<Container />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WhiteBoardProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
