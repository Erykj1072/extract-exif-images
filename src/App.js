import React, { useState } from "react";
import EXIF from "exif-js";
import "./App.scss";

const ImageMeta = () => {
  const [data, setData] = useState("");
  const [raw, setRaw] = useState(false);
  const [showRawButton, setShowRawButton] = useState(false);
  const [showError, setShowError] = useState(false);
  async function handleChange({
    target: {
      files: [file],
    },
  }) {
    if (file && file.name) {
      const exifData = await new Promise((resolve) => {
        EXIF.getData(file, function () {
          resolve(EXIF.getAllTags(file));
        });
      });

      setData(exifData);
      if (Object.keys(exifData).length === 0) {
        console.log("This does not contain metadata");
        setShowError(true);
        setShowRawButton(false);
        setRaw(false);
      } else {
        setShowRawButton(true);
        setShowError(false);
      }
    }

    console.log(data);
  }

  return (
    <div className="container">
      <h1 className="title">Exif.Meta</h1>
      <div className="file">
        <input
          type="file"
          name="file"
          id="file"
          className="inputfile"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
        />
        <label htmlFor="file">Choose a file</label>
      </div>
      <span className={`error ${showError ? "" : "hide"}`}>No metadata</span>
      <br />

      {data.DateTime ? (
        <div className="timestamp">
          <p className="timestamp__label">Timestamp</p>
          <span className="timestamp__output">{data.DateTime}</span>
        </div>
      ) : null}
      {raw ? (
        <div>
          <pre
            style={{ width: "100%", maxHeight: "500px", overflow: "scroll" }}
            className={` ${showRawButton ? "" : "hide"}`}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
          <button
            className={` ${showRawButton ? "toggleraw" : "hide"}`}
            onClick={() => setRaw(false)}
          >
            Hide raw data
          </button>
        </div>
      ) : (
        <div>
          <button
            className={` ${showRawButton ? "toggleraw" : "hide"}`}
            onClick={() => setRaw(true)}
          >
            Show raw data
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageMeta;
