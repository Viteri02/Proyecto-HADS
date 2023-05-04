import React from "react";

function MainContent({ activeContent }) {
  const renderContent = () => {
    switch (activeContent) {
      case "Grabar":
        return (
          <div>
            <h2>Contenido de Grabar</h2>
            <p>
              Aquí puedes agregar contenido relacionado con la función de
              grabar.
            </p>
          </div>
        );
      case "Videos":
        return (
          <div>
            <h2>Contenido de Ver Videos</h2>
            <table>
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Video 1</td>
                  <td>3:25</td>
                </tr>
                <tr>
                  <td>Video 2</td>
                  <td>4:10</td>
                </tr>
                <tr>
                  <td>Video 3</td>
                  <td>2:55</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="main-content">{renderContent()}</div>;
}

export default MainContent;
