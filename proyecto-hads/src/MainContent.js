import React, { useState } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

import * as rrweb from "rrweb";

import { record } from "rrweb";

function MainContent({ activeContent }) {
  const [webpage, setWebpage] = useState("");
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);

  const handleWebpageChange = (event) => {
    setWebpage(event.target.value);
  };

  const handleButtonClick = () => {
    rrweb.record({
      emit(event) {
        setEvents((prevEvents) => [...prevEvents, event]);
      },
    });
  };

  const handleVideoClick = (videoUrl) => {
    const player = new rrwebPlayer({
      target: document.getElementById("video-container"),
      props: {
        events: JSON.parse(atob(videoUrl)),
      },
    });
    player.play();
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
                  <th>Video</th>
                  <th>Duración</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, index) => (
                  <tr key={index}>
                    <td>{video.name}</td>
                    <td>{video.duration}</td>
                    <td>
                      <button
                        className="play-button"
                        onClick={() => handleVideoClick(video.url)}
                      >
                        Reproducir
                      </button>
                    </td>
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
                        url: btoa(JSON.stringify(events)),
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
