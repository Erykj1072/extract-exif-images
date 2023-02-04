import React, { useState } from "react";
import EXIF from "exif-js";
import "./App.scss";

const ImageMeta = () => {
  const [data, setData] = useState("");
  const [raw, setRaw] = useState(false);
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
    }
  }

  // function toggleRaw() {
  //   if (toggleRaw === false){
  //     setRaw
  //   }
  // }
  return (
    <div className="container">
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
          >
            {JSON.stringify(data, null, 2)}
          </pre>
          <button className="toggleRaw" onClick={() => setRaw(false)}>
            Hide raw data
          </button>
        </div>
      ) : (
        <div>
          <button className="toggleRaw" onClick={() => setRaw(true)}>
            Show raw data
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageMeta;
