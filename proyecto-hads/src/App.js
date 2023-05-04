import "./App.css";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

function App() {
  const [activeContent, setActiveContent] = useState("");

  return (
    <div className="app">
      <Sidebar setActiveContent={setActiveContent} />
      <MainContent activeContent={activeContent} />
    </div>
  );
}

export default App;
