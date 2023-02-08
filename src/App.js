import React, { useState, useEffect } from "react";
import EXIF from "exif-js";
import "./App.scss";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactTimeAgo from "react-time-ago";

const ImageMeta = () => {
  const [data, setData] = useState("");
  const [fileName, setFileName] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const [rawData, displayRawData] = useState(false);
  const [rawToggle, displayRawToggle] = useState(false);
  const [error, displayError] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };
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
          onChange={(e) => {
            handleChange(e);
            onSelectFile(e);
          }}
        />
        <label htmlFor="file">Choose a file</label>
      </div>
      {selectedFile && <img src={preview} alt="preview" className="preview" />}
      <span className="filename">{fileName}</span>
      <span className={`error ${error ? "" : "hide"}`}>No data</span>
      <br />

      {data.DateTime && data.DateTime !== "0000:00:00 00:00:00" ? (
        <div className="timestamp">
          <span className="timestamp__readable">
            Taken{" "}
            <ReactTimeAgo
              date={new Date(formatDate(data.DateTime))}
              locale="en-US"
            />
          </span>
          <p className="timestamp__raw">{data.DateTime}</p>
        </div>
      ) : null}
      {rawData ? (
        <div>
          <pre className={`rawview ${rawToggle ? "" : "hide"}`}>
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
