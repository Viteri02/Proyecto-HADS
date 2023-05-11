import React, { useState } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

import * as rrweb from "rrweb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

function MainContent({ activeContent }) {
  const [webpage, setWebpage] = useState("");
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);

  const handleWebpageChange = (event) => {
    setWebpage(event.target.value);
  };

  fetch('replayss.html')
  .then(response => response.text())
  .then(html => {
    const eventsRegex = /const events = (.*?);/;
    const match = eventsRegex.exec(html);
    if (match && match[1]) {
      const eventsContent = match[1].trim();
      console.log(eventsContent);
      //const eventos = JSON.stringify(eventsContent);
      //console.log(eventos);
      setEvents(eventsContent);
    } else {
      console.error('No se encontró la variable events en el archivo HTML.');
    }
  })
  .catch(error => {
    console.error('Error al cargar el archivo HTML:', error);
  });





  const handleButtonClick = () => {
    rrweb.record({
      emit(event) {
        setEvents((prevEvents) => [...prevEvents, event]);
      },
    });
  };

  const handleVideoClick = (videoUrl) => {
    const eventsData = JSON.parse(events);
    const replayer = new rrweb.Replayer(eventsData);
    replayer.play();
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
                      <FontAwesomeIcon
                        icon={faPlayCircle}
                        onClick={() => handleVideoClick(video.url)}
                        className="play-icon"
                      />
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
