import React, { useState, useEffect } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import * as rrweb from "rrweb";
import filenames from './filenames.json';
import { FaPlay } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function MainContent({ activeContent }) {
  const [webpage, setWebpage] = useState("");
  const [events, setEvents] = useState([]);
  const [files, setFiles] = useState(filenames);
  const [grabacion, setGrabacion] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const handleWebpageChange = (event) => {
    setWebpage(event.target.value);
  };

  const convertToSeconds = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
  };

  const loadEvents = async () => {
    try {
      const directoryPath = './replays';
      const fileNamesWithExtension = files.map(fileName => `${fileName}.json`);
      const tempEvents = [];

      for (const fileName of fileNamesWithExtension) {
        const filePath = `${directoryPath}/${fileName}`;
        const response = await fetch(filePath);
        const jsonData = await response.json();
        tempEvents.push(jsonData);
      }

      setEvents(prevEvents => [...prevEvents, ...tempEvents]);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  };


  useEffect(() => {
    loadEvents();
  }, []);

  const handleButtonClick = () => {
    setIsRecording(true);
    setStartDate(new Date());
    rrweb.record({
      emit(event) {
        setGrabacion((prevGrab) => [...prevGrab, event]);
      },
    });
  }

  const handleButtonClick1 = () => {
    const eventsData = grabacion;
    setIsRecording(false);
    setStartDate(null);
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

  const handleVideoClick = (index) => {
    const eventsData = events[index];
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
          <div className="center">
            <h2>Grabación</h2>
            <div className="button-container">
            <button type="button" onClick={handleButtonClick}>
                Grabar
            </button>
            </div>
            {isRecording && events.length > 0 && (
              <div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                />
                <div className="button-container">
                    <button type="button" onClick={handleButtonClick1}>
                    Finalizar
                    </button>
                </div>
              </div>
            )}
          </div>
        );
      case "Videos":
        return (
          <div>
            <h2>Reproducir repeticiones</h2>
            <table>
              <thead>
                <tr>
                  <th>Reproducir</th>
                  <th>Título</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                {files.map((nombre, index) => (
                  <tr key={index}>
                    <td>
                      <button type="button" className="play-button" onClick={() => handleVideoClick(index)}>
                        <FaPlay />
                      </button>
                    </td>
                    <td>{nombre}</td>
                    <td>{convertToSeconds(events[index][events[index].length - 1].timestamp - events[index][0].timestamp)} Seconds</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
