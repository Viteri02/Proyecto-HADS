import React from "react";

function Sidebar({ setActiveContent }) {
  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  return (
    <div className="sidebar">
      <h2>Opciones</h2>
      <div className="sidebar-buttons">
        <button onClick={() => handleButtonClick("Grabar")}>Grabar</button>
        <button onClick={() => handleButtonClick("Videos")}>Ver Videos</button>
      </div>
    </div>
  );
}

export default Sidebar;
