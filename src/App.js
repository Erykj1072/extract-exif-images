import React, { useState } from "react";
import EXIF from "exif-js";
import "./App.scss";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactTimeAgo from "react-time-ago";

const ImageMeta = () => {
  const [data, setData] = useState("");
  const [fileName, setFileName] = useState();

  const [rawData, displayRawData] = useState(false);
  const [rawToggle, displayRawToggle] = useState(false);
  const [error, displayError] = useState(false);

  function formatDate(date) {
    const dateTime = date.split(" ", 2);
    const formatedDate = dateTime[0].replaceAll(":", "-") + "T" + dateTime[1];
    return formatedDate;
  }

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
      setFileName(file.name);
      if (Object.keys(exifData).length === 0) {
        displayRawToggle(false);
        displayError(true);
        displayRawData(false);
      } else {
        displayRawToggle(true);
        displayError(false);
      }
    }
  }

  return (
    <div className="container">
      <h1 className="title">Exif.Data</h1>
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
      <span className="filename">{fileName}</span>
      <span className={`error ${error ? "" : "hide"}`}>No exif data</span>
      <br />

      {data.DateTime && data.DateTime !== "0000:00:00 00:00:00" ? (
        <div className="timestamp">
          <p className="timestamp__readable">
            Taken{" "}
            <ReactTimeAgo
              date={new Date(formatDate(data.DateTime))}
              locale="en-US"
            />
          </p>
          <p className="timestamp__raw">{data.DateTime}</p>
        </div>
      ) : null}
      {rawData ? (
        <div>
          <pre
            style={{
              width: "100%",
              maxHeight: "500px",
              overflow: "scroll",
              maxWidth: "100%",
              overflowX: "hidden",
            }}
            className={` ${rawToggle ? "" : "hide"}`}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
          <button
            className={` ${rawToggle ? "toggleraw" : "hide"}`}
            onClick={() => displayRawData(false)}
          >
            Hide raw data
          </button>
          <CopyToClipboard text={JSON.stringify(data, null, 2)}>
            <button className="copy">Copy</button>
          </CopyToClipboard>
        </div>
      ) : (
        <div>
          <button
            className={` ${rawToggle ? "toggleraw" : "hide"}`}
            onClick={() => displayRawData(true)}
          >
            Show raw data
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageMeta;
