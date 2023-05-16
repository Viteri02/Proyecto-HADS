import React, { useState, useEffect } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

import * as rrweb from "rrweb";

function MainContent({ activeContent }) {
  const [webpage, setWebpage] = useState("");
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);

  const handleWebpageChange = (event) => {
    setWebpage(event.target.value);
  };

  const loadEvents = async () => {
    const response = await fetch("../replays/");
    const jsonData = await response.json();
    setEvents(jsonData);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleButtonClick = () => {
    rrweb.record({
      emit(event) {
        setEvents((prevEvents) => [...prevEvents, event]);
      },
    });
  };

  const handleVideoClick = (videoIndex) => {
    const eventsData = videos[videoIndex].events;
    const playerWindow = window.open("", "_blank");

    if (playerWindow) {
      const playerHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Reproductor rrweb</title>
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/rrweb-player/dist/style.css">
          </head>
          <body>
            <div id="player-container"></div>
            
            <script src="https://unpkg.com/rrweb-player"></script>
            <script>
              const eventsData = ${JSON.stringify(eventsData)};
              const player = new rrwebPlayer({
                target: document.getElementById("player-container"),
                data: { events: eventsData },
              });
              player.play();
            </script>
          </body>
        </html>
      `;

      playerWindow.document.write(playerHTML);
      playerWindow.document.close();
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case "Grabar":
        return (
          <div>
            <h2>Contenido de Grabar</h2>
            <form>
              <label htmlFor="webpage-input">Página Web:</label>
              <input
                type="text"
                id="webpage-input"
                value={webpage}
                onChange={handleWebpageChange}
              />
              <button type="button" onClick={handleButtonClick}>
                Grabar
              </button>
            </form>
          </div>
        );

      case "Videos":
        return (
          <div>
            <h2>Contenido de Ver Videos</h2>
            <table>
              <thead>
                <tr>
                  <th>Acción</th>
                  <th>Video</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleVideoClick(index)}
                      >
                        Reproducir
                      </button>
                    </td>
                    <td>{video.name}</td>
                    <td>{video.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length > 0 && (
              <div>
                <h2>Contenido de Grabación</h2>
                <button
                  className="play-button"
                  onClick={() =>
                    setVideos((prevVideos) => [
                      ...prevVideos,
                      {
                        name: "Grabación",
                        duration: `${
                          events[events.length - 1].timestamp -
                          events[0].timestamp
                        } ms`,
                        events: [...events],
                      },
                    ])
                  }
                >
                  Finalizar Grabación
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="main-content">
      {renderContent()}
      <div id="video-container"></div>
    </div>
  );
}

export default MainContent;
