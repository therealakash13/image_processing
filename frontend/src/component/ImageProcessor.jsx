import { useState, useEffect } from "react";
import axios from "axios";
const defaultLevels = {
  grayscale: 0,
  rotate: 0,
  blur: 1,
  sharpen: 1,
};

function ImageProcessor() {
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [operation, setOperation] = useState("grayscale");
  const [level, setLevel] = useState(0);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImageUrl(URL.createObjectURL(file));
      setProcessedImageUrl(null);
    }
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = processedImageUrl;
    link.download = "processed-image.png";
    link.click();
  }

  useEffect(() => {
    setLevel(defaultLevels[operation]);
  }, [operation]);

  useEffect(() => {
    if (!image || !operation) return;

    const needLevel = ["rotate", "blur", "sharpen"].includes(operation);
    // returns true if operations are one of them

    if ((needLevel && level === null) || level === "") return; // another check for angle and operations

    const timeout = setTimeout(async () => {
      const imageBuffer = await image.arrayBuffer(); // converting image file to buffer stream

      try {
        const response = await axios.post(
          `https://image-processor-backend.onrender.com/upload?op=${operation}&level=${level}`,
          imageBuffer,
          {
            headers: { "Content-Type": "application/octet-stream" },
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);

        setProcessedImageUrl(imageUrl);
      } catch (err) {
        const decoder = new TextDecoder("utf-8"); // initializing new decoder
        const errorText = decoder.decode(err.response.data); // decoding array buffer
        const errorJson = JSON.parse(errorText); // parsing stringified json

        const { error, message } = errorJson; // extracting error and message from json

        alert(message + " : " + error);
      }
    }, 300); // debounce request for 300ms

    return () => clearTimeout(timeout); // clearing timeout
  }, [image, operation, level]);

  return (
    <div className="processor-container">
      {/* Left Panel – Controls */}
      <div className="controls-box">
        <h2>Controls</h2>

        <label className="label">Choose Operation</label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="select-box"
        >
          <option value="grayscale">Grayscale</option>
          <option value="rotate">Rotate (90°)</option>
          <option value="blur">Blur</option>
          <option value="sharpen">Sharpen</option>
        </select>

        {!previewImageUrl && (
          <label className="file-upload">
            Choose a file{" "}
            <span className="material-symbols-outlined">upload</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        )}

        {["rotate", "blur", "sharpen"].includes(operation) && (
          <div className="slider-box">
            <label className="label">Intensity</label>
            <input
              type="range"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              min={operation === "rotate" ? 0 : 1}
              max={operation === "rotate" ? 360 : 10}
              step={operation === "rotate" ? 90 : 1}
            />
            <span className="slider-value">{level}</span>
          </div>
        )}

        {processedImageUrl && (
          <button className="btn-download" onClick={handleDownload}>
            Download Processed Image <span className="material-symbols-outlined">download</span>
          </button>
        )}
      </div>

      {/* Right Panel – Images */}
      <div className="preview-panel">
        {previewImageUrl && (
          <div className="preview-block">
            <h3>Original</h3>
            <img src={previewImageUrl} alt="original" />
          </div>
        )}

        {processedImageUrl && (
          <div className="preview-block">
            <h3>Processed</h3>
            <img src={processedImageUrl} alt="processed" />
          </div>
        )}
      </div>
    </div>
  );
}
export default ImageProcessor;
